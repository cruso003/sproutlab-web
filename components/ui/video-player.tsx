'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onDurationChange?: (duration: number) => void;
  autoMarkComplete?: boolean;
  className?: string;
}

// YouTube player interface
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  onProgress,
  onComplete,
  onDurationChange,
  autoMarkComplete = true,
  className = ''
}) => {
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube video ID
  const extractYouTubeId = useCallback((url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, []);

  // Initialize video type and ID
  useEffect(() => {
    const isYT = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    setIsYouTubeVideo(isYT);
    
    if (isYT) {
      const id = extractYouTubeId(videoUrl);
      setVideoId(id);
    }
  }, [videoUrl, extractYouTubeId]);

  // Load YouTube API
  useEffect(() => {
    if (isYouTubeVideo && videoId && !window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else if (isYouTubeVideo && videoId && window.YT) {
      initializePlayer();
    }
  }, [isYouTubeVideo, videoId]);

  // Initialize YouTube player
  const initializePlayer = useCallback(() => {
    if (!videoId || !playerRef.current) return;

    const ytPlayer = new window.YT.Player(playerRef.current, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        controls: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });

    setPlayer(ytPlayer);
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    setIsLoaded(true);
    const videoDuration = event.target.getDuration();
    setDuration(videoDuration);
    if (onDurationChange) {
      onDurationChange(videoDuration);
    }
    startProgressTracking();
  };

  const onPlayerStateChange = (event: any) => {
    const playerState = event.data;
    
    if (playerState === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTracking();
    } else if (playerState === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressTracking();
    } else if (playerState === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      setIsCompleted(true);
      stopProgressTracking();
      if (autoMarkComplete && onComplete) {
        onComplete();
      }
    }
  };

  // Progress tracking
  const startProgressTracking = () => {
    if (progressIntervalRef.current) return;
    
    progressIntervalRef.current = setInterval(() => {
      if (player && typeof player.getCurrentTime === 'function') {
        const current = player.getCurrentTime();
        const total = player.getDuration();
        
        setCurrentTime(current);
        setProgress((current / total) * 100);
        
        if (onProgress) {
          onProgress((current / total) * 100);
        }
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Control functions
  const togglePlayPause = () => {
    if (!player) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!player || !duration) return;
    
    const seekTime = (value[0] / 100) * duration;
    player.seekTo(seekTime);
    setCurrentTime(seekTime);
    setProgress(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!player) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    player.setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!player) return;
    
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const restart = () => {
    if (!player) return;
    
    player.seekTo(0);
    setCurrentTime(0);
    setProgress(0);
    setIsCompleted(false);
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-hide controls
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (!isYouTubeVideo) {
    // Fallback for non-YouTube videos
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">External video content</p>
            <Button
              onClick={() => window.open(videoUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Watch Video
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-slate-900 border-slate-700 overflow-hidden ${className}`}>
      <div 
        className="relative aspect-video bg-black group cursor-pointer"
        onMouseMove={showControlsTemporarily}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (isPlaying) {
            setShowControls(false);
          }
        }}
      >
        {/* YouTube Player */}
        <div 
          ref={playerRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Video Completed!</h3>
              <p className="text-gray-300 mb-4">Great job finishing this lesson.</p>
              <Button onClick={restart} variant="outline" className="mr-2">
                <RotateCcw className="w-4 h-4 mr-2" />
                Watch Again
              </Button>
            </div>
          </div>
        )}

        {/* Custom Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlayPause}
                className="text-white hover:text-blue-400"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={restart}
                className="text-white hover:text-blue-400"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;

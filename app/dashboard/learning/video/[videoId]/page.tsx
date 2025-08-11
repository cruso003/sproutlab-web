'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Play, CheckCircle, ExternalLink, Award } from 'lucide-react';
import VideoPlayer from '@/components/ui/video-player';
import VideoProgressIndicator from '@/components/ui/video-progress';
import api from '@/lib/api';

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  difficulty: string;
  skill: string;
  topic: string;
  projectRelevance: string;
  instructor?: string;
}

export default function VideoViewerPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.videoId as string;
  
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState({
    currentTime: 0,
    duration: 0,
    completed: false
  });

  useEffect(() => {
    // Get projectId from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const urlProjectId = urlParams.get('projectId');
    
    console.log('=== VIDEO VIEWER DEBUG ===');
    console.log('URL:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('Extracted projectId:', urlProjectId);
    
    if (urlProjectId) {
      setProjectId(urlProjectId);
      // Check if this video is already completed
      checkIfCompleted(urlProjectId, videoId);
    } else {
      console.warn('No projectId found in URL search params');
    }

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const checkIfCompleted = async (projId: string, vidId: string) => {
    try {
      const progressResponse = await api.learning.getProgress(projId);
      if (progressResponse.success && progressResponse.data) {
        const completedItem = progressResponse.data.progress?.find(
          (p: any) => p.itemId === vidId && p.completed
        );
        if (completedItem) {
          setCompleted(true);
          console.log('Video already completed!');
        }
      }
    } catch (err) {
      console.error('Failed to check completion status:', err);
    }
  };

  const fetchVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.learning.getVideo(videoId);
      if (response.success && response.data) {
        setVideo(response.data);
      } else {
        setError('Failed to load video content');
      }
    } catch (err: any) {
      console.error('Error fetching video:', err);
      setError(err.message || 'Failed to load video content');
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    console.log('=== MARK VIDEO AS COMPLETED DEBUG ===');
    console.log('video:', video);
    console.log('projectId:', projectId);
    console.log('videoId:', videoId);
    
    if (!video || !projectId) {
      console.error('Missing video or projectId:', { video: !!video, projectId });
      return;
    }
    
    try {
      // Save progress for the video
      const videoRequestData = {
        projectId,
        itemId: video.id,
        itemType: 'video' as const,
        completed: true,
        xpEarned: 20
      };
      
      console.log('Sending video progress request:', videoRequestData);
      
      const videoResponse = await api.learning.saveProgress(videoRequestData);
      
      console.log('Video progress response:', videoResponse);

      // Also save progress for the corresponding task
      // Map video IDs to task IDs based on the pattern
      let taskId = null;
      
      // Smart mapping based on video content/title
      if (video.title.includes('Smart Cities') || video.title.includes('Internet of Things')) {
        taskId = 'task-video-0';
      } else if (video.title.includes('development') || video.title.includes('infrastructure')) {
        taskId = 'task-video-1';
      } else if (video.title.includes('Civil Infrastructure') || video.title.includes('monitoring')) {
        taskId = 'task-video-2';
      } else if (video.title.includes('implementation') || video.title.includes('system')) {
        taskId = 'task-video-3';
      }

      console.log(`Mapped video "${video.title}" (${video.id}) to task: ${taskId}`);

      // If we found a corresponding task, save progress for it too
      if (taskId) {
        const taskRequestData = {
          projectId,
          itemId: taskId,
          itemType: 'video' as const, // Keep same itemType for consistency
          completed: true,
          xpEarned: 20
        };
        
        console.log('Sending task progress request:', taskRequestData);
        
        const taskResponse = await api.learning.saveProgress(taskRequestData);
        console.log('Task progress response:', taskResponse);
      }
      
      if (videoResponse.success) {
        setCompleted(true);
        console.log('Video progress saved successfully! +20 XP earned');
        // You could add a toast notification here
      } else {
        console.error('Failed to save video progress:', videoResponse);
      }
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  };

  const handleWatchOnYouTube = () => {
    if (video?.url) {
      window.open(video.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
          </div>
          
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading video content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
          </div>
          
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-4">Error Loading Video</h2>
                <p className="text-gray-300 mb-4">{error}</p>
                <Button onClick={fetchVideo} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
          </div>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-4">Video Not Found</h2>
                <p className="text-gray-300">The requested video content could not be found.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{video.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {video.duration}
                </span>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {video.difficulty}
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {video.skill}
                </Badge>
              </div>
            </div>
            
            {completed ? (
              <div className="flex items-center space-x-2 bg-green-600/20 border border-green-400/30 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Completed</span>
              </div>
            ) : (
              <Button
                onClick={markAsCompleted}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer
              videoUrl={video.url}
              title={video.title}
              onProgress={(progress) => {
                // Update video progress state
                setVideoProgress(prev => ({
                  ...prev,
                  currentTime: (progress / 100) * prev.duration
                }));
              }}
              onDurationChange={(duration) => {
                setVideoProgress(prev => ({ ...prev, duration }));
              }}
              onComplete={() => {
                console.log('Video completed!');
                setVideoProgress(prev => ({ ...prev, completed: true }));
                if (!completed) {
                  markAsCompleted();
                }
              }}
              autoMarkComplete={true}
            />
            
            {/* Video Description */}
            <Card className="bg-white/5 border-white/10 mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">About This Video</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {video.description}
                </p>
                
                {video.projectRelevance && (
                  <div className="bg-blue-600/10 border border-blue-400/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-medium mb-2">
                      <Award className="w-4 h-4 inline mr-2" />
                      Project Relevance
                    </h4>
                    <p className="text-gray-300 text-sm">{video.projectRelevance}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Video Details */}
          <div className="space-y-6">
            {/* Video Progress */}
            <VideoProgressIndicator 
              progress={{
                ...videoProgress,
                completed: completed
              }} 
            />
            
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Video Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Duration</h4>
                  <p className="text-white">{video.duration}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Difficulty</h4>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {video.difficulty}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Skill</h4>
                  <p className="text-white">{video.skill}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Topic Focus</h4>
                  <p className="text-white">{video.topic}</p>
                </div>
                
                {video.instructor && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Instructor</h4>
                    <p className="text-white">{video.instructor}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {completed ? (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Video Completed! 🎉</h3>
                      <p className="text-gray-400 text-sm">You've earned 20 XP and completed this video.</p>
                    </div>
                    <Button
                      onClick={() => router.back()}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm">
                      Watch this video to learn essential concepts for your project.
                    </p>
                    <Button
                      onClick={markAsCompleted}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed (+20 XP)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

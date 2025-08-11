'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Play } from 'lucide-react';

interface VideoProgress {
  currentTime: number;
  duration: number;
  completed: boolean;
}

interface VideoProgressIndicatorProps {
  progress: VideoProgress;
  className?: string;
}

const VideoProgressIndicator: React.FC<VideoProgressIndicatorProps> = ({
  progress,
  className = ''
}) => {
  const progressPercentage = progress.duration > 0 ? (progress.currentTime / progress.duration) * 100 : 0;
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-300">Watch Progress</h4>
          {progress.completed ? (
            <div className="flex items-center text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </div>
          ) : (
            <div className="flex items-center text-blue-400 text-sm">
              <Play className="w-4 h-4 mr-1" />
              Watching
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-2 transition-all duration-300 rounded-full ${
              progress.completed ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(progress.currentTime)}
          </span>
          <span>{formatTime(progress.duration)}</span>
        </div>
        
        {/* Progress Percentage */}
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-white">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoProgressIndicator;

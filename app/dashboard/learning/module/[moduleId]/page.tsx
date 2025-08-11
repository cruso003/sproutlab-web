'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, BookOpen, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: string;
  difficulty: string;
  type: string;
  confidence: string;
}

// Function to format markdown-like content to JSX
const formatModuleContent = (content: string) => {
  const lines = content.split('\n');
  const elements: React.ReactElement[] = [];
  let currentSection: React.ReactElement[] = [];
  let key = 0;

  const flushSection = () => {
    if (currentSection.length > 0) {
      elements.push(<div key={`section-${key++}`} className="space-y-3">{currentSection}</div>);
      currentSection = [];
    }
  };

  // Helper function to parse inline bold text
  const parseInlineText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.replace(/\*\*/g, '');
        return (
          <span key={index} className="text-blue-400 font-semibold">
            {boldText}
          </span>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      flushSection();
      continue;
    }

    // Bold headers (like **Module Title:**)
    if (line.startsWith('**') && line.endsWith('**')) {
      flushSection();
      const title = line.replace(/\*\*/g, '');
      elements.push(
        <h2 key={`title-${key++}`} className="text-xl font-bold text-white mt-6 mb-3 border-b border-blue-400/30 pb-2">
          {title}
        </h2>
      );
      continue;
    }

    // Numbered lists
    if (line.match(/^\d+\.\s/)) {
      const text = line.replace(/^\d+\.\s/, '');
      const listNumber = line.split('.')[0];
      currentSection.push(
        <div key={`list-${key++}`} className="flex flex-col space-y-1">
          <div className="text-gray-300">
            <span className="text-blue-400 font-medium">{listNumber}.</span>{' '}
            {parseInlineText(text)}
          </div>
        </div>
      );
      continue;
    }

    // Section headers (like "Learning Objective:", "Core Concepts:")
    if (line.endsWith(':') && !line.includes('**') && line.split(' ').length <= 4) {
      flushSection();
      elements.push(
        <h3 key={`section-${key++}`} className="text-lg font-semibold text-blue-400 mt-6 mb-3">
          {line}
        </h3>
      );
      continue;
    }

    // Bold inline text (like **Core Concepts:**)
    if (line.includes('**') && line.split('**').length === 3) {
      const parts = line.split('**');
      currentSection.push(
        <div key={`bold-${key++}`} className="text-gray-300">
          <span className="text-blue-400 font-semibold">{parts[1]}:</span> {parts[2]}
        </div>
      );
      continue;
    }

    // Regular paragraphs (with inline bold text support)
    currentSection.push(
      <p key={`para-${key++}`} className="text-gray-300 leading-relaxed">
        {parseInlineText(line)}
      </p>
    );
  }

  flushSection();
  return elements;
};

export default function ModuleViewerPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.moduleId as string;
  
  const [module, setModule] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Get projectId from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const urlProjectId = urlParams.get('projectId');
    
    console.log('=== PROJECT ID EXTRACTION DEBUG ===');
    console.log('URL:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('Extracted projectId:', urlProjectId);
    
    if (urlProjectId) {
      setProjectId(urlProjectId);
      // Check if this module is already completed
      checkIfCompleted(urlProjectId, moduleId);
    } else {
      console.warn('No projectId found in URL search params');
    }

    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  const checkIfCompleted = async (projId: string, modId: string) => {
    try {
      const progressResponse = await api.learning.getProgress(projId);
      if (progressResponse.success && progressResponse.data) {
        const completedItem = progressResponse.data.progress?.find(
          (p: any) => p.itemId === modId && p.completed
        );
        if (completedItem) {
          setCompleted(true);
          console.log('Module already completed!');
        }
      }
    } catch (err) {
      console.error('Failed to check completion status:', err);
    }
  };

  const fetchModule = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.learning.getModule(moduleId);
      if (response.success && response.data) {
        setModule(response.data);
      } else {
        setError('Failed to load module content');
      }
    } catch (err: any) {
      console.error('Error fetching module:', err);
      setError(err.message || 'Failed to load module content');
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    console.log('=== MARK AS COMPLETED DEBUG ===');
    console.log('module:', module);
    console.log('projectId:', projectId);
    console.log('moduleId:', moduleId);
    
    if (!module || !projectId) {
      console.error('Missing module or projectId:', { module: !!module, projectId });
      return;
    }
    
    try {
      // First save progress for the module itself
      const moduleRequestData = {
        projectId,
        itemId: module.id,
        itemType: 'module' as const,
        completed: true,
        xpEarned: 25
      };
      
      console.log('Sending module progress request:', moduleRequestData);
      
      const moduleResponse = await api.learning.saveProgress(moduleRequestData);
      
      console.log('Module progress response:', moduleResponse);

      // Also save progress for the corresponding task
      // Map module IDs to task IDs based on the pattern
      let taskId = null;
      
      // Smart mapping based on module ID and title
      if (module.id === 'module-ideation-1' || module.title.includes('ideation Module 1')) {
        taskId = 'task-theory-0';
      } else if (module.id === 'module-ideation-2' || module.title.includes('ideation Module 2')) {
        taskId = 'task-theory-1';
      } else if (module.id.includes('video') || module.title.toLowerCase().includes('video') || 
                 module.title.includes('Internet of Things') || module.title.includes('Smart Cities')) {
        // For video modules, try to map based on content or order
        if (module.title.includes('Smart Cities') || module.title.includes('Internet of Things')) {
          taskId = 'task-video-0';
        } else if (module.title.includes('development') || module.title.includes('infrastructure IoT development')) {
          taskId = 'task-video-1';
        } else if (module.title.includes('Civil Infrastructure') || module.title.includes('monitoring')) {
          taskId = 'task-video-2';
        } else if (module.title.includes('implementation') || module.title.includes('system implementation')) {
          taskId = 'task-video-3';
        }
      }

      console.log(`Mapped module "${module.title}" (${module.id}) to task: ${taskId}`);

      // If we found a corresponding task, save progress for it too
      if (taskId) {
        const taskRequestData = {
          projectId,
          itemId: taskId,
          itemType: 'module' as const, // Keep same itemType for consistency
          completed: true,
          xpEarned: 25
        };
        
        console.log('Sending task progress request:', taskRequestData);
        
        const taskResponse = await api.learning.saveProgress(taskRequestData);
        console.log('Task progress response:', taskResponse);
      }
      
      if (moduleResponse.success) {
        setCompleted(true);
        console.log('Progress saved successfully! +25 XP earned');
        // You could add a toast notification here
      } else {
        console.error('Failed to save progress - API returned success: false', moduleResponse);
      }
    } catch (error) {
      console.error('Failed to save progress - Exception thrown:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Error response data:', axiosError.response?.data);
        console.error('Error response status:', axiosError.response?.status);
      }
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
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">Loading Module...</h1>
          </div>
          
          <div className="space-y-6">
            <div className="h-20 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-96 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-900/30 border-red-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">Failed to Load Module</h2>
              <p className="text-gray-300 mb-4">{error || 'Module not found'}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={fetchModule} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
              <p className="text-gray-300">{module.description}</p>
            </div>
            
            {completed && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Module Meta */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{module.duration}</span>
              </div>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                {module.difficulty}
              </Badge>
              <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                {module.type}
              </Badge>
              <Badge variant="outline" className="border-green-400/30 text-green-300">
                {module.confidence}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Module Content */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white">Module Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
              {formatModuleContent(module.content)}
            </div>
          </CardContent>
        </Card>

        {/* Completion Action */}
        {!completed && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-white font-semibold mb-2">Ready to Complete?</h3>
              <p className="text-gray-300 mb-4">
                Mark this module as completed to earn XP and advance your learning journey.
              </p>
              {!projectId && (
                <p className="text-yellow-400 text-sm mb-4">
                  ⚠️ No project ID found. Make sure you opened this from the learning page.
                </p>
              )}
              <Button 
                onClick={markAsCompleted}
                disabled={!projectId}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {projectId ? 'Mark as Completed (+25 XP)' : 'Cannot Save Progress'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completion Success */}
        {completed && (
          <Card className="bg-green-900/30 border-green-400/20">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Module Completed! 🎉</h3>
              <p className="text-green-300 mb-4">
                You've earned 25 XP and completed this learning module.
              </p>
              <Button 
                onClick={() => window.close()}
                variant="outline"
                className="border-green-400/30 text-green-300 hover:bg-green-600/20"
              >
                Close Window
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

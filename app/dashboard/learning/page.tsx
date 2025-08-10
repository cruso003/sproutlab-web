'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  BookOpen, 
  PlayCircle, 
  Target, 
  Rocket, 
  Star, 
  Trophy, 
  CheckCircle, 
  Lock, 
  Brain, 
  Wrench, 
  FileText, 
  Award, 
  Shield, 
  Map,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { useLearningContent } from '@/lib/hooks';
import api from '@/lib/api';

// Enhanced interfaces for the new learning system
interface LearningTask {
  id: string;
  title: string;
  type: 'study' | 'watch' | 'practice';
  estimated: string;
  xpReward: number;
}

interface LearningMission {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'practice' | 'assessment';
  xpReward: number;
  tasks: LearningTask[];
}

interface LearningModule {
  id: string;
  title: string;
  duration: string;
}

interface LearningTrack {
  id: string;
  title: string;
  description: string;
  type: 'theoretical' | 'multimedia' | 'practical';
  difficulty: string;
  estimatedTime: string;
  progress: {
    completed: number;
    total: number;
  };
  content: LearningModule[];
}

interface PhaseProgress {
  phaseIndex: number;
  totalPhases: number;
  phaseCompletion: number;
  milestones: {
    phase: string;
    title: string;
    completed: boolean;
    current: boolean;
    locked: boolean;
  }[];
}

interface Gamification {
  totalXP: number;
  currentLevel: number;
  achievements: {
    totalCompleted: number;
    phasesCompleted: number;
    projectsAdvanced: number;
    skillsMastered: number;
  };
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }[];
}

interface ProjectMetadata {
  problemStatement: string;
  solutionApproach: string;
  industryDomain: string;
  systemArchitecture: string;
  realWorldApplication: string;
}

interface VideoResource {
  title: string;
  description: string;
  url: string;
  duration: string;
  instructor: string;
  difficulty: string;
}

interface ProjectContext {
  title: string;
  phase: string;
}

export default function EnhancedLearningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const projectId = searchParams.get('project') || searchParams.get('projectId');
  
  // Early return if no project ID
  if (!projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-900/30 border-red-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">Project Required</h2>
              <p className="text-gray-300">Please select a project to view learning content.</p>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Hooks
  const { data, isLoading, error, isStale, refetch } = useLearningContent(projectId);

  // State management
  const [currentView, setCurrentView] = useState('overview');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [earnedXP, setEarnedXP] = useState(0);

  // Extract data from enhanced API response with proper key generation
  const missions: LearningMission[] = data?.data?.missions || [];
  const tracks: LearningTrack[] = data?.data?.tracks || [];
  const phaseProgress: PhaseProgress | undefined = data?.data?.phaseProgress;
  const gamification: Gamification | undefined = data?.data?.gamification;
  const projectMetadata: ProjectMetadata | undefined = data?.data?.projectMetadata;
  const videoResources: VideoResource[] = data?.data?.videoResources || [];

  // Phase-aware content determination
  const projectPhase = (data?.data as any)?.phase || 'ideation';
  const projectTitle = (data?.data as any)?.projectTitle || 'Innovation Project';
  
  // Create project context from metadata and current phase
  const projectContext: ProjectContext = projectMetadata ? {
    title: `${projectMetadata.industryDomain} Innovation Project`,
    phase: phaseProgress ? 
      ['Ideation', 'Design', 'Prototype', 'Testing', 'Showcase'][phaseProgress.phaseIndex] || 'Ideation' :
      'Ideation'
  } : {
    title: 'Learning Hub',
    phase: phaseProgress ? 
      ['Ideation', 'Design', 'Prototype', 'Testing', 'Showcase'][phaseProgress.phaseIndex] || 'Ideation' :
      'Ideation'
  };

  // Check if we have any valid content
  const hasValidContent = data?.data && (
    (data.data.tracks && data.data.tracks.length > 0) ||
    (data.data.missions && data.data.missions.length > 0) ||
    ((data.data as any).modules && (data.data as any).modules.length > 0)
  );

  // Loading state with skeleton - show loading if we're fetching OR if we don't have ANY content
  if (isLoading || (!hasValidContent && !error)) {

  // Task completion handler
  const completeTask = (missionId: string, taskId: string) => {
    const taskKey = `${missionId}-${taskId}`;
    if (!completedTasks.has(taskKey)) {
      const newCompleted = new Set(completedTasks);
      newCompleted.add(taskKey);
      setCompletedTasks(newCompleted);
      
      // Find task and add XP
      const mission = missions.find(m => m.id === missionId);
      const task = mission?.tasks.find(t => t.id === taskId);
      if (task) {
        setEarnedXP(prev => prev + task.xpReward);
        toast.success(`+${task.xpReward} XP earned!`);
      }
    }
  };

  // Cache clearing handler
  const handleClearCache = async () => {
    try {
      // Clear backend cache
      await api.learning.clearCache(projectId!);
      
      // Clear React Query cache for this project
      await queryClient.invalidateQueries({ 
        queryKey: ['learning-content', projectId] 
      });
      
      // Remove from localStorage cache as well
      queryClient.removeQueries({ 
        queryKey: ['learning-content', projectId] 
      });
      
      // Force a refetch
      await refetch();
      
      toast.success('Learning cache cleared! Content refreshed.');
    } catch (error) {
      console.error('Cache clear error:', error);
      toast.error('Failed to clear cache');
    }
  };

  // Check if we have any valid content
  const hasValidContent = data?.data && (
    (data.data.tracks && data.data.tracks.length > 0) ||
    (data.data.missions && data.data.missions.length > 0) ||
    ((data.data as any).modules && (data.data as any).modules.length > 0)
  );

  // Loading state with skeleton - show loading if we're fetching OR if we don't have ANY content
  if (isLoading || (!hasValidContent && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-32 h-10 bg-white/10 rounded animate-pulse"></div>
              <div>
                <div className="w-48 h-8 bg-white/10 rounded mb-2 animate-pulse"></div>
                <div className="w-64 h-5 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 h-10 bg-white/10 rounded animate-pulse"></div>
              <div className="w-32 h-10 bg-white/10 rounded animate-pulse"></div>
              {isStale && (
                <button
                  onClick={() => refetch()}
                  className="text-xs text-orange-400 hover:text-orange-300 px-2 py-1 rounded border border-orange-400/30"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="w-full h-12 bg-white/10 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-white/10 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-white/10 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have a valid projectId
  if (!projectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-900/30 border-red-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">No Project Selected</h2>
              <p className="text-gray-300">Please select a project to view learning content.</p>
              <Button onClick={() => router.push('/dashboard')} className="mt-4">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if learning data failed to load or is empty
  if (!hasValidContent && !isLoading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-yellow-900/30 border-yellow-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">Generating Learning Content</h2>
              <p className="text-gray-300 mb-4">
                Your learning content is being generated with enhanced features.
                This will provide you with structured learning paths, progress tracking, and phase-aware content.
              </p>
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => refetch()}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refresh Content
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="border-yellow-400/30 text-yellow-300 hover:bg-yellow-900/20"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if learning data failed to load or is empty
  if (!hasValidContent && !isLoading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-orange-900/30 border-orange-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">No Learning Content Available</h2>
              <p className="text-gray-300 mb-4">
                Learning content is being generated for this project. This usually takes a few moments.
              </p>
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => refetch()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="border-orange-400/30 text-orange-300 hover:bg-orange-900/20"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if learning data failed to load with error
  if (!data?.data && !isLoading && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-900/30 border-red-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">Learning Content Unavailable</h2>
              <p className="text-gray-300">Could not load learning content for this project.</p>
              <div className="flex gap-2 mt-4 justify-center">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.push(`/dashboard/projects/${projectId}`)}>
                  Back to Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Learning Hub</h1>
              <p className="text-gray-300">{projectContext.title} • {projectContext.phase} Phase</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {gamification && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">{gamification.totalXP + earnedXP}</span>
                      <span className="text-gray-400 text-sm">XP</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-orange-400" />
                      <span className="text-white font-medium">Level {gamification.currentLevel}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Button onClick={handleClearCache} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh Content
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
              <Map className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="missions" className="data-[state=active]:bg-blue-500/20">
              <Target className="w-4 h-4 mr-2" />
              Missions
            </TabsTrigger>
            <TabsTrigger value="tracks" className="data-[state=active]:bg-purple-500/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Tracks
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-orange-500/20">
              <Trophy className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Phase Progress */}
              {phaseProgress ? (
                <Card className="lg:col-span-2 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-400/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Rocket className="w-5 h-5 mr-2" />
                      Project Journey - {projectPhase} Phase
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Phase Progress</span>
                        <span className="text-white font-medium">
                          {phaseProgress.phaseIndex + 1} of {phaseProgress.totalPhases}
                        </span>
                      </div>
                      <Progress 
                        value={phaseProgress.phaseCompletion} 
                        className="h-2"
                      />
                      <div className="grid grid-cols-5 gap-2">
                        {phaseProgress.milestones.map((milestone, index) => (
                          <div key={milestone.phase} className="text-center">
                            <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                              milestone.completed ? 'bg-green-500' : 
                              milestone.current ? 'bg-blue-500' : 
                              'bg-gray-600'
                            }`}>
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : milestone.locked ? (
                                <Lock className="w-4 h-4 text-gray-400" />
                              ) : (
                                <span className="text-white text-xs font-bold">{index + 1}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-300">{milestone.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="lg:col-span-2 bg-gradient-to-r from-orange-900/40 to-red-900/40 border-orange-400/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Rocket className="w-5 h-5 mr-2" />
                      Phase Progress Unavailable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Phase progress tracking is not available for the {projectPhase} phase. 
                      This feature may be enabled in later phases of your project.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="bg-green-900/30 border-green-400/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300 text-sm">Available Missions</p>
                        <p className="text-white text-2xl font-bold">{missions.length}</p>
                      </div>
                      <Target className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-900/30 border-purple-400/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-300 text-sm">Learning Tracks</p>
                        <p className="text-white text-2xl font-bold">{tracks.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-900/30 border-blue-400/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-300 text-sm">Video Resources</p>
                        <p className="text-white text-2xl font-bold">{videoResources.length}</p>
                      </div>
                      <PlayCircle className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Project Context */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{projectTitle} - Learning Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectMetadata ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">Problem You're Solving</h4>
                        <p className="text-gray-300 text-sm">{projectMetadata.problemStatement}</p>
                      </div>
                      <div>
                        <h4 className="text-blue-400 font-medium mb-2">Your Solution Approach</h4>
                        <p className="text-gray-300 text-sm">{projectMetadata.solutionApproach}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {projectMetadata.industryDomain} domain
                      </Badge>
                      <Badge variant="secondary">
                        {projectMetadata.systemArchitecture}
                      </Badge>
                      <Badge variant="secondary">
                        {projectMetadata.realWorldApplication}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <h4 className="text-orange-400 font-medium mb-2">Enhanced Project Context Not Available</h4>
                    <p className="text-gray-300 text-sm">
                      Detailed project metadata is not available for the {projectPhase} phase. 
                      Enhanced context and AI-powered insights may become available as your project progresses.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      <Badge variant="secondary">{projectTitle}</Badge>
                      <Badge variant="secondary">{projectPhase} phase</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            <div className="grid gap-6">
              {missions && missions.length > 0 ? missions.map((mission) => (
                <Card key={mission.id} className="bg-white/5 border-white/10 hover:border-green-400/30 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          mission.type === 'knowledge' ? 'bg-blue-500/20' :
                          mission.type === 'practice' ? 'bg-green-500/20' :
                          'bg-purple-500/20'
                        }`}>
                          {mission.type === 'knowledge' ? <Brain className="w-5 h-5 text-blue-400" /> :
                           mission.type === 'practice' ? <Wrench className="w-5 h-5 text-green-400" /> :
                           <Trophy className="w-5 h-5 text-purple-400" />}
                        </div>
                        <div>
                          <CardTitle className="text-white">{mission.title}</CardTitle>
                          <p className="text-gray-300 text-sm">{mission.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                          +{mission.xpReward} XP
                        </Badge>
                        <Badge variant={mission.type === 'knowledge' ? 'default' : mission.type === 'practice' ? 'secondary' : 'destructive'}>
                          {mission.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mission.tasks?.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Button
                              size="sm"
                              variant={completedTasks.has(`${mission.id}-${task.id}`) ? "default" : "outline"}
                              onClick={() => completeTask(mission.id, task.id)}
                              className={completedTasks.has(`${mission.id}-${task.id}`) ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {completedTasks.has(`${mission.id}-${task.id}`) ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : task.type === 'study' ? (
                                <BookOpen className="w-4 h-4" />
                              ) : task.type === 'watch' ? (
                                <PlayCircle className="w-4 h-4" />
                              ) : (
                                <Wrench className="w-4 h-4" />
                              )}
                            </Button>
                            <div>
                              <p className="text-white font-medium">{task.title}</p>
                              <p className="text-gray-400 text-sm">{task.estimated}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">+{task.xpReward} XP</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">No Missions Available</h3>
                    <p className="text-gray-300 text-sm">
                      Learning missions are being generated for your project. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Learning Tracks Tab */}
          <TabsContent value="tracks" className="space-y-6">
            <div className="grid gap-6">
              {tracks.map((track) => (
                <Card key={track.id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          {track.type === 'theoretical' ? <Brain className="w-5 h-5 mr-2 text-blue-400" /> :
                           track.type === 'multimedia' ? <PlayCircle className="w-5 h-5 mr-2 text-purple-400" /> :
                           <Wrench className="w-5 h-5 mr-2 text-green-400" />}
                          {track.title || 'Learning Track'}
                        </CardTitle>
                        <p className="text-gray-300 text-sm mt-1">{track.description || 'Learning content for your project'}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{track.difficulty || 'intermediate'}</Badge>
                        <p className="text-gray-400 text-sm mt-1">{track.estimatedTime || (track as any).estimatedDuration || '30 min'}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Progress</span>
                        <span className="text-white text-sm">
                          {track.progress?.completed || 0} of {track.progress?.total || track.content?.length || 1}
                        </span>
                      </div>
                      <Progress 
                        value={track.progress ? (track.progress.completed / track.progress.total) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {track.content?.slice(0, 3).map((module, idx) => (
                        <div key={module.id || `module-${idx}`} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-white text-sm">{module.title || `Module ${idx + 1}`}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{module.duration || '15 min'}</Badge>
                        </div>
                      )) || []}
                      {(track.content?.length || 0) > 3 && (
                        <p className="text-gray-400 text-sm text-center">
                          +{(track.content?.length || 0) - 3} more modules
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {gamification && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Achievements */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{gamification.achievements.totalCompleted}</p>
                        <p className="text-gray-300 text-sm">Tasks Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{gamification.achievements.phasesCompleted}</p>
                        <p className="text-gray-300 text-sm">Phases Completed</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">{gamification.achievements.projectsAdvanced}</p>
                        <p className="text-gray-300 text-sm">Projects Advanced</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">{gamification.achievements.skillsMastered}</p>
                        <p className="text-gray-300 text-sm">Skills Mastered</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {gamification.badges.map((badge) => (
                        <div key={badge.id} className={`p-3 rounded-lg border ${
                          badge.unlocked ? 'bg-green-500/10 border-green-400/30' : 'bg-gray-500/10 border-gray-400/30'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`text-2xl ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
                              {badge.icon}
                            </div>
                            <div>
                              <p className={`font-medium ${badge.unlocked ? 'text-white' : 'text-gray-400'}`}>
                                {badge.title}
                              </p>
                              <p className="text-gray-400 text-sm">{badge.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

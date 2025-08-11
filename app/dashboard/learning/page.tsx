'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ArrowLeft, 
  Clock,
  Users,
  Target
} from 'lucide-react';
import { useLearningContent } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Project interface for project selection
interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  industry: string;
  aiClassification: string;
  createdAt: string;
  updatedAt: string;
}

export default function LearningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project') || searchParams.get('projectId');

  console.log("=== LEARNING PAGE DEBUG ===");
  console.log("projectId from URL:", projectId);
  console.log("searchParams:", Object.fromEntries(searchParams.entries()));

  // Scenario 1: No project ID - Show project selection (sidebar access)
  if (!projectId) {
    return <ProjectSelectionView />;
  }

  // Scenario 2: Has project ID - Load learning content (project detail access)
  return <LearningContentView projectId={projectId} />;
}

// Component for when user accesses from sidebar (no project selected)
function ProjectSelectionView() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use the same API call as the main projects page
      const response = await api.projects.list({ my_projects: 'true' });
      
      console.log("=== PROJECT SELECTION DEBUG ===");
      console.log("API response:", response);
      
      if (response.success && response.data) {
        // Handle the actual response format: {success: true, data: Array, message: string}
        const projectsArray = Array.isArray(response.data) ? response.data : response.data.data || [];
        console.log("Projects array:", projectsArray);
        setProjects(projectsArray);
      } else {
        setError('Failed to load projects');
      }
    } catch (err: any) {
      console.error("Projects fetch error:", err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Learning Hub</h1>
            <p className="text-gray-300">Select a project to access learning content</p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/10 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-900/30 border-red-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">Failed to Load Projects</h2>
              <p className="text-gray-300 mb-2">Could not fetch your projects.</p>
              <p className="text-red-300 text-sm mb-4">
                Error: {error || 'Unknown error'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/projects')}
                >
                  Go to Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userProjects = projects || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Learning Hub</h1>
          <p className="text-gray-300">Select a project to access personalized learning content</p>
        </div>

        {/* Projects Grid */}
        {userProjects.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
              <p className="text-gray-300 mb-4">
                Create a project first to access learning content.
              </p>
              <Button onClick={() => router.push('/dashboard/projects/new')}>
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project: any) => (
              <Card 
                key={project.id} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/learning?project=${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">
                        {project.title}
                      </CardTitle>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                      {project.industry}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>Learn</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Component for when user has selected a project (learning content)
function LearningContentView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [userProgress, setUserProgress] = useState<any>(null);
  const [totalXP, setTotalXP] = useState(0);

  // Fetch learning content for the specific project
  const { data, isLoading, error, refetch } = useLearningContent(projectId);

  // Fetch user progress for this project
  const fetchProgress = async () => {
    try {
      console.log('=== FETCHING PROGRESS ===');
      console.log('ProjectId:', projectId);
      
      const progressResponse = await api.learning.getProgress(projectId);
      console.log('Progress API response:', progressResponse);
      
      if (progressResponse.success && progressResponse.data) {
        const progress = progressResponse.data;
        console.log('Progress data:', progress);
        setUserProgress(progress);
        setTotalXP(progress.totalXP || 0);
        
        // Update completed tasks set
        const completedIds = progress.progress
          ?.filter((p: any) => p.completed)
          ?.map((p: any) => p.itemId) || [];
        console.log('Completed task IDs from API:', completedIds);
        console.log('Full progress data:', progress.progress);
        setCompletedTasks(new Set(completedIds));
        
        console.log('Progress loaded successfully:', {
          totalXP: progress.totalXP,
          totalCompleted: progress.totalCompleted,
          completedIds
        });
      } else {
        console.log('Progress API returned unsuccessful response:', progressResponse);
      }
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  // Fetch progress on mount and when window regains focus
  useEffect(() => {
    if (projectId) {
      fetchProgress();
    }

    // Refresh data when window regains focus (e.g., coming back from module)
    const handleFocus = () => {
      console.log('Window focused, refreshing progress...');
      fetchProgress();
      refetch(); // Also refresh learning content
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [projectId]);

  console.log("=== LEARNING CONTENT DEBUG ===");
  console.log("projectId:", projectId);
  console.log("loading:", isLoading);
  console.log("error:", error);
  console.log("data:", data);
  console.log("data?.data:", data?.data);
  console.log("data structure keys:", data?.data ? Object.keys(data.data) : 'no data');
  console.log("completedTasks:", Array.from(completedTasks));
  console.log("totalXP:", totalXP);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/learning')}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Hub
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">Loading Learning Content...</h1>
          </div>
          
          {/* Loading skeleton */}
          <div className="space-y-6">
            <div className="h-20 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-white/10 rounded-lg animate-pulse"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-white/10 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-900/30 border-red-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">Failed to Load Learning Content</h2>
              <p className="text-gray-300 mb-4">Could not load learning content for this project.</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.push('/dashboard/learning')}>
                  Back to Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-yellow-900/30 border-yellow-400/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-white font-semibold mb-2">No Learning Content Available</h2>
              <p className="text-gray-300 mb-4">Learning content is being generated for this project.</p>
              <Button onClick={() => refetch()}>
                Refresh Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const learningData = data.data;
  const tracks = learningData.tracks || [];
  const missions = learningData.missions || [];
  const gamification = learningData.gamification;
  const phaseProgress = learningData.phaseProgress;
  const projectMetadata = learningData.projectMetadata;

  const handleTaskComplete = async (taskId: string, xpReward: number, taskType: 'module' | 'exercise' | 'video') => {
    if (!completedTasks.has(taskId)) {
      try {
        // Save progress to backend
        await api.learning.saveProgress({
          projectId,
          itemId: taskId,
          itemType: taskType,
          completed: true,
          xpEarned: xpReward
        });

        // Update local state
        setCompletedTasks(prev => new Set([...prev, taskId]));
        setTotalXP(prev => prev + xpReward);
        
        console.log(`Task ${taskId} completed! +${xpReward} XP`);
        
        // Refresh progress data to get latest state
        fetchProgress();
        
        // You could add a toast notification here
        // addNotification({ type: 'success', title: 'Task Complete!', message: `+${xpReward} XP earned` });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  const openTaskContent = (task: any) => {
    // Open a modal or navigate to content viewer
    if (task.type === 'study') {
      // Open module content with projectId
      window.open(`/dashboard/learning/module/${task.content.id}?projectId=${projectId}`, '_blank');
    } else if (task.type === 'hands-on') {
      // Open exercise content with projectId
      window.open(`/dashboard/learning/exercise/${task.content.id}?projectId=${projectId}`, '_blank');
    } else if (task.type === 'watch') {
      // Open video content in video viewer with projectId
      if (task.content.id) {
        window.open(`/dashboard/learning/video/${task.content.id}?projectId=${projectId}`, '_blank');
      } else if (task.content.url) {
        // Fallback: open URL directly if no video ID
        window.open(task.content.url, '_blank');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/learning')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Hub
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {projectMetadata?.projectTitle || 'Learning Content'}
              </h1>
              <p className="text-gray-300">
                {phaseProgress?.currentPhase || 'ideation'} Phase • {learningData.totalDuration}
              </p>
            </div>
            
            {/* Always show XP and progress with refresh button */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-yellow-400 font-bold text-lg">{totalXP}</p>
                      <p className="text-gray-400 text-sm">Total XP</p>
                    </div>
                    <div className="text-center">
                      <p className="text-blue-400 font-bold text-lg">{userProgress?.totalCompleted || 0}</p>
                      <p className="text-gray-400 text-sm">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-400 font-bold text-lg">{Math.floor(totalXP / 100)}</p>
                      <p className="text-gray-400 text-sm">Level</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={fetchProgress}
                    className="text-xs text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    🔄 Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'missions', label: 'Missions', icon: BookOpen },
              { id: 'tracks', label: 'Learning Tracks', icon: Clock },
              { id: 'progress', label: 'Progress', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-400">{missions.length}</p>
                      <p className="text-gray-300 text-sm">Missions</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-400">{tracks.length}</p>
                      <p className="text-gray-300 text-sm">Learning Tracks</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-400">{learningData.contentSummary?.totalModules || 0}</p>
                      <p className="text-gray-300 text-sm">Modules</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-orange-400">{gamification?.availableXP || 0}</p>
                      <p className="text-gray-300 text-sm">Available XP</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Context */}
                {projectMetadata && (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-white font-medium mb-2">Problem Statement</h4>
                        <p className="text-gray-300 text-sm">{projectMetadata.problemStatement}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Solution Approach</h4>
                        <p className="text-gray-300 text-sm">{projectMetadata.solutionApproach}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{projectMetadata.industryDomain}</Badge>
                        <Badge variant="outline">{projectMetadata.systemArchitecture}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'missions' && (
              <div className="space-y-4">
                {missions.map((mission: any) => (
                  <Card key={mission.id} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{mission.title}</CardTitle>
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                          {mission.xpReward} XP
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm">{mission.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mission.tasks?.map((task: any) => (
                          <div
                            key={task.id}
                            className={`p-3 rounded-lg border transition-all ${
                              completedTasks.has(task.id)
                                ? 'bg-green-600/20 border-green-400/30'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="text-white font-medium">{task.title}</h5>
                                <p className="text-gray-400 text-sm">{task.type} • {task.estimated}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-yellow-400 text-sm">+{task.xpReward} XP</span>
                                {/* Debug: Show task ID */}
                                <span className="text-gray-500 text-xs" title="Task ID">{task.id}</span>
                                {(() => {
                                  const isCompleted = completedTasks.has(task.id);
                                  console.log(`Task "${task.title}" (ID: ${task.id}): completed = ${isCompleted}`);
                                  return isCompleted ? (
                                    <Button
                                      size="sm"
                                      disabled
                                      className="text-xs bg-green-600 text-white opacity-75 cursor-not-allowed"
                                    >
                                      ✓ Completed
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openTaskContent(task)}
                                      className="text-xs text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                                    >
                                      Start
                                    </Button>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'tracks' && (
              <div className="space-y-4">
                {tracks.map((track: any) => (
                  <Card key={track.id} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">{track.title}</CardTitle>
                      <p className="text-gray-300 text-sm">{track.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-blue-400">{track.type}</span>
                        <span className="text-gray-400">{track.estimatedTime}</span>
                        <span className="text-orange-400">{track.difficulty}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-3">{track.projectRelevance}</p>
                      <div className="text-sm text-gray-400">
                        Progress: {track.progress?.completed || 0} / {track.progress?.total || 0} items
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'progress' && phaseProgress && (
              <div className="space-y-6">
                {/* Phase Milestones */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Learning Journey</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {phaseProgress.milestones?.map((milestone: any, index: number) => (
                        <div
                          key={milestone.phase}
                          className={`flex items-center space-x-4 p-3 rounded-lg ${
                            milestone.completed
                              ? 'bg-green-600/20'
                              : milestone.current
                              ? 'bg-blue-600/20'
                              : 'bg-gray-600/20'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              milestone.completed
                                ? 'bg-green-500'
                                : milestone.current
                                ? 'bg-blue-500'
                                : 'bg-gray-500'
                            }`}
                          >
                            <span className="text-white text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{milestone.title}</h4>
                            <p className="text-gray-300 text-sm">{milestone.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-yellow-400 text-sm">{milestone.requiredXP} XP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Phase Progress */}
            {phaseProgress && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Current Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {phaseProgress.currentPhase}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Phase {phaseProgress.phaseIndex + 1} of {phaseProgress.totalPhases}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`bg-blue-500 h-2 rounded-full transition-all duration-300 ${
                          phaseProgress.phaseIndex === 0 ? 'w-1/5' :
                          phaseProgress.phaseIndex === 1 ? 'w-2/5' :
                          phaseProgress.phaseIndex === 2 ? 'w-3/5' :
                          phaseProgress.phaseIndex === 3 ? 'w-4/5' :
                          phaseProgress.phaseIndex === 4 ? 'w-full' : 'w-1/5'
                        }`}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs">
                      Next: {phaseProgress.nextPhase || 'Complete'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Badges */}
            {gamification?.badges && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gamification.badges.map((badge: any) => (
                      <div
                        key={badge.id}
                        className={`p-2 rounded-lg text-center ${
                          badge.unlocked ? 'bg-yellow-600/20' : 'bg-gray-600/20'
                        }`}
                      >
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <h4 className={`font-medium text-sm ${
                          badge.unlocked ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {badge.title}
                        </h4>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

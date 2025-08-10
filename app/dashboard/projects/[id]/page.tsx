'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Settings, 
  Users, 
  Target, 
  Brain,
  Zap,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Wrench,
  MessageSquare,
  BookOpen,
  Edit,
  Share,
  Play,
  Rocket,
  Code,
  Cpu,
  Workflow,
  UserPlus,
  Calendar,
  FileText,
  Award,
  ChevronRight,
  Bot,
  Heart,
  Sparkles,
  MapPin} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuth } from '@/lib/auth-context';
import { useUIStore } from '@/lib/stores';
import { api } from '@/lib/api';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'ideation' | 'design' | 'prototype' | 'testing' | 'complete' | 'showcase';
  type?: 'healthcare' | 'agriculture' | 'infrastructure' | 'industrial' | 'environmental' | 'other';
  discipline?: string;
  problemStatement?: string;
  solution?: string;
  tags?: string[];
  currentTeamSize?: number;
  maxTeamSize?: number;
  spotsAvailable?: number;
  teamLeaderId: string;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    discipline?: string;
  };
  aiAnalysis?: {
    opportunity?: {
      impact: string;
      marketSize: string;
      uniqueValue: string;
      africanContext: string;
    };
    technical?: {
      complexity: number;
      estimatedTime: string;
      requiredSkills: string[];
      keyTechnologies: string[];
      kitComponents: string[];
    };
    commercial?: {
      revenue: string;
      customers: string[];
      moat: string;
      localAffordability: string;
    };
    execution?: {
      phases: Array<{
        name: string;
        duration: string;
        milestones: string[];
        dependencies?: string[];
        risks?: string[];
      }>;
      resourceOptimization: string;
      africaSpecificSolutions: string[];
    };
  };
  originalIdea?: string;
}

export default function ProjectWorkspace() {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useUIStore();

  const projectId = params.id as string;
  const isOwner = project?.teamLeaderId === user?.id;

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.projects.get(projectId);
      
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        throw new Error(response.message || 'Project not found');
      }
    } catch (error: any) {
      console.error('Error fetching project:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Load Project',
        message: error.message || 'Could not load project details'
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'ideation': return 15;
      case 'design': return 35;
      case 'prototype': return 65;
      case 'testing': return 85;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const getJourneyPhase = (status: string) => {
    switch (status) {
      case 'ideation': return 'idea';
      case 'design': return 'learn';
      case 'prototype': return 'build';
      case 'testing': return 'team';
      case 'complete': return 'launch';
      default: return 'idea';
    }
  };

  const getJourneySteps = () => {
    return [
      { key: 'idea', label: 'Idea', icon: Lightbulb, status: 'ideation' },
      { key: 'learn', label: 'Learn', icon: BookOpen, status: 'design' },
      { key: 'build', label: 'Build', icon: Wrench, status: 'prototype' },
      { key: 'team', label: 'Team', icon: Users, status: 'testing' },
      { key: 'launch', label: 'Launch', icon: Rocket, status: 'complete' }
    ];
  };

  const getStudentGuidance = () => {
    if (!project) return null;

    const currentPhase = getJourneyPhase(project.status);
    const teamSize = project.currentTeamSize || 1;
    const isTeamLeader = project.teamLeaderId === user?.id;

    switch (currentPhase) {
      case 'idea':
        return {
          message: isTeamLeader 
            ? "Great start! Your idea is taking shape. Let's help you understand what comes next and build your confidence."
            : "Welcome to this innovation! You're joining at the perfect time to help shape this idea.",
          encouragement: "🌱 Every expert was once a beginner",
          nextStep: "First, let's help you understand the technical requirements and learn the basics you'll need.",
          confidence: "low"
        };
      
      case 'learn':
        return {
          message: teamSize === 1 
            ? "Perfect! Learning phase is where you build confidence. The AI will guide you through understanding your project's technical needs."
            : `You and your ${teamSize - 1} teammate${teamSize > 2 ? 's' : ''} are in the learning phase. Great time to share knowledge!`,
          encouragement: "🧠 Knowledge builds confidence",
          nextStep: "Time to dive into the technical skills and understand the components you'll need for your prototype.",
          confidence: "building"
        };
      
      case 'build':
        return {
          message: teamSize === 1 
            ? "Ready to build? This is exciting! You can still invite teammates if you need specific skills like CAD design or electronics."
            : "Building time! Your team has the knowledge - now let's create something amazing together.",
          encouragement: "🔨 Every prototype teaches you something",
          nextStep: "Time to request your IoT kit components and book the makerspace equipment you'll need.",
          confidence: "confident"
        };
      
      case 'team':
        return {
          message: "Testing phase! This is where your innovation gets validated by real users. Team collaboration becomes crucial now.",
          encouragement: "🚀 User feedback is pure gold",
          nextStep: "Gather user feedback, iterate on your design, and prepare for launch with business planning.",
          confidence: "experienced"
        };
      
      case 'launch':
        return {
          message: "Congratulations! Your innovation is complete. Time to showcase it to the community and plan the business side.",
          encouragement: "🎉 You've built something amazing!",
          nextStep: "Share your success with the community and explore business opportunities.",
          confidence: "expert"
        };
      
      default:
        return {
          message: "Welcome to your innovation journey! We're here to guide you every step of the way.",
          encouragement: "✨ Great innovations start with curiosity",
          nextStep: "Let's understand your project and plan the next steps together.",
          confidence: "starting"
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideation': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'design': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'prototype': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'testing': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'complete': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getNextActions = () => {
    if (!project) return [];

    const actions = [];
    const currentPhase = getJourneyPhase(project.status);
    const teamSize = project.currentTeamSize || 1;
    const isTeamLeader = project.teamLeaderId === user?.id;
    
    switch (currentPhase) {
      case 'idea':
        actions.push({
          title: 'Understand Your Project',
          description: 'Learn about the technical requirements and skills needed for your innovation',
          priority: 'high',
          estimated: '1 week',
          icon: BookOpen,
          route: '/dashboard/learning',
          params: { project: projectId, focus: 'technical-overview' }
        });
        
        if (project.aiAnalysis?.technical?.requiredSkills) {
          actions.push({
            title: 'Explore Required Skills',
            description: `Build confidence in: ${project.aiAnalysis.technical.requiredSkills.slice(0, 2).join(', ')}`,
            priority: 'medium',
            estimated: '2 weeks',
            icon: Brain,
            route: '/dashboard/learning',
            params: { project: projectId, skills: project.aiAnalysis.technical.requiredSkills.slice(0, 2) }
          });
        }

        if (teamSize === 1 && isTeamLeader) {
          actions.push({
            title: 'Consider Team Building',
            description: 'When ready, you can invite others or work with AI guidance for now',
            priority: 'low',
            estimated: 'Flexible',
            icon: Users,
            route: '/dashboard/community/team-matching',
            params: { project: projectId }
          });
        }
        break;
        
      case 'learn':
        if (project.aiAnalysis?.technical?.kitComponents) {
          actions.push({
            title: 'Request Your IoT Kit',
            description: `Components identified: ${project.aiAnalysis.technical.kitComponents.slice(0, 2).join(', ')}...`,
            priority: 'high',
            estimated: '1 week',
            icon: Cpu,
            route: '/dashboard/kits',
            params: { project: projectId, components: project.aiAnalysis.technical.kitComponents }
          });
        }

        actions.push({
          title: 'Technical Architecture',
          description: 'Create system design and understand how components work together',
          priority: 'high',
          estimated: '2-3 weeks',
          icon: Code,
          route: '/dashboard/learning',
          params: { project: projectId, focus: 'system-design' }
        });

        if (teamSize === 1) {
          actions.push({
            title: 'Find Learning Buddy',
            description: 'Team up with someone learning similar skills for mutual support',
            priority: 'medium',
            estimated: 'Ongoing',
            icon: UserPlus,
            route: '/dashboard/community/team-matching',
            params: { project: projectId, type: 'learning-partner' }
          });
        }
        break;
        
      case 'build':
        actions.push({
          title: 'Book Makerspace Equipment',
          description: 'Reserve 3D printer, PCB tools, and other fabrication equipment',
          priority: 'high',
          estimated: '1-2 days',
          icon: Calendar,
          route: '/dashboard/fabrication',
          params: { project: projectId, equipment: 'recommended' }
        });

        actions.push({
          title: 'Build MVP Prototype',
          description: 'Start with basic functionality and iterate based on testing',
          priority: 'high',
          estimated: '4-6 weeks',
          icon: Wrench,
          route: null, // This stays in project page for tracking
          params: null
        });

        if (project.aiAnalysis?.technical?.requiredSkills?.includes('CAD') || 
            project.aiAnalysis?.technical?.requiredSkills?.includes('3D Design')) {
          actions.push({
            title: 'Create CAD Models',
            description: 'Design 3D models for your prototype components',
            priority: 'medium',
            estimated: '2-3 weeks',
            icon: Code,
            route: '/dashboard/learning',
            params: { project: projectId, focus: 'cad-design' }
          });
        }

        if (teamSize < 3) {
          actions.push({
            title: 'Invite Technical Expert',
            description: 'Consider adding team members with specialized skills',
            priority: 'medium',
            estimated: '1 week',
            icon: Users,
            route: '/dashboard/community/team-matching',
            params: { project: projectId, skills: project.aiAnalysis?.technical?.requiredSkills }
          });
        }
        break;
        
      case 'team':
        actions.push({
          title: 'User Testing Session',
          description: 'Test with real users and collect valuable feedback',
          priority: 'high',
          estimated: '2-3 weeks',
          icon: Users,
          route: '/dashboard/community',
          params: { project: projectId, activity: 'user-testing' }
        });

        actions.push({
          title: 'Iterate Based on Feedback',
          description: 'Refine your prototype based on user insights',
          priority: 'high',
          estimated: '3-4 weeks',
          icon: Rocket,
          route: null,
          params: null
        });

        actions.push({
          title: 'Plan Business Model',
          description: 'Explore commercial opportunities and business strategy',
          priority: 'medium',
          estimated: '2 weeks',
          icon: DollarSign,
          route: '/dashboard/business',
          params: { project: projectId }
        });
        break;

      case 'launch':
        actions.push({
          title: 'Showcase Innovation',
          description: 'Share your completed project with the community',
          priority: 'high',
          estimated: '1 week',
          icon: Award,
          route: '/dashboard/community',
          params: { project: projectId, activity: 'showcase' }
        });

        actions.push({
          title: 'Business Planning',
          description: 'Develop comprehensive business plan and market strategy',
          priority: 'medium',
          estimated: '4-6 weeks',
          icon: TrendingUp,
          route: '/dashboard/business',
          params: { project: projectId }
        });
        break;
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-white/10 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-white/10 rounded"></div>
                ))}
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-white/10 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => router.push('/dashboard/projects')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const nextActions = getNextActions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div className="flex items-start space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/projects')}
              className="mt-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                <Badge className={`px-3 py-1 border ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
                {project.aiAnalysis && (
                  <Badge className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </Badge>
                )}
              </div>
              <p className="text-gray-300 text-lg max-w-3xl">{project.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Journey Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 backdrop-blur-md border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Innovation Journey</span>
            </div>
            <div className="text-sm text-gray-400">
              {getProgressPercentage(project.status)}% Complete
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            {getJourneySteps().map((step, index) => {
              const isActive = step.status === project.status;
              const isCompleted = getProgressPercentage(step.status) < getProgressPercentage(project.status);
              const StepIcon = step.icon;
              
              return (
                <div key={step.key} className="flex flex-col items-center relative">
                  {index > 0 && (
                    <div className={`absolute -left-8 top-4 w-16 h-0.5 ${
                      isCompleted ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    isActive 
                      ? 'bg-purple-500 text-white ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-600 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs ${
                    isActive ? 'text-white font-medium' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          <Progress value={getProgressPercentage(project.status)} className="h-2 bg-gray-700" />
        </motion.div>

        {/* AI Companion Guidance */}
        {(() => {
          const guidance = getStudentGuidance();
          if (!guidance) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-xl p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-white font-semibold">Your AI Innovation Guide</h3>
                    <Heart className="w-4 h-4 text-pink-400" />
                  </div>
                  <p className="text-gray-300 mb-3">{guidance.message}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-300">{guidance.encouragement}</span>
                    </div>
                    <Badge className={`px-2 py-1 text-xs ${
                      guidance.confidence === 'low' ? 'bg-yellow-500/20 text-yellow-300' :
                      guidance.confidence === 'building' ? 'bg-blue-500/20 text-blue-300' :
                      guidance.confidence === 'confident' ? 'bg-green-500/20 text-green-300' :
                      guidance.confidence === 'experienced' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {guidance.confidence} confidence
                    </Badge>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5" />
                    <span className="text-sm text-blue-300">{guidance.nextStep}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{project.currentTeamSize || 1}</div>
              <div className="text-xs text-gray-400">Team Members</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{getProgressPercentage(project.status)}%</div>
              <div className="text-xs text-gray-400">Complete</div>
            </CardContent>
          </Card>
          
          {project.aiAnalysis?.technical && (
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardContent className="p-4 text-center">
                <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{project.aiAnalysis.technical.complexity}/10</div>
                <div className="text-xs text-gray-400">Complexity</div>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {project.aiAnalysis?.technical?.estimatedTime || 'TBD'}
              </div>
              <div className="text-xs text-gray-400">Timeline</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="intelligence" className="data-[state=active]:bg-white/20">
                  AI Intelligence
                </TabsTrigger>
                <TabsTrigger value="execution" className="data-[state=active]:bg-white/20">
                  Execution
                </TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-white/20">
                  Resources
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Next Actions */}
                <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span>Smart Next Actions</span>
                      <Badge className="ml-2 bg-purple-500/20 text-purple-300 text-xs">
                        AI Guided
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nextActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <action.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{action.title}</h3>
                            <Badge 
                              className={`text-xs ${
                                action.priority === 'high' 
                                  ? 'bg-red-500/20 text-red-300' 
                                  : action.priority === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-300'
                                    : 'bg-green-500/20 text-green-300'
                              }`}
                            >
                              {action.priority} priority
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{action.description}</p>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">Estimated: {action.estimated}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            if (action.route) {
                              const url = new URL(action.route, window.location.origin);
                              if (action.params) {
                                Object.entries(action.params).forEach(([key, value]) => {
                                  if (Array.isArray(value)) {
                                    url.searchParams.set(key, value.join(','));
                                  } else {
                                    url.searchParams.set(key, String(value));
                                  }
                                });
                              }
                              router.push(url.pathname + url.search);
                            } else {
                              addNotification({
                                type: 'info',
                                title: 'Action Started',
                                message: `${action.title} has been marked as in progress`
                              });
                            }
                          }}
                        >
                          {action.route ? 'Go' : 'Start'}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Problem & Solution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Target className="w-5 h-5 text-red-400" />
                        <span>Problem Statement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        {project.problemStatement || project.originalIdea || 'No problem statement provided yet.'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        <span>Solution Approach</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        {project.solution || 'Solution approach will be developed during the design phase.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="intelligence" className="space-y-6">
                {project.aiAnalysis ? (
                  <>
                    {/* Market Opportunity */}
                    {project.aiAnalysis.opportunity && (
                      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-white">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span>Market Intelligence</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <span className="text-sm text-gray-400">Market Impact</span>
                            <p className="text-white">{project.aiAnalysis.opportunity.impact}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Market Size</span>
                            <p className="text-white">{project.aiAnalysis.opportunity.marketSize}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">African Context</span>
                            <p className="text-white">{project.aiAnalysis.opportunity.africanContext}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Technical Analysis */}
                    {project.aiAnalysis.technical && (
                      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-white">
                            <Brain className="w-5 h-5 text-purple-400" />
                            <span>Technical Intelligence</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-400">Complexity Rating</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <Progress value={project.aiAnalysis.technical.complexity * 10} className="flex-1 h-2" />
                                <span className="text-white font-medium">{project.aiAnalysis.technical.complexity}/10</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-400">Estimated Timeline</span>
                              <p className="text-white font-medium">{project.aiAnalysis.technical.estimatedTime}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Required Skills</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {project.aiAnalysis.technical.requiredSkills.map((skill, index) => (
                                <Badge key={index} className="bg-blue-500/20 text-blue-300">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Key Technologies</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {project.aiAnalysis.technical.keyTechnologies?.map((tech, index) => (
                                <Badge key={index} className="bg-purple-500/20 text-purple-300">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Commercial Viability */}
                    {project.aiAnalysis.commercial && (
                      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-white">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <span>Commercial Intelligence</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <span className="text-sm text-gray-400">Revenue Model</span>
                            <p className="text-white">{project.aiAnalysis.commercial.revenue}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Target Customers</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {project.aiAnalysis.commercial.customers?.map((customer, index) => (
                                <Badge key={index} className="bg-green-500/20 text-green-300">
                                  {customer}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Competitive Advantage</span>
                            <p className="text-white">{project.aiAnalysis.commercial.moat}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardContent className="text-center py-12">
                      <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No AI Analysis Available</h3>
                      <p className="text-gray-400 mb-6">Generate comprehensive AI analysis for market opportunity, technical feasibility, and commercial viability insights.</p>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Brain className="w-4 h-4 mr-2" />
                        Generate AI Analysis
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="execution" className="space-y-6">
                {project.aiAnalysis?.execution ? (
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Execution Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.aiAnalysis.execution.phases.map((phase, index) => (
                        <div key={index} className="border border-white/10 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">{phase.name}</h3>
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {phase.duration}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Milestones:</span>
                            <ul className="mt-1 space-y-1">
                              {phase.milestones.map((milestone, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-center space-x-2">
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                  <span>{milestone}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardContent className="text-center py-12">
                      <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Execution Plan Available</h3>
                      <p className="text-gray-400 mb-6">Generate an AI-powered execution plan to see detailed roadmap and milestones</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Workflow className="w-4 h-4 mr-2" />
                        Generate Execution Plan
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Cpu className="w-5 h-5 text-purple-400" />
                        <span>Required Components</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {project.aiAnalysis?.technical?.kitComponents ? (
                        <div className="space-y-3">
                          {project.aiAnalysis.technical.kitComponents.map((component, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <div>
                                  <span className="text-gray-300 block">{component}</span>
                                  <span className="text-xs text-gray-500">
                                    {component.includes('sensor') ? 'Sensor Technology' :
                                     component.includes('microcontroller') ? 'Processing Unit' :
                                     component.includes('display') ? 'Output Device' :
                                     component.includes('motor') ? 'Actuator' :
                                     'Electronic Component'}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => router.push(`/dashboard/kits?component=${encodeURIComponent(component)}&project=${projectId}`)}
                              >
                                Request
                              </Button>
                            </div>
                          ))}
                          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/20 rounded">
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-blue-300 font-medium">AI Recommendation</span>
                            </div>
                            <p className="text-xs text-gray-400">
                              Components are selected based on your project needs. Our lab stocks compatible alternatives from various manufacturers.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Cpu className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-400 mb-4">No specific components identified yet.</p>
                          <Button 
                            size="sm"
                            onClick={() => router.push(`/dashboard/kits?project=${projectId}`)}
                          >
                            Browse Available Kits
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <BookOpen className="w-5 h-5 text-green-400" />
                        <span>Learning Path</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {project.aiAnalysis?.technical?.requiredSkills ? (
                        <div className="space-y-3">
                          {project.aiAnalysis.technical.requiredSkills.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <div>
                                  <span className="text-gray-300 block">{skill}</span>
                                  <span className="text-xs text-gray-500">
                                    {skill.toLowerCase().includes('programming') ? 'Coding Skill' :
                                     skill.toLowerCase().includes('circuit') ? 'Electronics Knowledge' :
                                     skill.toLowerCase().includes('design') ? 'Design Capability' :
                                     skill.toLowerCase().includes('cad') ? 'Technical Design' :
                                     'Technical Skill'}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => router.push(`/dashboard/learning?skill=${encodeURIComponent(skill)}&project=${projectId}`)}
                              >
                                Learn
                              </Button>
                            </div>
                          ))}
                          <div className="mt-4 p-3 bg-green-500/10 border border-green-400/20 rounded">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-300 font-medium">Personalized Learning</span>
                            </div>
                            <p className="text-xs text-gray-400">
                              Skills are ranked by priority for your project. Start with high-priority skills for fastest progress.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-400 mb-4">Learning path will be generated based on your project requirements.</p>
                          <Button 
                            size="sm"
                            onClick={() => router.push(`/dashboard/learning?project=${projectId}`)}
                          >
                            Explore Learning Resources
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Equipment Capabilities Needed */}
                {project.aiAnalysis?.technical?.keyTechnologies && (
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Settings className="w-5 h-5 text-orange-400" />
                        <span>Fabrication Equipment Needed</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {project.aiAnalysis.technical.keyTechnologies.map((tech, index) => {
                          const getEquipmentType = (technology: string) => {
                            const techLower = technology.toLowerCase();
                            if (techLower.includes('3d') || techLower.includes('print')) return '3D Printer';
                            if (techLower.includes('pcb') || techLower.includes('circuit')) return 'PCB Fabrication';
                            if (techLower.includes('laser') || techLower.includes('cut')) return 'Laser Cutter';
                            if (techLower.includes('cad') || techLower.includes('design')) return 'Design Workstation';
                            if (techLower.includes('soldering')) return 'Electronics Workbench';
                            return 'General Makerspace';
                          };
                          
                          return (
                            <div key={index} className="p-3 bg-white/5 rounded border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="text-white font-medium">{getEquipmentType(tech)}</span>
                                  <p className="text-xs text-gray-400">For: {tech}</p>
                                </div>
                                <Button 
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/fabrication?equipment=${encodeURIComponent(getEquipmentType(tech))}&project=${projectId}`)}
                                >
                                  Book
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-orange-500/10 border border-orange-400/20 rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          <Wrench className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-orange-300 font-medium">Smart Equipment Matching</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Equipment recommendations are based on your technical requirements. Our lab team will help you choose the right tools for your specific needs.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge className={`px-2 py-1 border text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Team Size</span>
                  <span className="text-white">{project.currentTeamSize || 1} / {project.maxTeamSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                {project.startDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Started</span>
                    <span className="text-white">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Leader */}
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Innovation Leader</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm text-white font-medium">
                      {project.creator?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {project.creator 
                        ? `${project.creator.firstName} ${project.creator.lastName}`
                        : 'Unknown User'
                      }
                    </div>
                    <div className="text-sm text-gray-400">
                      {project.creator?.discipline || 'Innovation Leader'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Smart Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const currentPhase = getJourneyPhase(project.status);
                  const teamSize = project.currentTeamSize || 1;
                  
                  switch (currentPhase) {
                    case 'idea':
                    case 'learn':
                      return (
                        <>
                          <Button 
                            className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                            onClick={() => router.push(`/dashboard/learning?project=${projectId}`)}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Learning Resources
                          </Button>
                          <Button 
                            className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                            onClick={() => router.push(`/dashboard/kits?project=${projectId}`)}
                          >
                            <Cpu className="w-4 h-4 mr-2" />
                            Request IoT Kit
                          </Button>
                          {teamSize === 1 && (
                            <Button 
                              className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 text-green-300"
                              onClick={() => router.push(`/dashboard/community/team-matching?project=${projectId}`)}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Find Learning Partner
                            </Button>
                          )}
                        </>
                      );
                    
                    case 'build':
                      return (
                        <>
                          <Button 
                            className="w-full justify-start bg-orange-600/20 hover:bg-orange-600/30 text-orange-300"
                            onClick={() => router.push(`/dashboard/fabrication?project=${projectId}`)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Book Makerspace
                          </Button>
                          <Button 
                            className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                            onClick={() => router.push(`/dashboard/kits?project=${projectId}`)}
                          >
                            <Wrench className="w-4 h-4 mr-2" />
                            Order Components
                          </Button>
                          <Button 
                            className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                            onClick={() => router.push(`/dashboard/learning?project=${projectId}&focus=cad-design`)}
                          >
                            <Code className="w-4 h-4 mr-2" />
                            CAD Design Tools
                          </Button>
                          {teamSize < 3 && (
                            <Button 
                              className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 text-green-300"
                              onClick={() => router.push(`/dashboard/community/team-matching?project=${projectId}&skills=${project.aiAnalysis?.technical?.requiredSkills?.join(',') || ''}`)}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Invite Experts
                            </Button>
                          )}
                        </>
                      );
                    
                    case 'team':
                      return (
                        <>
                          <Button 
                            className="w-full justify-start bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300"
                            onClick={() => router.push(`/dashboard/community?project=${projectId}&activity=user-testing`)}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            User Testing
                          </Button>
                          <Button 
                            className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 text-green-300"
                            onClick={() => router.push(`/dashboard/business?project=${projectId}`)}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Business Planning
                          </Button>
                          <Button 
                            className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                            onClick={() => router.push(`/dashboard/fabrication?project=${projectId}&mode=iterate`)}
                          >
                            <Rocket className="w-4 h-4 mr-2" />
                            Iterate Design
                          </Button>
                        </>
                      );
                    
                    case 'launch':
                      return (
                        <>
                          <Button 
                            className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                            onClick={() => router.push(`/dashboard/community?project=${projectId}&activity=showcase`)}
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Showcase Project
                          </Button>
                          <Button 
                            className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 text-green-300"
                            onClick={() => router.push(`/dashboard/business?project=${projectId}`)}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Business Strategy
                          </Button>
                          <Button 
                            className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                            onClick={() => router.push(`/dashboard/community?project=${projectId}&activity=mentor`)}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Mentor Others
                          </Button>
                        </>
                      );
                    
                    default:
                      return (
                        <>
                          <Button 
                            className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                            onClick={() => router.push(`/dashboard/learning?project=${projectId}`)}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Learning Hub
                          </Button>
                          <Button 
                            className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                            onClick={() => router.push(`/dashboard/kits?project=${projectId}`)}
                          >
                            <Wrench className="w-4 h-4 mr-2" />
                            IoT Kits
                          </Button>
                        </>
                      );
                  }
                })()}
                
                {/* Always Available Actions */}
                <div className="border-t border-white/10 pt-3 mt-3">
                  <Button 
                    className="w-full justify-start bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 mb-2"
                    onClick={() => router.push(`/dashboard/projects/${projectId}/files`)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Project Files
                  </Button>
                  <Button 
                    className="w-full justify-start bg-gray-600/20 hover:bg-gray-600/30 text-gray-300"
                    onClick={() => router.push(`/dashboard/projects/${projectId}/team`)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Team Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
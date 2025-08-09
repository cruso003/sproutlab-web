'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft,
  Users,
  Calendar,
  Target,
  TrendingUp,
  DollarSign,
  Wrench,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Settings,
  MessageSquare,
  FileText,
  Lightbulb,
  Zap,
  Globe,
  Award,
  User,
  Mail,
  Share2,
  Edit,
  Trash2,
  Brain,
  Rocket
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUIStore } from '@/lib/stores';
import { api } from '@/lib/api';
import { InnovationProject } from '@/lib/types';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useUIStore();
  
  const [project, setProject] = useState<InnovationProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [joinDialog, setJoinDialog] = useState({
    open: false,
    message: '',
    proposedRole: 'member',
    loading: false
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Determine user's relationship to the project
  const isTeamLeader = project?.teamLeaderId === user?.id;
  const isTeamMember = project?.isCurrentUserMember && !isTeamLeader;
  const isPublicUser = !isTeamLeader && !isTeamMember;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.projects.get(params.id as string);
        
        if (response.success && response.data) {
          setProject(response.data);
        } else {
          throw new Error(response.message || 'Project not found');
        }
      } catch (error: any) {
        console.error('Failed to fetch project:', error);
        addNotification({
          type: 'error',
          title: 'Project Not Found',
          message: error.response?.data?.message || 'Could not load project details'
        });
        router.push('/dashboard/projects');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id, router, addNotification]);

  console.log("Project details fetched successfully:", project);

  const handleJoinRequest = async () => {
    if (!joinDialog.message.trim()) {
      addNotification({
        type: 'error',
        title: 'Message Required',
        message: 'Please include a message explaining why you want to join this project'
      });
      return;
    }

    setJoinDialog(prev => ({ ...prev, loading: true }));

    try {
      const response = await api.collaboration.requestToJoin({
        projectId: project!.id,
        message: joinDialog.message,
        proposedRole: joinDialog.proposedRole
      });

      if (response.success) {
        // Update project state to reflect pending request
        setProject(prev => prev ? { ...prev, hasPendingRequest: true } : null);

        addNotification({
          type: 'success',
          title: 'Request Sent!',
          message: 'Your join request has been sent to the team leader'
        });
        setJoinDialog({
          open: false,
          message: '',
          proposedRole: 'member',
          loading: false
        });
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Request Failed',
        message: error.response?.data?.message || 'Failed to send join request'
      });
    } finally {
      setJoinDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    setDeleteLoading(true);
    try {
      const response = await api.projects.delete(project.id);

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Project Deleted',
          message: 'Project has been successfully deleted'
        });

        // Redirect to projects list
        router.push('/dashboard/projects');
      } else {
        throw new Error(response.message || 'Failed to delete project');
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'Failed to delete project'
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-32 bg-white/10 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-white/10 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-white/10 rounded"></div>
                <div className="h-32 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Button onClick={() => router.push('/dashboard/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideation': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'design': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'prototype': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'testing': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'complete': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'showcase': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'healthcare': return 'bg-red-500/20 text-red-300';
      case 'agriculture': return 'bg-green-500/20 text-green-300';
      case 'infrastructure': return 'bg-blue-500/20 text-blue-300';
      case 'industrial': return 'bg-purple-500/20 text-purple-300';
      case 'environmental': return 'bg-emerald-500/20 text-emerald-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {/* Innovation Journey Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
              <span>Innovation Lab</span>
              <span className="mx-2">→</span>
              <span>Active Projects</span>
              <span className="mx-2">→</span>
              <span className="text-white">Project Execution</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-accent-foreground border-white/20 text-white hover:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            {user?.id === project.teamLeaderId && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </Button>
            )}
          </div>
        </motion.div>

        {/* Project Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center items-center space-x-4 flex-wrap">
            <Badge className={`px-3 py-1 border ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            {project.type && (
              <Badge className={`px-3 py-1 ${getTypeColor(project.type)}`}>
                {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
              </Badge>
            )}
            {project.discipline && (
              <Badge className="px-3 py-1 bg-indigo-500/20 text-indigo-300">
                {project.discipline.replace('_', ' ').split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {project.title}
          </h1>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            {project.description}
          </p>

          {/* Key Metrics - Innovation Journey Context */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{project.currentTeamSize || 1}</div>
              <div className="text-sm text-gray-400">Active Innovators</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {project.status === 'ideation' ? '20%' :
                 project.status === 'design' ? '40%' :
                 project.status === 'prototype' ? '60%' :
                 project.status === 'testing' ? '80%' :
                 project.status === 'complete' ? '100%' : '30%'}
              </div>
              <div className="text-sm text-gray-400">Innovation Progress</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Lightbulb className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {project.spotsAvailable || 0}
              </div>
              <div className="text-sm text-gray-400">Open Positions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-sm text-gray-400">Impact Score</div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Different tab structure based on user role */}
              {(isTeamLeader || isTeamMember) ? (
                // Full access tabs for team members
                <TabsList className="grid w-full grid-cols-4 bg-white/10">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="innovation" className="data-[state=active]:bg-white/20">
                    Innovation Journey
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="data-[state=active]:bg-white/20">
                    Progress & Learning
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-white/20">
                    Lab Resources
                  </TabsTrigger>
                </TabsList>
              ) : (
                // Limited tabs for public users
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                    Project Overview
                  </TabsTrigger>
                  <TabsTrigger value="opportunity" className="data-[state=active]:bg-white/20">
                    Join Opportunity
                  </TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="overview" className="space-y-6">
                {/* Problem Statement */}
                {project.problemStatement && (
                  <Card className="border-0 bg-white/5 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                        Problem Statement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{project.problemStatement}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Solution Approach - Show full details for team members, limited for public */}
                {project.solution && (
                  <Card className="border-0 bg-white/5 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                        Our Innovation Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        {isPublicUser 
                          ? project.solution.length > 200 
                            ? `${project.solution.substring(0, 200)}...`
                            : project.solution
                          : project.solution
                        }
                      </p>
                      {isPublicUser && project.solution.length > 200 && (
                        <p className="text-blue-400 text-sm mt-2 italic">
                          Join our innovation team to see the complete solution details and contribute to development
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <Card className="border-0 bg-white/5 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="text-white">Technologies & Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} className="bg-blue-500/20 text-blue-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Innovation Journey Tab - Only for team members */}
              {(isTeamLeader || isTeamMember) && (
                <TabsContent value="innovation">
                  {/* AI Analysis Section - Show rich insights from innovation start */}
                  {project.aiAnalysis ? (
                    <div className="space-y-6">
                      {/* Original Idea Context */}
                      {project.originalIdea && (
                        <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-md border border-purple-400/20">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
                              Original Innovation Spark
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 leading-relaxed italic">
                              "{project.originalIdea}"
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Opportunity Analysis */}
                      {project.aiAnalysis.opportunity && (
                        <Card className="border-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md border border-green-400/20">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <Target className="w-5 h-5 mr-2 text-green-400" />
                              AI Market Opportunity Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-white font-medium mb-2">Market Impact</h4>
                                <p className="text-sm text-gray-300">{project.aiAnalysis.opportunity.impact}</p>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Market Size</h4>
                                <p className="text-sm text-gray-300">{project.aiAnalysis.opportunity.marketSize}</p>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Unique Value</h4>
                                <p className="text-sm text-gray-300">{project.aiAnalysis.opportunity.uniqueValue}</p>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">African Context</h4>
                                <p className="text-sm text-gray-300">{project.aiAnalysis.opportunity.africanContext}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Technical Requirements */}
                      {project.aiAnalysis.technical && (
                        <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-400/20">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <Wrench className="w-5 h-5 mr-2 text-blue-400" />
                              Technical Blueprint
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-white font-medium mb-2">Complexity Score</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="text-2xl font-bold text-blue-400">{project.aiAnalysis.technical.complexity}/10</div>
                                  <div className="text-sm text-gray-300">Technical Difficulty</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Timeline</h4>
                                <div className="flex items-center text-blue-400">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {project.aiAnalysis.technical.estimatedTime}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-white font-medium mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.aiAnalysis.technical.requiredSkills.slice(0, 6).map((skill, index) => (
                                    <Badge key={index} className="bg-blue-500/20 text-blue-300 text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Key Technologies</h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.aiAnalysis.technical.keyTechnologies.slice(0, 4).map((tech, index) => (
                                    <Badge key={index} className="bg-cyan-500/20 text-cyan-300 text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {project.aiAnalysis.technical.kitComponents.length > 0 && (
                              <div>
                                <h4 className="text-white font-medium mb-2">IoT Kit Components</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                  {project.aiAnalysis.technical.kitComponents.slice(0, 6).map((component, index) => (
                                    <div key={index} className="bg-white/5 rounded px-3 py-2 text-gray-300">
                                      {component}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Commercial Viability */}
                      {project.aiAnalysis.commercial && (
                        <Card className="border-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md border border-orange-400/20">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <DollarSign className="w-5 h-5 mr-2 text-orange-400" />
                              Commercial & Market Intelligence
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-white font-medium mb-2">Revenue Model</h4>
                                <p className="text-sm text-gray-300">{project.aiAnalysis.commercial.revenue}</p>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Market Position</h4>
                                <p className="text-sm text-gray-300">{project.aiAnalysis.commercial.moat}</p>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Target Customers</h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.aiAnalysis.commercial.customers.slice(0, 4).map((customer, index) => (
                                    <Badge key={index} className="bg-orange-500/20 text-orange-300 text-xs">
                                      {customer}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-white font-medium mb-2">Local Affordability</h4>
                                <p className="text-sm text-gray-300">{project.aiAnalysis.commercial.localAffordability}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Execution Phases */}
                      {project.aiAnalysis.execution && project.aiAnalysis.execution.phases.length > 0 && (
                        <Card className="border-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-md border border-indigo-400/20">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2 text-indigo-400" />
                              AI-Recommended Execution Roadmap
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              {project.aiAnalysis.execution.phases.slice(0, 4).map((phase, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                                      <span className="text-sm font-medium text-indigo-300">{index + 1}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium">{phase.name}</h4>
                                    <p className="text-sm text-gray-400 mb-2">{phase.duration}</p>
                                    <div className="text-sm text-gray-300">
                                      {phase.milestones.slice(0, 2).map((milestone, mIndex) => (
                                        <div key={mIndex} className="flex items-center space-x-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                          <span>{milestone}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="border-t border-white/10 pt-4">
                              <h4 className="text-white font-medium mb-2">Resource Optimization</h4>
                              <p className="text-sm text-gray-300">{project.aiAnalysis.execution.resourceOptimization}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    // Fallback for projects without AI analysis
                    <Card className="border-0 bg-white/5 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Zap className="w-5 h-5 mr-2" />
                          Innovation Journey & Learning Path
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="text-white font-medium">🚀 Innovation Stages</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">Idea Validation with AI Analysis</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">Project Formation & Team Assembly</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                                <span className="text-white font-medium">Active Development & Prototyping</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                                <span className="text-gray-400">Testing & Market Validation</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                                <span className="text-gray-400">Launch & Commercialization</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-white font-medium">📚 Skills & Learning</h4>
                            <div className="space-y-2 text-sm text-gray-300">
                              <p>• Multi-disciplinary collaboration</p>
                              <p>• Real-world problem solving</p>
                              <p>• IoT prototype development</p>
                              <p>• Project management</p>
                              <p>• Innovation methodology</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}

              {/* Join Opportunity Tab - Only for public users */}
              {isPublicUser && (
                <TabsContent value="opportunity">
                  <Card className="border-0 bg-white/5 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-400" />
                        Innovation Collaboration Opportunity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        Join the SproutLab innovation ecosystem and be part of solving real-world challenges through cutting-edge IoT solutions.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="text-white font-medium flex items-center">
                            <Target className="w-4 h-4 mr-2 text-green-400" />
                            What You'll Gain
                          </h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Hands-on IoT development experience</li>
                            <li>• Multi-disciplinary collaboration skills</li>
                            <li>• Real-world impact on community challenges</li>
                            <li>• Mentorship from industry experts</li>
                            <li>• Portfolio projects for career advancement</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-white font-medium flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                            How to Contribute
                          </h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Share your expertise and ideas</li>
                            <li>• Collaborate on prototyping</li>
                            <li>• Help with testing and validation</li>
                            <li>• Contribute to documentation</li>
                            <li>• Support commercialization efforts</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="progress">
                <Card className="border-0 bg-white/5 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      {isPublicUser ? 'Innovation Progress Updates' : 'Progress & Learning Milestones'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Innovation Milestones
                      </h3>
                      <p className="text-gray-400">
                        {isPublicUser 
                          ? 'Track the innovation journey and see how the team is progressing toward their goals.'
                          : 'Detailed milestone tracking, learning objectives, and innovation metrics coming soon.'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card className="border-0 bg-white/5 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wrench className="w-5 h-5 mr-2" />
                      {isPublicUser ? 'Innovation Resources' : 'Lab Resources & Tools'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Innovation Toolkit
                      </h3>
                      <p className="text-gray-400">
                        {isPublicUser 
                          ? 'Discover the tools, methodologies, and resources used in this innovation project.'
                          : 'Access to lab equipment, IoT components, fabrication tools, and learning materials.'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Join Opportunity Tab - Only for public users */}
              <TabsContent value="opportunity">
                <div className="space-y-6">
                  {/* Why Join This Team */}
                  <Card className="border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md border border-green-400/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Star className="w-5 h-5 mr-2 text-green-400" />
                        Why Join This Innovation Team?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">High Impact Innovation</h4>
                              <p className="text-sm text-gray-300">Work on real-world problems with commercial potential</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                              <Lightbulb className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">Learn Cutting-Edge Skills</h4>
                              <p className="text-sm text-gray-300">Hands-on experience with IoT, AI, and fabrication</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                              <Users className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">Collaborative Environment</h4>
                              <p className="text-sm text-gray-300">Work with diverse engineering disciplines</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                              <Globe className="w-4 h-4 text-orange-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">Market-Ready Solutions</h4>
                              <p className="text-sm text-gray-300">Build solutions designed for African markets</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-0.5">
                              <Award className="w-4 h-4 text-pink-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">Portfolio Building</h4>
                              <p className="text-sm text-gray-300">Create impressive projects for your career</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                              <Rocket className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">Innovation Network</h4>
                              <p className="text-sm text-gray-300">Connect with SaharaSpout ecosystem</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills & Roles Needed */}
                  {project.aiAnalysis?.technical?.requiredSkills && (
                    <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-400/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Wrench className="w-5 h-5 mr-2 text-blue-400" />
                          Skills & Expertise Needed
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300">This project needs team members with diverse skills. Don't worry if you don't have all of them - we learn together!</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-medium mb-3">Technical Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.aiAnalysis.technical.requiredSkills.slice(0, 6).map((skill, index) => (
                                <Badge key={index} variant="outline" className="border-blue-400/50 text-blue-300 text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-3">You Could Contribute</h4>
                            <div className="space-y-2 text-sm text-gray-300">
                              <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span>Fresh perspectives and ideas</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span>Research and documentation</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span>Testing and user feedback</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span>Marketing and business development</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Learning Opportunities */}
                  {project.aiAnalysis?.technical?.keyTechnologies && (
                    <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-400/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-purple-400" />
                          What You'll Learn
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300">Join this project and gain hands-on experience with cutting-edge technologies:</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-medium mb-3">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.aiAnalysis.technical.keyTechnologies.slice(0, 4).map((tech, index) => (
                                <Badge key={index} variant="outline" className="border-purple-400/50 text-purple-300 text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-3">Estimated Timeline</h4>
                            <p className="text-sm text-gray-300">
                              {project.aiAnalysis.technical.estimatedTime || 'Multi-semester project'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Complexity: {project.aiAnalysis.technical.complexity}/10
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* How to Join */}
                  <Card className="border-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md border border-orange-400/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-orange-400" />
                        Ready to Join? Here's How
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">1</span>
                          </div>
                          <h4 className="text-white font-medium mb-2">Send Request</h4>
                          <p className="text-sm text-gray-300">Click the join button and tell us why you're interested</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">2</span>
                          </div>
                          <h4 className="text-white font-medium mb-2">Team Review</h4>
                          <p className="text-sm text-gray-300">Team leader reviews your interest and background</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">3</span>
                          </div>
                          <h4 className="text-white font-medium mb-2">Start Innovating</h4>
                          <p className="text-sm text-gray-300">Meet the team and begin your innovation journey</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Team Information */}
            <Card className="border-0 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Team Leader */}
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {project.creator 
                        ? `${project.creator.firstName} ${project.creator.lastName}`
                        : 'Project Leader'
                      }
                    </div>
                    <div className="text-sm text-gray-400">
                      Team Lead
                      {project.creator?.discipline && (
                        <span className="ml-1">
                          • {project.creator.discipline.replace('_', ' ').split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-blue-600 text-white text-xs">Leader</Badge>
                </div>

                {/* Role-based Team Actions */}
                {isPublicUser && project.spotsAvailable && project.spotsAvailable > 0 && (
                  <>
                    {project.hasPendingRequest ? (
                      <Button 
                        disabled
                        className="w-full bg-yellow-600 text-white cursor-not-allowed opacity-75"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Request Pending
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                        onClick={() => setJoinDialog({ ...joinDialog, open: true })}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Request to Join Innovation
                      </Button>
                    )}
                  </>
                )}

                {/* Team Member Badge */}
                {isTeamMember && (
                  <div className="w-full p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
                    <Badge className="bg-green-600 text-white">Innovation Team Member</Badge>
                  </div>
                )}

                {/* Team Leader Badge */}
                {isTeamLeader && (
                  <div className="w-full p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-center">
                    <Badge className="bg-blue-600 text-white">Innovation Leader</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card className="border-0 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Started</span>
                  <span className="text-white font-medium">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Target Completion</span>
                  <span className="text-white font-medium">
                    {project.targetCompletionDate ? new Date(project.targetCompletionDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                {project.actualCompletionDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Completed</span>
                    <span className="text-green-400 font-medium">
                      {new Date(project.actualCompletionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Innovation Engagement - Role-based */}
            {isPublicUser ? (
              <Card className="border-0 bg-white/5 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Join the Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    Ready to be part of solving real-world challenges? Join our innovation team or visit our lab to explore collaboration opportunities.
                  </p>
                  <Button 
                    variant="outline" 
                    className="bg-accent-foreground w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      addNotification({
                        type: 'success',
                        title: 'Visit SproutLab!',
                        message: 'Come to the Innovation Lab during open hours to meet the project team.'
                      });
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Visit Innovation Lab
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 bg-white/5 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Innovation Team Hub
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    Collaborate with your innovation team and access lab resources.
                  </p>
                  <Button 
                    variant="outline" 
                    className="bg-accent-foreground w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Team Communication
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Join Innovation Request Dialog */}
      <Dialog open={joinDialog.open} onOpenChange={(open) => setJoinDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Join Innovation Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Request to join "{project?.title}" and be part of solving real-world challenges
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Proposed Role</label>
              <select
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-white"
                value={joinDialog.proposedRole}
                onChange={(e) => setJoinDialog(prev => ({ ...prev, proposedRole: e.target.value }))}
                aria-label="Proposed role for joining the innovation team"
              >
                <option value="member">Innovation Team Member</option>
                <option value="contributor">Technical Contributor</option>
                <option value="advisor">Innovation Advisor</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Message to Innovation Leader <span className="text-red-400">*</span>
              </label>
              <Textarea
                placeholder="Tell us about your background, skills, and why you want to join this innovation project..."
                className="bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                rows={4}
                value={joinDialog.message}
                onChange={(e) => setJoinDialog(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setJoinDialog(prev => ({ ...prev, open: false }))}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              disabled={joinDialog.loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinRequest}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={joinDialog.loading}
            >
              {joinDialog.loading ? 'Sending...' : 'Send Innovation Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Project</DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to delete this project? This action cannot be undone.
              <br />
              <strong className="text-red-400">Project: {project?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Warning</span>
              </div>
              <p className="mt-2 text-sm text-red-300">
                This will permanently delete:
              </p>
              <ul className="mt-2 text-sm text-red-300 list-disc list-inside">
                <li>Project data and description</li>
                <li>All team member assignments</li>
                <li>Collaboration requests and history</li>
                <li>Project files and documentation</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProject}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

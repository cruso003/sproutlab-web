'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Zap, 
  Users, 
  Target, 
  Calendar,
  TrendingUp,
  Lightbulb,
  Brain,
  Wrench,
  BookOpen,
  MessageSquare,
  Settings,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Rocket,
  Search,
  Filter,
  Grid3X3,
  List,
  Kanban,
  SortAsc,
  MoreHorizontal
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuth } from '@/lib/auth-context';
import { useUIStore } from '@/lib/stores';
import { api } from '@/lib/api';
import { log } from 'console';

interface UserProject {
  id: string;
  title: string;
  description: string;
  status: 'ideation' | 'design' | 'prototype' | 'testing' | 'complete' | 'showcase';
  type?: 'healthcare' | 'agriculture' | 'infrastructure' | 'industrial' | 'environmental' | 'other';
  currentTeamSize?: number;
  spotsAvailable?: number;
  startDate?: string;
  targetCompletionDate?: string;
  createdAt: string;
  aiAnalysis?: {
    opportunity?: { impact: string; marketSize: string; };
    technical?: { complexity: number; estimatedTime: string; requiredSkills: string[]; };
    commercial?: { revenue: string; customers: string[]; };
    execution?: { phases: Array<{ name: string; duration: string; milestones: string[]; }>; };
  };
  originalIdea?: string;
  nextMilestones?: string[];
  blockers?: string[];
  recentActivity?: Array<{ action: string; date: string; }>;
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'grid' | 'dashboard' | 'kanban'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'priority' | 'progress'>('recent');

  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useUIStore();

  useEffect(() => {
    fetchMyProjects();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          const priorityOrder: Record<string, number> = { 
            'testing': 4, 'prototype': 3, 'design': 2, 'ideation': 1, 'complete': 0, 'showcase': 0 
          };
          return (priorityOrder[b.status] || 0) - (priorityOrder[a.status] || 0);
        case 'progress':
          return getProgressPercentage(b.status) - getProgressPercentage(a.status);
        default:
          return 0;
      }
    });

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      // Get user's projects only using the correct API parameter
      const response = await api.projects.list({ my_projects: 'true' });
      
      if (response.success && response.data) {
        // Handle the actual response format: {success: true, data: Array, message: string}
        const projectsArray = Array.isArray(response.data) ? response.data : response.data.data || [];
        setProjects(projectsArray);
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Failed to Load Projects',
        message: 'Could not load your innovation projects'
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'ideation': return 10;
      case 'design': return 25;
      case 'prototype': return 50;
      case 'testing': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const getNextAction = (project: UserProject) => {
    if (!project.aiAnalysis) return 'Complete AI analysis';
    
    switch (project.status) {
      case 'ideation': return 'Assemble team and validate concept';
      case 'design': return 'Create technical specifications';
      case 'prototype': return 'Build and test MVP';
      case 'testing': return 'Gather user feedback and iterate';
      case 'complete': return 'Prepare for showcase';
      default: return 'Start innovation journey';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideation': return 'text-yellow-400 bg-yellow-400/10';
      case 'design': return 'text-blue-400 bg-blue-400/10';
      case 'prototype': return 'text-purple-400 bg-purple-400/10';
      case 'testing': return 'text-orange-400 bg-orange-400/10';
      case 'complete': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-white/10 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Personal Innovation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              My Innovation Workspace
            </h1>
            <p className="text-gray-300 text-lg">
              Your personal innovation command center - track progress, manage resources, and accelerate development
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.push('/dashboard/innovation/start')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Innovation
            </Button>
          </div>
        </motion.div>

        {projects.length === 0 ? (
          /* Empty State - First Innovation */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Lightbulb className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Innovation Journey?
              </h2>
              
              <p className="text-gray-300 text-lg mb-8">
                Transform your ideas into real-world solutions with AI-powered guidance, 
                smart team assembly, and comprehensive lab resources.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">AI Analysis</h3>
                    <p className="text-sm text-gray-400">Get intelligent insights on market opportunity, technical complexity, and execution strategy</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Smart Teams</h3>
                    <p className="text-sm text-gray-400">Connect with complementary skills and collaborate with diverse engineering disciplines</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                  <CardContent className="p-6 text-center">
                    <Wrench className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Lab Resources</h3>
                    <p className="text-sm text-gray-400">Access IoT kits, fabrication tools, and rapid prototyping capabilities</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={() => router.push('/dashboard/innovation/start')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch Your First Innovation
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Search, Filter, and View Controls */}
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search your projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ideation">Ideation</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="prototype">Prototype</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* View Toggle and Project Count */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  My Projects ({filteredAndSortedProjects.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={activeView === 'grid' ? 'default' : 'outline'}
                    onClick={() => setActiveView('grid')}
                    size="sm"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={activeView === 'dashboard' ? 'default' : 'outline'}
                    onClick={() => setActiveView('dashboard')}
                    size="sm"
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                  <Button
                    variant={activeView === 'kanban' ? 'default' : 'outline'}
                    onClick={() => setActiveView('kanban')}
                    size="sm"
                  >
                    <Kanban className="w-4 h-4 mr-2" />
                    Kanban
                  </Button>
                </div>
              </div>
            </div>

            {/* Projects Display */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Projects Content */}
              <div className="lg:col-span-3 space-y-6">
                {activeView === 'grid' ? (
                  /* Compact Grid View - Best for Many Projects */
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredAndSortedProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group cursor-pointer"
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      >
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20 h-64">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <Badge className={`px-2 py-1 text-xs w-fit ${getStatusColor(project.status)}`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </Badge>
                              <MoreHorizontal className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-blue-300 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                          </CardHeader>
                          
                          <CardContent className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-400">Progress</span>
                                <span className="text-xs text-white">{getProgressPercentage(project.status)}%</span>
                              </div>
                              <Progress value={getProgressPercentage(project.status)} className="h-1" />
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-300">{project.currentTeamSize || 1}</span>
                              </div>
                              {project.aiAnalysis && (
                                <div className="flex items-center space-x-1">
                                  <Brain className="w-3 h-3 text-purple-400" />
                                  <span className="text-purple-300">{project.aiAnalysis.technical?.complexity || 'N/A'}/10</span>
                                </div>
                              )}
                              <span className="text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : activeView === 'dashboard' ? (
                  /* Intelligence Dashboard View - Detailed for Analysis */
                  <div className="grid gap-4">
                    {filteredAndSortedProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group cursor-pointer"
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      >
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                    {project.title}
                                  </h3>
                                  <Badge className={`px-2 py-1 text-xs ${getStatusColor(project.status)}`}>
                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {/* Progress & Intelligence */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-400">Innovation Progress</span>
                                  <span className="text-sm text-white font-medium">{getProgressPercentage(project.status)}%</span>
                                </div>
                                <Progress value={getProgressPercentage(project.status)} className="h-2 bg-gray-700" />
                              </div>
                              
                              {project.aiAnalysis && (
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Brain className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm text-gray-300">Complexity:</span>
                                    <span className="text-sm text-purple-300 font-medium">
                                      {project.aiAnalysis.technical?.complexity || 'N/A'}/10
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Next Action & Team */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Target className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm font-medium text-white">Next Action</span>
                                </div>
                                <p className="text-sm text-blue-300">{getNextAction(project)}</p>
                              </div>
                              
                              <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/20">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Users className="w-4 h-4 text-green-400" />
                                  <span className="text-sm font-medium text-white">Team Status</span>
                                </div>
                                <p className="text-sm text-green-300">
                                  {project.currentTeamSize || 1} members • {project.spotsAvailable || 0} spots open
                                </p>
                              </div>
                            </div>

                            {/* AI Insights Preview */}
                            {project.aiAnalysis && (
                              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-400/20">
                                <div className="flex items-center space-x-2 mb-3">
                                  <Zap className="w-4 h-4 text-purple-400" />
                                  <span className="text-sm font-medium text-white">AI Innovation Intelligence</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3 text-xs">
                                  {project.aiAnalysis.opportunity && (
                                    <div>
                                      <span className="text-gray-400">Market Impact:</span>
                                      <p className="text-purple-300 line-clamp-1">{project.aiAnalysis.opportunity.impact}</p>
                                    </div>
                                  )}
                                  {project.aiAnalysis.commercial && (
                                    <div>
                                      <span className="text-gray-400">Revenue Model:</span>
                                      <p className="text-blue-300 line-clamp-1">{project.aiAnalysis.commercial.revenue}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Kanban View - Best for Status Management */
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {['ideation', 'design', 'prototype', 'testing', 'complete'].map((status) => {
                      const statusProjects = filteredAndSortedProjects.filter(p => p.status === status);
                      return (
                        <div key={status} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold capitalize">{status}</h3>
                            <Badge className={`px-2 py-1 text-xs ${getStatusColor(status)}`}>
                              {statusProjects.length}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {statusProjects.map((project) => (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="cursor-pointer"
                                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                              >
                                <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all p-3">
                                  <h4 className="text-white font-medium text-sm line-clamp-2 mb-2">{project.title}</h4>
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-300">{project.currentTeamSize || 1}</span>
                                    </div>
                                    {project.aiAnalysis && (
                                      <div className="flex items-center space-x-1">
                                        <Brain className="w-3 h-3 text-purple-400" />
                                        <span className="text-purple-300">{project.aiAnalysis.technical?.complexity}/10</span>
                                      </div>
                                    )}
                                  </div>
                                  <Progress value={getProgressPercentage(project.status)} className="h-1 mt-2" />
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Innovation Workspace Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Innovation Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-400/30"
                      onClick={() => router.push('/dashboard/kits')}
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Smart Kit Assembly
                    </Button>
                    <Button 
                      className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-400/30"
                      onClick={() => router.push('/dashboard/fabrication')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Fabrication Lab
                    </Button>
                    <Button 
                      className="w-full justify-start bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-400/30"
                      onClick={() => router.push('/dashboard/learning')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learning Hub
                    </Button>
                  </CardContent>
                </Card>

                {/* Innovation Metrics */}
                <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">My Innovation Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Total Projects</span>
                      <span className="text-white font-semibold">{projects.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Filtered Projects</span>
                      <span className="text-blue-400 font-semibold">{filteredAndSortedProjects.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">In Progress</span>
                      <span className="text-yellow-400 font-semibold">
                        {filteredAndSortedProjects.filter(p => ['ideation', 'design', 'prototype', 'testing'].includes(p.status)).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Completed</span>
                      <span className="text-green-400 font-semibold">
                        {filteredAndSortedProjects.filter(p => p.status === 'complete').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Team Members</span>
                      <span className="text-blue-400 font-semibold">
                        {filteredAndSortedProjects.reduce((sum, p) => sum + (p.currentTeamSize || 1), 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">AI Enhanced</span>
                      <span className="text-purple-400 font-semibold">
                        {filteredAndSortedProjects.filter(p => p.aiAnalysis).length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
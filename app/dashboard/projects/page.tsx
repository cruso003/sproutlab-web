'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search,
  Plus,
  Users,
  Calendar,
  Target,
  Filter,
  Grid,
  List,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Lightbulb,
  Rocket,
  User,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUIStore } from '@/lib/stores';
import { api } from '@/lib/api';
import { InnovationProject } from '@/lib/types';

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useUIStore();
  
  const [projects, setProjects] = useState<InnovationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Set default filter to show all projects for better discovery
  const [filter, setFilter] = useState<'all' | 'my' | 'open'>('all');
  
  // Join request dialog state
  const [joinDialog, setJoinDialog] = useState({
    open: false,
    projectId: '',
    projectTitle: '',
    message: '',
    proposedRole: 'member',
    loading: false
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.projects.list();
        
        if (response.success && response.data) {
          // Handle both paginated and direct array responses
          setProjects(Array.isArray(response.data) ? response.data : response.data.data || []);
        }
      } catch (error: any) {
        console.error('Failed to fetch projects:', error);
        addNotification({
          type: 'error',
          title: 'Failed to Load Projects',
          message: error.response?.data?.message || 'Could not load projects'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [addNotification]);

  const handleJoinRequest = (projectId: string, projectTitle: string) => {
    setJoinDialog({
      open: true,
      projectId,
      projectTitle,
      message: '',
      proposedRole: 'member',
      loading: false
    });
  };

  const submitJoinRequest = async () => {
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
        projectId: joinDialog.projectId,
        message: joinDialog.message,
        proposedRole: joinDialog.proposedRole
      });

      if (response.success) {
        // Update the project state to reflect the pending request
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === joinDialog.projectId 
              ? { ...project, hasPendingRequest: true }
              : project
          )
        );

        addNotification({
          type: 'success',
          title: 'Request Sent!',
          message: 'Your join request has been sent to the team leader'
        });
        setJoinDialog({
          open: false,
          projectId: '',
          projectTitle: '',
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // New approach: Let students see all projects for collaboration opportunities
    const hasAccess = (() => {
      if (!user) return false;
      
      // All authenticated users can see projects
      // This enables students to discover collaboration opportunities
      return true;
    })();
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'my' && project.teamLeaderId === user?.id) ||
                         (filter === 'open' && project.spotsAvailable && project.spotsAvailable > 0);
    
    return matchesSearch && hasAccess && matchesFilter;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white/10 rounded-xl"></div>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Innovation Projects
            </h1>
            <p className="text-gray-300">
              Discover cutting-edge innovation projects and explore collaboration opportunities
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/dashboard/innovation/start')}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start New Project
          </Button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex gap-2">
              {/* All Projects button - now available for all users */}
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 border-white/20 text-white hover:bg-white/10 hover:text-white'
                }
              >
                All Projects
              </Button>
              <Button
                variant={filter === 'my' ? 'default' : 'outline'}
                onClick={() => setFilter('my')}
                className={filter === 'my' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 border-white/20 text-white hover:bg-white/10 hover:text-white'
                }
              >
                My Projects
              </Button>
              <Button
                variant={filter === 'open' ? 'default' : 'outline'}
                onClick={() => setFilter('open')}
                className={filter === 'open' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 border-white/20 text-white hover:bg-white/10 hover:text-white'
                }
              >
                {user?.role === 'student' ? 'Available to Join' : 'Open to Join'}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode('grid')}
              className={`border-white/20 hover:bg-white/10 ${
                viewMode === 'grid' 
                  ? 'bg-white/20 text-white border-white/40' 
                  : 'bg-gray-500 text-white/70 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode('list')}
              className={`border-white/20 hover:bg-white/10 ${
                viewMode === 'list' 
                  ? 'bg-white/20 text-white border-white/40' 
                  : 'bg-gray-500 text-white/70 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start an innovation project!'}
              </p>
              <Button 
                onClick={() => router.push('/dashboard/innovation/start')}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Start First Project
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  className="cursor-pointer"
                >
                  <Card className="border-0 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`px-2 py-1 text-xs border ${getStatusColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                          {project.type && (
                            <Badge className={`px-2 py-1 text-xs ${getTypeColor(project.type)}`}>
                              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                            </Badge>
                          )}
                        </div>
                        {project.spotsAvailable && project.spotsAvailable > 0 && (
                          <Badge className="bg-green-600 text-white text-xs">
                            {project.spotsAvailable} spots open
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-white text-lg leading-tight">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-gray-400">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.currentTeamSize || 1}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                      </div>
                      
                      {/* Team Leader Information */}
                      {project.creator && (
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <User className="w-4 h-4" />
                          <span>Led by {project.creator.firstName} {project.creator.lastName}</span>
                          {project.creator.discipline && (
                            <Badge className="bg-indigo-500/20 text-indigo-300 text-xs ml-2">
                              {project.creator.discipline.replace('_', ' ').split(' ').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} className="bg-blue-500/20 text-blue-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge className="bg-gray-500/20 text-gray-300 text-xs">
                              +{project.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          View Project
                        </Button>
                        
                        {/* Show appropriate action based on user's relationship to the project */}
                        {project.teamLeaderId !== user?.id && 
                         !project.isCurrentUserMember &&
                         project.spotsAvailable && 
                         project.spotsAvailable > 0 && (
                          <>
                            {/* Show Requested button if user has pending request */}
                            {project.hasPendingRequest ? (
                              <Button
                                disabled
                                className="bg-yellow-600 text-white cursor-not-allowed opacity-75"
                                size="sm"
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Requested
                              </Button>
                            ) : (
                              /* Show Join button if no pending request */
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJoinRequest(project.id, project.title);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Join
                              </Button>
                            )}
                          </>
                        )}
                        
                        {/* Show Member badge if user is already a member */}
                        {project.isCurrentUserMember && project.teamLeaderId !== user?.id && (
                          <Badge variant="outline" className="border-green-500 text-green-400">
                            <Users className="w-3 h-3 mr-1" />
                            Member
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Join Request Dialog */}
      <Dialog open={joinDialog.open} onOpenChange={(open) => setJoinDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Request to Join Project
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Send a request to join "{joinDialog.projectTitle}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="proposed-role" className="block text-sm font-medium text-gray-300 mb-2">
                Your Role
              </label>
              <select
                id="proposed-role"
                value={joinDialog.proposedRole}
                onChange={(e) => setJoinDialog(prev => ({ ...prev, proposedRole: e.target.value }))}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="member">Team Member</option>
                <option value="mentor">Mentor</option>
                <option value="advisor">Advisor</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Why do you want to join? *
              </label>
              <Textarea
                value={joinDialog.message}
                onChange={(e) => setJoinDialog(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Explain your interest and what you can contribute to this project..."
                className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setJoinDialog(prev => ({ ...prev, open: false }))}
              className="bg-accent-foreground border-white/20 text-white hover:bg-white/10"
              disabled={joinDialog.loading}
            >
              Cancel
            </Button>
            <Button
              onClick={submitJoinRequest}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={joinDialog.loading || !joinDialog.message.trim()}
            >
              {joinDialog.loading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

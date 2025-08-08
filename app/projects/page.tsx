'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Users,
  Zap,
  BarChart3,
  Eye,
  Edit,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useProjects, useAuth, useProjectStats } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const router = useRouter();
  const { user } = useAuth();
  const { data: projects, isLoading } = useProjects();
  const { data: projectStats, isLoading: statsLoading } = useProjectStats();
  const { addNotification, openModal } = useUIStore();

  console.log("projects:", projects);
  
  // Type assertion to help TypeScript understand projects is an array
  const projectsArray = projects as any[] | null;

  const projectStatsData = [
    {
      title: 'Active Projects',
      value: projectStats?.activeProjects?.count || 0,
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      trend: projectStats?.activeProjects?.trend || '0%'
    },
    {
      title: 'Completed Projects',
      value: projectStats?.completedProjects?.count || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: projectStats?.completedProjects?.trend || '0%'
    },
    {
      title: 'Team Projects',
      value: projectStats?.teamProjects?.count || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      trend: projectStats?.teamProjects?.trend || '0%'
    },
    {
      title: 'Innovation Score',
      value: projectStats?.innovationScore?.score || 0,
      icon: Star,
      color: 'from-orange-500 to-orange-600',
      trend: projectStats?.innovationScore?.trend || '0%'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'development': 
      case 'testing': return <Zap className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'planning': 
      case 'ideation': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development':
      case 'testing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'planning':
      case 'ideation': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Lightbulb className="w-8 h-8 mr-3 text-blue-600" />
              Innovation Hub
            </h1>
            <p className="text-gray-600">
              Manage your innovation projects and track progress
            </p>
          </div>
          <Button 
            onClick={handleCreateProject}
            className="mt-4 lg:mt-0"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            projectStatsData.map((stat, index) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm font-medium mt-1 ${
                        stat.trend.startsWith('+') ? 'text-green-600' : 
                        stat.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.trend}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'development', 'completed', 'planning', 'testing'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
              >
                {filter}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : projectsArray && projectsArray.length > 0 ? (
              projectsArray
                .filter((project: any) => {
                  const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;
                  return matchesSearch && matchesFilter;
                })
                .map((project: any) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {project.description}
                            </CardDescription>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`ml-2 ${getStatusColor(project.status)}`}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(project.status)}
                              {project.status}
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Started {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                          
                          {project.isTeamProject && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              Team Project ({project.currentTeamSize}/{project.maxTeamSize})
                            </div>
                          )}

                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/projects/${project.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/projects/${project.id}/edit`)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                <p className="text-gray-600 mb-4">Start your first innovation project to get going!</p>
                <Button onClick={handleCreateProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Sidebar>
  );
}

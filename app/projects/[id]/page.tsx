'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  Target,
  FileText,
  GitBranch,
  Award,
  Eye,
  Heart,
  MessageSquare,
  Share,
  Download,
  Lightbulb,
  Rocket,
  CheckCircle,
  Clock,
  Star,
  Plus
} from 'lucide-react';
import { useProject, useAuth } from '@/lib/hooks';

const statusConfig = {
  ideation: { 
    icon: Lightbulb, 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50'
  },
  design: { 
    icon: FileText, 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50'
  },
  prototype: { 
    icon: Rocket, 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-gradient-to-r from-purple-50 to-violet-50'
  },
  testing: { 
    icon: Clock, 
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    bgColor: 'bg-gradient-to-r from-orange-50 to-red-50'
  },
  complete: { 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50'
  },
  showcase: { 
    icon: Star, 
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    bgColor: 'bg-gradient-to-r from-pink-50 to-rose-50'
  }
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data: project, isLoading } = useProject(params.id as string);
  
  const [isLiked, setIsLiked] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const status = project.status || 'ideation';
  const StatusIcon = statusConfig[status as keyof typeof statusConfig]?.icon || Lightbulb;
  const statusStyle = statusConfig[status as keyof typeof statusConfig]?.color || '';
  const bgGradient = statusConfig[status as keyof typeof statusConfig]?.bgColor || '';

  const isProjectOwner = user?.id === project.teamLeaderId;
  const isTeamMember = false; // TODO: Check if user is in project team
  const canEdit = isProjectOwner || isTeamMember;
  const canViewPrivateContent = canEdit;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`${bgGradient} px-6 py-12`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <Button 
              variant="ghost" 
              onClick={() => router.push('/projects')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            
            {canEdit && (
              <Button 
                onClick={() => router.push(`/projects/${project.id}/edit`)}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Badge className={`${statusStyle} px-3 py-1 flex items-center gap-2`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.toUpperCase()}
                  </Badge>
                  {project.isTeamProject && (
                    <Badge variant="secondary" className="ml-2">
                      <Users className="w-3 h-3 mr-1" />
                      Team Project
                    </Badge>
                  )}
                  {project.isShowcased && (
                    <Badge className="ml-2 bg-gold-100 text-gold-800">
                      <Star className="w-3 h-3 mr-1" />
                      Showcased
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h1>
                
                <p className="text-lg text-gray-700 mb-6 max-w-3xl">
                  {project.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {project.viewCount || 0} views
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    {project.likeCount || 0} likes
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {project.commentCount || 0} comments
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-6">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Innovation Journey Progress */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center">
                  <Rocket className="w-6 h-6 mr-3 text-blue-600" />
                  Innovation Journey
                </CardTitle>
                <CardDescription>Track the project's progress through the innovation pipeline</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative">
                  {/* Progress Pipeline */}
                  <div className="flex items-center justify-between mb-8">
                    {Object.entries(statusConfig).map(([statusKey, config], index) => {
                      const Icon = config.icon;
                      const isActive = statusKey === status;
                      const isCompleted = Object.keys(statusConfig).indexOf(statusKey) < Object.keys(statusConfig).indexOf(status);
                      
                      return (
                        <div key={statusKey} className="flex flex-col items-center relative">
                          {/* Connection Line */}
                          {index < Object.keys(statusConfig).length - 1 && (
                            <div className={`absolute top-6 left-8 w-16 h-0.5 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
                          )}
                          
                          {/* Status Circle */}
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center border-2 relative z-10
                            ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 
                              isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                              'bg-white border-gray-300 text-gray-400'}
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          {/* Status Label */}
                          <span className={`mt-2 text-xs font-medium capitalize ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                            {statusKey}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Current Status Details */}
                  <div className={`p-4 rounded-lg ${bgGradient} border`}>
                    <div className="flex items-center mb-2">
                      <StatusIcon className="w-5 h-5 mr-2" />
                      <h3 className="font-semibold capitalize">Current Phase: {status}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {status === 'ideation' && "Brainstorming and conceptualizing innovative solutions"}
                      {status === 'design' && "Creating detailed designs and technical specifications"}
                      {status === 'prototype' && "Building and iterating on working prototypes"}
                      {status === 'testing' && "Validating functionality and gathering feedback"}
                      {status === 'complete' && "Project successfully completed and documented"}
                      {status === 'showcase' && "Ready for public demonstration and recognition"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem & Solution Showcase */}
            <div className="grid md:grid-cols-2 gap-6">
              {project.problemStatement && (
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-700">
                      <Target className="w-5 h-5 mr-2" />
                      The Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{project.problemStatement}</p>
                  </CardContent>
                </Card>
              )}

              {project.solution && (
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-700">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Our Innovation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{project.solution}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Technology Stack */}
            {project.tags && project.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitBranch className="w-5 h-5 mr-2 text-purple-600" />
                    Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Links & Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-blue-600" />
                  Project Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {project.repository && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100"
                    >
                      <div className="flex items-center mb-2">
                        <GitBranch className="w-5 h-5 mr-2 text-gray-700" />
                        <span className="font-medium">Repository</span>
                      </div>
                      <p className="text-sm text-gray-600">View source code</p>
                    </motion.div>
                  )}
                  
                  {project.documentationUrl && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100"
                    >
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 mr-2 text-blue-700" />
                        <span className="font-medium">Documentation</span>
                      </div>
                      <p className="text-sm text-gray-600">Technical details</p>
                    </motion.div>
                  )}
                  
                  {project.demoUrl && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100"
                    >
                      <div className="flex items-center mb-2">
                        <Rocket className="w-5 h-5 mr-2 text-green-700" />
                        <span className="font-medium">Live Demo</span>
                      </div>
                      <p className="text-sm text-gray-600">Try it yourself</p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team Collaboration (if team project) */}
            {project.isTeamProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-orange-600" />
                    Innovation Team
                  </CardTitle>
                  <CardDescription>
                    {project.currentTeamSize} of {project.maxTeamSize} members
                    {project.spotsAvailable && project.spotsAvailable > 0 && (
                      <span className="ml-2 text-green-600">• {project.spotsAvailable} spots available</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {project.creator?.firstName?.[0]}{project.creator?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {project.creator?.firstName} {project.creator?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Team Leader • {project.creator?.discipline?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    {project.spotsAvailable && project.spotsAvailable > 0 && !canEdit && (
                      <Button variant="outline" className="ml-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Join Team
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-gold-600" />
                  Impact Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="font-semibold">{project.viewCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Likes</span>
                  <span className="font-semibold text-red-600">{project.likeCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comments</span>
                  <span className="font-semibold text-blue-600">{project.commentCount || 0}</span>
                </div>
                {project.isShowcased && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Featured Project</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="capitalize">{project.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Discipline</label>
                  <p className="capitalize">{project.discipline?.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Started</label>
                  <p>{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                {project.targetCompletionDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Target Completion</label>
                    <p>{new Date(project.targetCompletionDate).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Like Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share Project
                </Button>
                {canViewPrivateContent && (
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Files
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

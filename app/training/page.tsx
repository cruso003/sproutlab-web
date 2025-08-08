'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Search, 
  Filter,
  BookOpen,
  Award,
  Shield,
  BarChart3,
  Play,
  CheckCircle,
  Clock,
  Users,
  Star,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { useTrainingModules, useAuth } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  const { user } = useAuth();
  const { data: modules, isLoading } = useTrainingModules();
  const { addNotification, openModal } = useUIStore();

  const trainingStats = [
    {
      title: 'Modules Completed',
      value: '12',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: '+3 this month'
    },
    {
      title: 'Certificates Earned',
      value: '4',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      trend: '2 pending'
    },
    {
      title: 'Learning Hours',
      value: '48',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      trend: '+12 this week'
    },
    {
      title: 'Skill Level',
      value: 'Intermediate',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      trend: 'Advancing'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'safety', label: 'Safety Training' },
    { value: 'equipment_training', label: 'Equipment Training' },
    { value: 'software_tutorial', label: 'Software Tutorials' },
    { value: 'technical_skills', label: 'Technical Skills' },
    { value: 'project_management', label: 'Project Management' },
    { value: 'innovation_methodology', label: 'Innovation Methods' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return <Shield className="w-4 h-4" />;
      case 'equipment_training': return <GraduationCap className="w-4 h-4" />;
      case 'software_tutorial': return <BookOpen className="w-4 h-4" />;
      case 'technical_skills': return <Zap className="w-4 h-4" />;
      case 'project_management': return <BarChart3 className="w-4 h-4" />;
      case 'innovation_methodology': return <Star className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleStartModule = (moduleId: string, moduleTitle: string) => {
    addNotification({
      type: 'info',
      title: 'Starting Training',
      message: `Beginning ${moduleTitle} module...`
    });
  };

  const handleViewCertificate = (moduleId: string, moduleTitle: string) => {
    addNotification({
      type: 'success',
      title: 'Certificate Available',
      message: `Certificate for ${moduleTitle} is ready for download`
    });
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <GraduationCap className="w-8 h-8 mr-3 text-purple-600" />
              Training Center
            </h1>
            <p className="text-gray-600">
              Develop your skills and earn certifications
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline">
              <Trophy className="w-4 h-4 mr-2" />
              My Certificates
            </Button>
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              Progress Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trainingStats.map((stat, index) => (
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
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search training modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Filter by category"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Filter by difficulty"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Training Modules Grid */}
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
            ) : modules?.data?.data && modules.data.data.length > 0 ? (
              modules.data.data
                .filter((module: any) => {
                  const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      module.description?.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
                  const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
                  return matchesSearch && matchesCategory && matchesDifficulty;
                })
                .map((module: any) => (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                              {getCategoryIcon(module.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                              <CardDescription>
                                {module.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={getDifficultyColor(module.difficulty)}
                          >
                            {module.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress bar for enrolled modules */}
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>75%</span> {/* This would come from progress data */}
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {module.estimatedDuration || 30} minutes
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {Math.floor(Math.random() * 100) + 50} students enrolled
                          </div>

                          {module.prerequisites && module.prerequisites.length > 0 && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Prerequisites:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {module.prerequisites.slice(0, 2).map((prereq: any, index: any) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {prereq}
                                  </Badge>
                                ))}
                                {module.prerequisites.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{module.prerequisites.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2">
                            <Button 
                              onClick={() => handleStartModule(module.id, module.title)}
                              size="sm"
                              className="flex-1 mr-2"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Continue
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewCertificate(module.id, module.title)}
                            >
                              <Award className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Modules Found</h3>
                <p className="text-gray-600 mb-4">No modules match your current filters.</p>
                <Button onClick={() => {setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty('all');}}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Sidebar>
  );
}

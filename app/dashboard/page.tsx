'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Lightbulb, 
  Wrench, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Plus,
  ChevronRight,
  Activity,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth, useProjects, useEquipment, useProfile, useDashboardStats } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects({ limit: 5 });
  const { data: equipment, isLoading: equipmentLoading } = useEquipment({ limit: 5 });
  const { data: profile } = useProfile();
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { addNotification, openModal } = useUIStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    addNotification({
      type: 'success',
      title: 'Logged out',
      message: 'See you next time!'
    });
    router.push('/');
  };

  const stats = [
    {
      title: 'Active Projects',
      value: dashboardStats?.activeProjects || 0,
      icon: Lightbulb,
      color: 'from-blue-500 to-blue-600',
      change: `+${Math.round((dashboardStats?.projectsThisMonth || 0) / Math.max(dashboardStats?.activeProjects || 1, 1) * 100)}%`,
      isLoading: statsLoading
    },
    {
      title: 'Equipment Reserved',
      value: dashboardStats?.equipmentReserved || 0,
      icon: Wrench,
      color: 'from-green-500 to-green-600',
      change: `${dashboardStats?.equipmentUtilization || 0}% utilized`,
      isLoading: statsLoading
    },
    {
      title: 'Team Members',
      value: dashboardStats?.teamMembers || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: `${dashboardStats?.totalUsers || 0} total users`,
      isLoading: statsLoading
    },
    {
      title: 'Learning Hours',
      value: '24', // This will need a proper training hours calculation later
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      change: '+15%',
      isLoading: false
    }
  ];

  const quickActions = [
    {
      title: 'Start New Project',
      description: 'Begin your innovation journey',
      icon: Plus,
      action: () => openModal('createProject'),
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Reserve Equipment',
      description: 'Book lab equipment',
      icon: Calendar,
      action: () => openModal('equipmentReservation'),
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Browse Knowledge',
      description: 'Explore learning resources',
      icon: BookOpen,
      action: () => router.push('/knowledge'),
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-gray-600">
                Ready to continue your innovation journey? Here's what's happening in your lab.
              </p>
            </div>
            {(statsLoading || projectsLoading || equipmentLoading) && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Updating...</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    {stat.isLoading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    )}
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={action.action}
                      className="w-full justify-start h-auto p-4 border border-gray-200 hover:border-gray-300"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {action.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {action.description}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your latest innovation projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : projects?.data && projects.data.length > 0 ? (
                  <div className="space-y-4">
                    {projects.data.slice(0, 3).map((project: any) => (
                      <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">
                          {project.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {project.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Projects
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No projects yet</p>
                    <Button 
                      onClick={() => openModal('createProject')}
                      size="sm"
                    >
                      Start Your First Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Equipment Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status</CardTitle>
                <CardDescription>
                  Lab equipment availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                {equipmentLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : equipment?.data && equipment.data.length > 0 ? (
                  <div className="space-y-4">
                    {equipment.data.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.location}</p>
                        </div>
                        <Badge 
                          variant={item.status === 'available' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Equipment
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No equipment data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Sidebar>
  );
}

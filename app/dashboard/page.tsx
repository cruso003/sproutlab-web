'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Lightbulb, 
  Wrench, 
  TrendingUp, 
  ChevronRight,
  Activity,
  Zap,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useProjects, useEquipment, useDashboardStats } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  // User's personal metrics
  myProjects: number;
  teamsImIn: number;
  myActiveProjects: number;
  collaborationsCount: number;
  
  // Equipment metrics (personal + available)
  equipmentInUse: number;
  availableKits: number;
  totalKits: number;
  
  // Personal score
  innovationScore: number;
  
  // Timestamp
  lastUpdated: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects({ limit: 5 });
  const { data: equipment, isLoading: equipmentLoading } = useEquipment({ limit: 5 });
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { addNotification } = useUIStore();
  const router = useRouter();

  // Type the dashboard stats properly
  const typedStats = dashboardStats as DashboardStats | undefined;

  // Role-based stats configuration
  const getStatsForRole = (userRole: string) => {
    const baseStats = [
      {
        title: 'My Projects',
        value: typedStats?.myProjects || 0,
        icon: Lightbulb,
        color: 'from-blue-500 to-blue-600',
        change: `${typedStats?.myActiveProjects || 0} active`,
        isLoading: statsLoading
      },
      {
        title: 'Equipment Available',
        value: typedStats?.availableKits || 0,
        icon: Wrench,
        color: 'from-green-500 to-green-600',
        change: `${typedStats?.equipmentInUse || 0} in my use`,
        isLoading: statsLoading
      },
      {
        title: 'Team Collaborations',
        value: typedStats?.teamsImIn || 0,
        icon: Users,
        color: 'from-purple-500 to-purple-600',
        change: `${typedStats?.collaborationsCount || 0} total projects`,
        isLoading: statsLoading
      },
      {
        title: 'Innovation Score',
        value: typedStats?.innovationScore || 0,
        icon: TrendingUp,
        color: 'from-emerald-500 to-teal-600',
        change: 'Personal activity score',
        isLoading: statsLoading
      }
    ];

    // Add role-specific stats
    if (userRole === 'admin' || userRole === 'staff') {
      return [
        ...baseStats,
        // Add admin/staff specific metrics here when we create them
        // e.g., system-wide stats, user management metrics, etc.
      ];
    }

    return baseStats;
  };

  const stats = getStatsForRole(user?.role || 'student');

  // Role-based quick actions
  const getQuickActionsForRole = (userRole: string) => {
    const baseActions = [
      {
        title: 'Start Innovation',
        description: 'Transform your idea into breakthrough',
        icon: Zap,
        action: () => router.push('/dashboard/innovation/start'),
        color: 'from-blue-500 to-purple-600'
      },
      {
        title: 'My Innovation Lab',
        description: 'Access projects, kits & resources',
        icon: Wrench,
        action: () => router.push('/dashboard/lab'),
        color: 'from-indigo-500 to-blue-600'
      },
      {
        title: 'Innovation Community',
        description: 'Connect with co-innovators',
        icon: Users,
        action: () => router.push('/dashboard/community'),
        color: 'from-purple-500 to-pink-600'
      },
      {
        title: 'SaharaSprout Pipeline',
        description: 'Join the agri-tech revolution',
        icon: Globe,
        action: () => router.push('/dashboard/business/saharasprout'),
        color: 'from-green-500 to-teal-600'
      }
    ];

    // Add role-specific actions
    if (userRole === 'admin') {
      return [
        ...baseActions,
        {
          title: 'Admin Console',
          description: 'Manage users, projects & system',
          icon: Activity,
          action: () => router.push('/dashboard/admin'),
          color: 'from-red-500 to-orange-600'
        }
      ];
    }

    if (userRole === 'staff') {
      return [
        ...baseActions,
        {
          title: 'Staff Tools',
          description: 'Equipment, approvals & support',
          icon: Activity,
          action: () => router.push('/dashboard/staff'),
          color: 'from-orange-500 to-yellow-600'
        }
      ];
    }

    return baseActions;
  };

  const quickActions = getQuickActionsForRole(user?.role || 'student');

  return (
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
                Welcome back, {user?.firstName}! 🚀
              </h2>
              <p className="text-gray-600">
                Ready to turn your ideas into breakthrough innovations? Let's explore the billion-dollar opportunities waiting to be discovered.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  🎯 IUEA Innovation Hub
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  🌱 SaharaSprout Partnership
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  🤖 AI-Powered Innovation
                </Badge>
              </div>
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
          {/* Innovation Catalyst */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  Innovation Catalyst
                </CardTitle>
                <CardDescription>
                  Start your breakthrough journey
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
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {action.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {action.description}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </Button>
                  </motion.div>
                ))}
                
                {/* AI Innovation Teaser */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">AI-Powered Innovation</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Transform rough ideas into $4.6B market opportunities with our breakthrough AI system
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => router.push('/dashboard/innovation/start')}
                  >
                    Try Innovation Catalyst
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Innovation Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Innovation Pipeline</CardTitle>
                <CardDescription>
                  Your breakthrough projects in development
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
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.type || 'Innovation'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push('/dashboard/lab/projects')}
                    >
                      <span className="flex items-center">
                        View All Projects
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No innovations yet</p>
                    <Button 
                      onClick={() => router.push('/dashboard/innovation/start')}
                      size="sm"
                    >
                      Start Your First Innovation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Lab Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Lab Resources</CardTitle>
                <CardDescription>
                  Tools available for your innovations
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
                ) : equipment && Array.isArray(equipment) && equipment.length > 0 ? (
                  <div className="space-y-4">
                    {equipment.slice(0, 3).map((item: any) => (
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push('/dashboard/lab/schedule')}
                    >
                      <span className="flex items-center">
                        Book Lab Time
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No equipment data available</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/dashboard/lab/fabrication')}
                    >
                      View Lab Resources
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
  );
}

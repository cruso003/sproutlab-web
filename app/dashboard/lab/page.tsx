'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Zap, 
  Cpu, 
  Wrench, 
  BookOpen,
  Calendar,
  Users,
  Target,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Activity,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function InnovationLabPage() {
  const [activeProjects, setActiveProjects] = useState(3);

  const labOverview = [
    { label: 'Active Projects', value: '3', icon: Zap, color: 'text-blue-400' },
    { label: 'Lab Hours This Week', value: '12', icon: Clock, color: 'text-green-400' },
    { label: 'Components Used', value: '24', icon: Cpu, color: 'text-purple-400' },
    { label: 'Skills Learned', value: '7', icon: BookOpen, color: 'text-yellow-400' }
  ];

  const quickActions = [
    {
      title: 'View Active Projects',
      description: 'Manage your innovation projects',
      icon: Zap,
      href: '/dashboard/projects',
      color: 'from-blue-500 to-purple-600',
      count: '3 active'
    },
    {
      title: 'Assemble IoT Kit',
      description: 'Build custom solutions',
      icon: Cpu,
      href: '/dashboard/kits',
      color: 'from-green-500 to-blue-600',
      count: 'New components'
    },
    {
      title: 'Book Fabrication Time',
      description: 'Reserve lab equipment',
      icon: Wrench,
      href: '/dashboard/fabrication',
      color: 'from-orange-500 to-red-600',
      count: '6 slots available'
    },
    {
      title: 'Continue Learning',
      description: 'Skill development tracks',
      icon: BookOpen,
      href: '/dashboard/learning',
      color: 'from-purple-500 to-pink-600',
      count: '65% complete'
    },
    {
      title: 'Schedule Lab Time',
      description: 'Reserve workspace',
      icon: Calendar,
      href: '/dashboard/schedule',
      color: 'from-indigo-500 to-purple-600',
      count: 'Today available'
    }
  ];

  const recentActivity = [
    {
      type: 'project',
      title: 'Updated Smart Irrigation System',
      time: '2 hours ago',
      icon: Zap
    },
    {
      type: 'learning',
      title: 'Completed IoT Sensors Module',
      time: '1 day ago',
      icon: BookOpen
    },
    {
      type: 'fabrication',
      title: '3D Printed Sensor Housing',
      time: '2 days ago',
      icon: Wrench
    },
    {
      type: 'kit',
      title: 'Ordered ESP32 Development Board',
      time: '3 days ago',
      icon: Cpu
    }
  ];

  const upcomingDeadlines = [
    {
      project: 'Smart Irrigation System',
      milestone: 'Prototype Testing',
      dueDate: '2025-08-15',
      progress: 75,
      priority: 'high'
    },
    {
      project: 'Environmental Monitor',
      milestone: 'Data Analysis',
      dueDate: '2025-08-20',
      progress: 45,
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <Lightbulb className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">My Innovation Lab</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your personal innovation workspace - manage projects, access resources, and track your learning journey
          </p>
        </motion.div>

        {/* Lab Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {labOverview.map((stat, index) => (
            <Card key={index} className="bg-white/5 border-white/10 group hover:border-purple-400/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Lab Workspace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                        <Badge className="mt-2 bg-purple-500/20 text-purple-300 text-xs">
                          {action.count}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 group-hover:border-purple-400/30 text-white"
                      variant="outline"
                    >
                      Access
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-yellow-400" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="space-y-3 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white text-sm font-medium">{deadline.project}</h4>
                        <p className="text-xs text-gray-400">{deadline.milestone}</p>
                      </div>
                      <Badge className={`text-xs ${getPriorityColor(deadline.priority)} bg-current/20`}>
                        {deadline.priority}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{deadline.progress}%</span>
                      </div>
                      <Progress value={deadline.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-gray-400">Due: {new Date(deadline.dueDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Innovation Lab Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-16"
        >
          <Lightbulb className="w-24 h-24 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Your Personal Innovation Ecosystem
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Everything you need to transform ideas into reality - from AI-powered analysis to fabrication tools and learning resources.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Progress Tracking</h3>
                <p className="text-gray-400 text-sm">Monitor your innovation journey and skill development</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Team Collaboration</h3>
                <p className="text-gray-400 text-sm">Connect and work with fellow innovators</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Achievement System</h3>
                <p className="text-gray-400 text-sm">Earn recognition for your innovation milestones</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Badge className="bg-purple-500/20 text-purple-300 px-4 py-2">
              Your Innovation Command Center
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

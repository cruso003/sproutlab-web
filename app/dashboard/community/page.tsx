'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Award, 
  GraduationCap,
  Search,
  Plus,
  TrendingUp,
  Heart,
  Star,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discover');

  const communityStats = [
    { label: 'Active Innovators', value: '1,247', icon: Users, color: 'text-blue-400' },
    { label: 'Projects Launched', value: '89', icon: Award, color: 'text-green-400' },
    { label: 'Mentorship Hours', value: '2,456', icon: GraduationCap, color: 'text-purple-400' },
    { label: 'Success Stories', value: '34', icon: Star, color: 'text-yellow-400' }
  ];

  const featuredInnovators = [
    {
      name: 'Amara Okonkwo',
      role: 'Agricultural IoT Specialist',
      projects: 3,
      impact: 'High',
      initials: 'AO'
    },
    {
      name: 'Kwame Asante',
      role: 'Healthcare Innovation',
      projects: 2,
      impact: 'Medium',
      initials: 'KA'
    },
    {
      name: 'Fatima Al-Zahra',
      role: 'Environmental Solutions',
      projects: 4,
      impact: 'High',
      initials: 'FA'
    }
  ];

  const recentActivity = [
    {
      type: 'project_launch',
      user: 'Amara O.',
      action: 'launched a new project',
      target: 'Smart Irrigation System',
      time: '2 hours ago'
    },
    {
      type: 'achievement',
      user: 'Kwame A.',
      action: 'earned achievement',
      target: 'Innovation Catalyst',
      time: '4 hours ago'
    },
    {
      type: 'collaboration',
      user: 'Fatima A.',
      action: 'joined team for',
      target: 'Water Quality Monitor',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <Users className="w-12 h-12 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Innovation Community</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with fellow innovators, share knowledge, find collaborators, and celebrate success stories
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {communityStats.map((stat, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white justify-start">
            <UserPlus className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Find Co-Innovators</div>
              <div className="text-xs opacity-80">Discover teammates</div>
            </div>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white justify-start">
            <GraduationCap className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Find Mentors</div>
              <div className="text-xs opacity-80">Get expert guidance</div>
            </div>
          </Button>
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white justify-start">
            <MessageSquare className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Join Discussions</div>
              <div className="text-xs opacity-80">Share knowledge</div>
            </div>
          </Button>
          <Button className="h-16 bg-yellow-600 hover:bg-yellow-700 text-white justify-start">
            <Award className="w-6 h-6 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Success Gallery</div>
              <div className="text-xs opacity-80">See achievements</div>
            </div>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Innovators */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Featured Innovators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredInnovators.map((innovator, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {innovator.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-semibold">{innovator.name}</h3>
                        <p className="text-sm text-gray-400">{innovator.role}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                            {innovator.projects} Projects
                          </Badge>
                          <Badge className={`text-xs ${
                            innovator.impact === 'High' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {innovator.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-indigo-400/50 text-indigo-400 hover:bg-indigo-400/10">
                      Connect
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-sm">
                      <span className="text-white font-medium">{activity.user}</span>
                      <span className="text-gray-400"> {activity.action} </span>
                      <span className="text-indigo-400">{activity.target}</span>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                    {index < recentActivity.length - 1 && (
                      <hr className="border-white/10" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-16"
        >
          <Users className="w-24 h-24 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Vibrant Innovation Community
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Coming soon! Advanced matchmaking, skill-based networking, mentorship programs, and community-driven innovation challenges.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <UserPlus className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Smart Matching</h3>
                <p className="text-gray-400 text-sm">AI-powered team and mentor matching</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Knowledge Sharing</h3>
                <p className="text-gray-400 text-sm">Forums, Q&A, and expert discussions</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Recognition</h3>
                <p className="text-gray-400 text-sm">Achievements and impact tracking</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Badge className="bg-indigo-500/20 text-indigo-300 px-4 py-2">
              Enhanced Community Platform Coming Soon
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

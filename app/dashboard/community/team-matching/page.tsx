'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Award, 
  Star,
  MessageCircle,
  UserPlus,
  Zap,
  Target,
  Clock,
  Code,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TeamMatchingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const availableInnovators = [
    {
      id: 1,
      name: 'Amara Okonkwo',
      role: 'IoT Hardware Developer',
      location: 'Lagos, Nigeria',
      skills: ['Arduino', 'PCB Design', 'Sensors', 'Embedded C'],
      experience: 'Intermediate',
      projects: 3,
      rating: 4.8,
      availability: 'Available',
      bio: 'Passionate about agricultural IoT solutions and sustainable farming technologies.',
      initials: 'AO'
    },
    {
      id: 2,
      name: 'Kwame Asante',
      role: 'Mobile App Developer',
      location: 'Accra, Ghana',
      skills: ['React Native', 'Flutter', 'IoT Integration', 'UI/UX'],
      experience: 'Advanced',
      projects: 5,
      rating: 4.9,
      availability: 'Part-time',
      bio: 'Creating user-friendly interfaces for IoT applications with focus on accessibility.',
      initials: 'KA'
    },
    {
      id: 3,
      name: 'Fatima Al-Zahra',
      role: 'Data Scientist',
      location: 'Cairo, Egypt',
      skills: ['Python', 'Machine Learning', 'Data Analytics', 'IoT Data'],
      experience: 'Advanced',
      projects: 7,
      rating: 4.7,
      availability: 'Available',
      bio: 'Specializing in environmental monitoring and predictive analytics for smart cities.',
      initials: 'FA'
    },
    {
      id: 4,
      name: 'Joseph Mwangi',
      role: 'Mechanical Engineer',
      location: 'Nairobi, Kenya',
      skills: ['3D Design', 'Prototyping', 'Manufacturing', 'CAD'],
      experience: 'Intermediate',
      projects: 2,
      rating: 4.6,
      availability: 'Available',
      bio: 'Focused on creating practical enclosures and mechanical solutions for IoT devices.',
      initials: 'JM'
    }
  ];

  const skillCategories = [
    'Hardware Development',
    'Software Development',
    'Data Science',
    'Mechanical Design',
    'Mobile Development',
    'AI/ML',
    'Business Development',
    'Product Design'
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-500/20 text-green-300';
      case 'Part-time': return 'bg-yellow-500/20 text-yellow-300';
      case 'Busy': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'Beginner': return 'bg-blue-500/20 text-blue-300';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'Advanced': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <UserPlus className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Find Co-Innovators</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover talented teammates with complementary skills for your innovation projects
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by skills, location, or expertise..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Skill Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {skillCategories.slice(0, 6).map((skill, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="border-blue-400/50 text-blue-300 hover:bg-blue-400/10 cursor-pointer transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-gray-400">Available Innovators</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">89</div>
              <div className="text-sm text-gray-400">Successful Matches</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4.8</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">24h</div>
              <div className="text-sm text-gray-400">Avg Response Time</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Innovator Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {availableInnovators.map((innovator, index) => (
            <motion.div
              key={innovator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg">
                        {innovator.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                            {innovator.name}
                          </h3>
                          <p className="text-sm text-gray-400">{innovator.role}</p>
                        </div>
                        <Badge className={getAvailabilityColor(innovator.availability)}>
                          {innovator.availability}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white">{innovator.rating}</span>
                        <span className="text-xs text-gray-400">({innovator.projects} projects)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{innovator.location}</span>
                  </div>
                  
                  <p className="text-sm text-gray-300 line-clamp-2">{innovator.bio}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={getExperienceColor(innovator.experience)}>
                        {innovator.experience}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {innovator.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-500/50 text-gray-300">
                          {skill}
                        </Badge>
                      ))}
                      {innovator.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-300">
                          +{innovator.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center py-16"
        >
          <UserPlus className="w-24 h-24 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Smart Team Matching
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Coming soon! AI-powered team recommendations, skill compatibility analysis, and seamless collaboration tools.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">AI Matching</h3>
                <p className="text-gray-400 text-sm">Smart algorithms for perfect team combinations</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Skill Analysis</h3>
                <p className="text-gray-400 text-sm">Compatibility assessment and gap identification</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Collaboration Tools</h3>
                <p className="text-gray-400 text-sm">Integrated chat and project management</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Badge className="bg-blue-500/20 text-blue-300 px-4 py-2">
              Advanced Matching Algorithm Coming Soon
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Globe, 
  Zap, 
  DollarSign,
  TrendingUp,
  Award,
  ArrowRight,
  Building,
  Users,
  Target,
  BarChart3,
  Rocket,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BusinessCareerPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const businessMetrics = [
    { label: 'Startups Launched', value: '23', icon: Rocket, color: 'text-green-400' },
    { label: 'SaharaSprout Pipeline', value: '8', icon: Globe, color: 'text-blue-400' },
    { label: 'Revenue Generated', value: '$2.4M', icon: DollarSign, color: 'text-yellow-400' },
    { label: 'Career Placements', value: '156', icon: GraduationCap, color: 'text-purple-400' }
  ];

  const careerPaths = [
    {
      id: 'saharasprout',
      title: 'SaharaSprout Pipeline',
      description: 'Fast-track your innovation to commercial success',
      icon: Globe,
      color: 'from-blue-500 to-cyan-600',
      features: ['Market Validation', 'Funding Support', 'Scale-up Mentorship'],
      cta: 'Apply Now'
    },
    {
      id: 'startup',
      title: 'Launch Your Startup',
      description: 'Turn your project into a sustainable business',
      icon: Zap,
      color: 'from-green-500 to-emerald-600',
      features: ['Business Planning', 'Legal Support', 'Investor Network'],
      cta: 'Get Started'
    },
    {
      id: 'marketplace',
      title: 'Marketplace Store',
      description: 'Sell your IoT solutions and components',
      icon: Building,
      color: 'from-purple-500 to-pink-600',
      features: ['Product Listing', 'Order Management', 'Global Reach'],
      cta: 'Setup Store'
    },
    {
      id: 'careers',
      title: 'Career Opportunities',
      description: 'Find exciting roles in the innovation ecosystem',
      icon: GraduationCap,
      color: 'from-orange-500 to-red-600',
      features: ['Job Matching', 'Skill Assessment', 'Interview Prep'],
      cta: 'Explore Jobs'
    }
  ];

  const successStories = [
    {
      company: 'AgriSense IoT',
      founder: 'Amara O.',
      description: 'Smart irrigation systems for smallholder farmers',
      revenue: '$450K ARR',
      employees: 12,
      status: 'Series A'
    },
    {
      company: 'HealthWatch',
      founder: 'Kwame A.',
      description: 'Remote patient monitoring solutions',
      revenue: '$280K ARR',
      employees: 8,
      status: 'Profitable'
    },
    {
      company: 'EcoMonitor',
      founder: 'Fatima A.',
      description: 'Environmental sensing networks',
      revenue: '$320K ARR',
      employees: 10,
      status: 'Scaling'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <Briefcase className="w-12 h-12 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">Business & Career</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your innovations into commercial success and advance your career in the growing IoT ecosystem
          </p>
        </motion.div>

        {/* Business Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {businessMetrics.map((metric, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <metric.icon className={`w-8 h-8 ${metric.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Career Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center">Choose Your Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 hover:border-emerald-400/30 transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${path.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <path.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-center group-hover:text-emerald-400 transition-colors">
                      {path.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 text-center">{path.description}</p>
                    <div className="space-y-2">
                      {path.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          <span className="text-xs text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:bg-emerald-500 transition-colors">
                      {path.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-400/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{story.company}</CardTitle>
                        <p className="text-sm text-emerald-400">Founded by {story.founder}</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300">
                        {story.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300">{story.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{story.revenue}</div>
                        <div className="text-xs text-gray-400">Annual Revenue</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{story.employees}</div>
                        <div className="text-xs text-gray-400">Team Size</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-16"
        >
          <TrendingUp className="w-24 h-24 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Complete Business Ecosystem
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Coming soon! Comprehensive business support, investor connections, market analytics, and career acceleration programs.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Market Analytics</h3>
                <p className="text-gray-400 text-sm">Real-time market insights and competitor analysis</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Investor Network</h3>
                <p className="text-gray-400 text-sm">Direct access to seed and growth investors</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Business Mentorship</h3>
                <p className="text-gray-400 text-sm">Expert guidance from successful entrepreneurs</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Badge className="bg-emerald-500/20 text-emerald-300 px-4 py-2">
              Business Acceleration Platform Coming Soon
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

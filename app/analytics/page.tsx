'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Users,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Target,
  Zap,
  Award,
  BookOpen,
  Wrench,
  Lightbulb,
  LineChart,
  DollarSign
} from 'lucide-react';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedMetric, setSelectedMetric] = useState('all');
  
  const { addNotification } = useUIStore();

  const overviewStats = [
    {
      title: 'Lab Utilization',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      description: 'Average daily usage'
    },
    {
      title: 'Project Completion',
      value: '94%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-green-600',
      description: 'Success rate this month'
    },
    {
      title: 'Training Hours',
      value: '1,247',
      change: '-3.4%',
      trend: 'down',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      description: 'Total this month'
    },
    {
      title: 'Innovation Score',
      value: '9.2/10',
      change: '+0.8',
      trend: 'up',
      icon: Lightbulb,
      color: 'from-orange-500 to-orange-600',
      description: 'Community rating'
    }
  ];

  const equipmentUsage = [
    { name: '3D Printers', usage: 92, hours: 847, trend: 'up' },
    { name: 'Laser Cutters', usage: 78, hours: 543, trend: 'up' },
    { name: 'Arduino Kits', usage: 85, hours: 412, trend: 'down' },
    { name: 'Soldering Stations', usage: 65, hours: 298, trend: 'up' },
    { name: 'Oscilloscopes', usage: 45, hours: 156, trend: 'down' }
  ];

  const userActivity = [
    { department: 'Computer Science', users: 342, active: 287, engagement: 84 },
    { department: 'Electrical Engineering', users: 198, active: 165, engagement: 83 },
    { department: 'Mechanical Engineering', users: 234, active: 189, engagement: 81 },
    { department: 'Civil Engineering', users: 156, active: 123, engagement: 79 },
    { department: 'Other', users: 89, active: 67, engagement: 75 }
  ];

  const projectStats = [
    { status: 'Completed', count: 145, percentage: 48 },
    { status: 'In Progress', count: 87, percentage: 29 },
    { status: 'Planning', count: 43, percentage: 14 },
    { status: 'On Hold', count: 27, percentage: 9 }
  ];

  const periods = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-year', label: 'Last Year' }
  ];

  const metrics = [
    { value: 'all', label: 'All Metrics' },
    { value: 'usage', label: 'Equipment Usage' },
    { value: 'projects', label: 'Project Analytics' },
    { value: 'training', label: 'Training Progress' },
    { value: 'community', label: 'Community Engagement' }
  ];

  const handleExportReport = () => {
    addNotification({
      type: 'success',
      title: 'Report Generated',
      message: 'Analytics report has been downloaded'
    });
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'bg-green-500';
    if (usage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getWidthClass = (percentage: number) => {
    if (percentage >= 90) return 'w-full';
    if (percentage >= 80) return 'w-5/6';
    if (percentage >= 70) return 'w-4/5';
    if (percentage >= 60) return 'w-3/5';
    if (percentage >= 50) return 'w-1/2';
    if (percentage >= 40) return 'w-2/5';
    if (percentage >= 30) return 'w-1/3';
    if (percentage >= 20) return 'w-1/5';
    if (percentage >= 10) return 'w-1/6';
    return 'w-1/12';
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'text-green-600';
    if (engagement >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
              Analytics & Reports
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into lab usage, projects, and community engagement
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Trends
            </Button>
            <Button onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select time period"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select metric type"
            >
              {metrics.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {overviewStats.map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
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

        {/* Equipment Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Equipment Usage
              </CardTitle>
              <CardDescription>
                Utilization rates for lab equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipmentUsage.map((equipment, index) => (
                  <div key={equipment.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{equipment.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {equipment.hours}h
                        </span>
                        <Badge 
                          variant="outline" 
                          className={equipment.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                        >
                          {equipment.trend === 'up' ? '↗' : '↘'} {equipment.usage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getUsageColor(equipment.usage)} ${getWidthClass(equipment.usage)}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Activity by Department */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Activity by Department
              </CardTitle>
              <CardDescription>
                Active users and engagement rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivity.map((dept, index) => (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.department}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {dept.active}/{dept.users}
                        </span>
                        <span className={`text-sm font-medium ${getEngagementColor(dept.engagement)}`}>
                          {dept.engagement}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-indigo-500 ${getWidthClass(dept.engagement)}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Project Status Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Project Status Distribution
              </CardTitle>
              <CardDescription>
                Current status of all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {projectStats.map((stat, index) => (
                  <div key={stat.status} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.count}
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {stat.status}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-indigo-500 ${getWidthClass(stat.percentage)}`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stat.percentage}% of total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Peak Usage</span>
                  </div>
                  <p className="text-sm text-green-700">
                    3D printer usage increased 23% this month
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Award className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Achievement</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Highest project completion rate this quarter
                  </p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-800">Opportunity</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Evening hours show lower utilization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Analytics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="w-5 h-5 mr-2" />
                Detailed Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive breakdown of lab metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Metric</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Current</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Previous</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Change</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Target</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Daily Active Users</td>
                      <td className="py-3 px-4">847</td>
                      <td className="py-3 px-4">781</td>
                      <td className="py-3 px-4 text-green-600">+8.4%</td>
                      <td className="py-3 px-4">850</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">On Track</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Equipment Utilization</td>
                      <td className="py-3 px-4">87%</td>
                      <td className="py-3 px-4">82%</td>
                      <td className="py-3 px-4 text-green-600">+5.2%</td>
                      <td className="py-3 px-4">85%</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Exceeded</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Project Success Rate</td>
                      <td className="py-3 px-4">94%</td>
                      <td className="py-3 px-4">92%</td>
                      <td className="py-3 px-4 text-green-600">+2.1%</td>
                      <td className="py-3 px-4">90%</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Exceeded</Badge>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">Training Completion</td>
                      <td className="py-3 px-4">76%</td>
                      <td className="py-3 px-4">79%</td>
                      <td className="py-3 px-4 text-red-600">-3.4%</td>
                      <td className="py-3 px-4">80%</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-orange-100 text-orange-800">Below Target</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Community Engagement</td>
                      <td className="py-3 px-4">8.7/10</td>
                      <td className="py-3 px-4">8.3/10</td>
                      <td className="py-3 px-4 text-green-600">+0.4</td>
                      <td className="py-3 px-4">8.5/10</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Exceeded</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Sidebar>
  );
}

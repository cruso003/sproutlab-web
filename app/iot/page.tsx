'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Cpu, 
  Search, 
  Filter,
  Wifi,
  Globe,
  Activity,
  Shield,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  QrCode,
  Battery,
  Thermometer,
  Radio,
  Camera,
  Lightbulb,
  Calendar
} from 'lucide-react';
import { useIoTKits, useAuth } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function IoTPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { user } = useAuth();
  const { data: kits, isLoading } = useIoTKits();
  const { addNotification, openModal } = useUIStore();

  const iotStats = [
    {
      title: 'Total Kits',
      value: kits?.data?.data?.length || 0,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      trend: '+8 new kits'
    },
    {
      title: 'Available Now',
      value: kits?.data?.data?.filter((k: any) => k.status === 'available').length || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: '92% availability'
    },
    {
      title: 'Checked Out',
      value: kits?.data?.data?.filter((k: any) => k.status === 'checked_out').length || 0,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      trend: 'High demand'
    },
    {
      title: 'Active Projects',
      value: '12',
      icon: Lightbulb,
      color: 'from-purple-500 to-purple-600',
      trend: 'Using IoT'
    }
  ];

  const kitCategories = [
    { value: 'all', label: 'All Kits' },
    { value: 'development_board', label: 'Development Boards' },
    { value: 'sensor_kit', label: 'Sensor Kits' },
    { value: 'communication_module', label: 'Communication' },
    { value: 'actuator_kit', label: 'Actuators' },
    { value: 'complete_project', label: 'Complete Projects' },
    { value: 'educational_kit', label: 'Educational Kits' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'checked_out': return <Activity className="w-4 h-4" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      case 'damaged': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'checked_out': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development_board': return '🔲';
      case 'sensor_kit': return '📡';
      case 'communication_module': return '📶';
      case 'actuator_kit': return '⚙️';
      case 'complete_project': return '📦';
      case 'educational_kit': return '🎓';
      default: return '🔧';
    }
  };

  const handleCheckoutKit = (kitId: string, kitName: string) => {
    addNotification({
      type: 'info',
      title: 'Kit Checkout',
      message: `Starting checkout for ${kitName}...`
    });
  };

  const handleReturnKit = (kitId: string, kitName: string) => {
    addNotification({
      type: 'success',
      title: 'Kit Return',
      message: `${kitName} has been returned successfully`
    });
  };

  const handleReportIssue = (kitId: string, kitName: string) => {
    addNotification({
      type: 'warning',
      title: 'Issue Reported',
      message: `Issue reported for ${kitName}. Maintenance team notified.`
    });
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-cyan-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Cpu className="w-8 h-8 mr-3 text-cyan-600" />
              IoT Ecosystem
            </h1>
            <p className="text-gray-600">
              Explore and checkout IoT development kits for your projects
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Network Status
            </Button>
            <Button>
              <QrCode className="w-4 h-4 mr-2" />
              Quick Checkout
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
          {iotStats.map((stat, index) => (
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
              placeholder="Search IoT kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Filter by category"
            >
              {kitCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            {['all', 'available', 'checked_out', 'maintenance'].map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
              >
                {filter.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Kits Grid */}
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
            ) : kits?.data?.data && kits.data.data.length > 0 ? (
              kits.data.data
                .filter((kit: any) => {
                  const matchesSearch = kit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      kit.description?.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesFilter = selectedFilter === 'all' || kit.status === selectedFilter;
                  const matchesCategory = selectedCategory === 'all' || kit.category === selectedCategory;
                  return matchesSearch && matchesFilter && matchesCategory;
                })
                .map((kit: any) => (
                  <motion.div
                    key={kit.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getCategoryIcon(kit.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{kit.name}</CardTitle>
                              <CardDescription>
                                {kit.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(kit.status)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(kit.status)}
                              {kit.status.replace('_', ' ')}
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {kit.kitNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <QrCode className="w-4 h-4 mr-2" />
                              Kit #{kit.kitNumber}
                            </div>
                          )}

                          <div className="flex items-center text-sm text-gray-600">
                            <Package className="w-4 h-4 mr-2" />
                            {kit.category?.replace('_', ' ')} Category
                          </div>

                          {kit.currentBorrower && (
                            <div className="flex items-center text-sm text-orange-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Due: {new Date(kit.dueDate).toLocaleDateString()}
                            </div>
                          )}

                          {kit.specifications && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Includes:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.keys(kit.specifications).slice(0, 3).map((spec: any, index: any) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {Object.keys(kit.specifications).length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{Object.keys(kit.specifications).length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2">
                            {kit.status === 'available' ? (
                              <Button 
                                onClick={() => handleCheckoutKit(kit.id, kit.name)}
                                size="sm"
                                className="flex-1 mr-2"
                              >
                                <Package className="w-4 h-4 mr-1" />
                                Checkout
                              </Button>
                            ) : kit.status === 'checked_out' && kit.currentBorrower === user?.id ? (
                              <Button 
                                onClick={() => handleReturnKit(kit.id, kit.name)}
                                size="sm"
                                variant="outline"
                                className="flex-1 mr-2"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Return
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="flex-1 mr-2" disabled>
                                {kit.status === 'checked_out' && 'Checked Out'}
                                {kit.status === 'maintenance' && 'In Maintenance'}
                                {kit.status === 'damaged' && 'Damaged'}
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReportIssue(kit.id, kit.name)}
                            >
                              <AlertCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Cpu className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No IoT Kits Found</h3>
                <p className="text-gray-600 mb-4">No kits match your current filters.</p>
                <Button onClick={() => {setSearchQuery(''); setSelectedFilter('all'); setSelectedCategory('all');}}>
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

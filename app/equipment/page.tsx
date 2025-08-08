'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Wrench, 
  Search, 
  Filter,
  Calendar,
  Settings,
  Activity,
  Database,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  BookOpen,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useEquipment, useAuth } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  const { user } = useAuth();
  const { data: equipment, isLoading } = useEquipment();
  const { addNotification, openModal } = useUIStore();

  const equipmentStats = [
    {
      title: 'Total Equipment',
      value: equipment?.data?.length || 0,
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      trend: '+3 new'
    },
    {
      title: 'Available Now',
      value: equipment?.data?.filter(e => e.status === 'available').length || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: '85% uptime'
    },
    {
      title: 'In Use',
      value: equipment?.data?.filter(e => e.status === 'in_use').length || 0,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      trend: 'Peak usage'
    },
    {
      title: 'Maintenance',
      value: equipment?.data?.filter(e => e.status === 'maintenance').length || 0,
      icon: Settings,
      color: 'from-purple-500 to-purple-600',
      trend: 'Scheduled'
    }
  ];

  const equipmentTypes = [
    { value: 'all', label: 'All Equipment' },
    { value: 'printer_3d', label: '3D Printers' },
    { value: 'laser_cutter', label: 'Laser Cutters' },
    { value: 'pcb_mill', label: 'PCB Mills' },
    { value: 'soldering_station', label: 'Soldering Stations' },
    { value: 'oscilloscope', label: 'Oscilloscopes' },
    { value: 'multimeter', label: 'Multimeters' },
    { value: 'power_supply', label: 'Power Supplies' },
    { value: 'function_generator', label: 'Function Generators' },
    { value: 'pick_place', label: 'Pick & Place' },
    { value: 'reflow_oven', label: 'Reflow Ovens' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'in_use': return <Activity className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'damaged': return <AlertCircle className="w-4 h-4" />;
      case 'retired': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'printer_3d': return '🖨️';
      case 'laser_cutter': return '⚡';
      case 'pcb_mill': return '🔌';
      case 'soldering_station': return '🔧';
      case 'oscilloscope': return '📊';
      case 'multimeter': return '📏';
      case 'power_supply': return '🔋';
      case 'function_generator': return '📡';
      case 'pick_place': return '🤖';
      case 'reflow_oven': return '🔥';
      default: return '⚙️';
    }
  };

  const handleReserveEquipment = (equipmentId: string, equipmentName: string) => {
    openModal('equipmentReservation');
    addNotification({
      type: 'info',
      title: 'Equipment Reservation',
      message: `Starting reservation for ${equipmentName}...`
    });
  };

  const handleMaintenanceRequest = (equipmentId: string, equipmentName: string) => {
    addNotification({
      type: 'success',
      title: 'Maintenance Request',
      message: `Maintenance request submitted for ${equipmentName}`
    });
  };

  return (
    <Sidebar>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-green-50 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Wrench className="w-8 h-8 mr-3 text-green-600" />
              Equipment Bay
            </h1>
            <p className="text-gray-600">
              Manage and reserve lab equipment for your projects
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              Equipment Manual
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
          {equipmentStats.map((stat, index) => (
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
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by equipment type"
            >
              {equipmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            {['all', 'available', 'in_use', 'maintenance', 'damaged'].map((filter) => (
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

        {/* Equipment Grid */}
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
            ) : equipment?.data && equipment.data.length > 0 ? (
              equipment.data
                .filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
                  const matchesType = selectedType === 'all' || item.type === selectedType;
                  return matchesSearch && matchesFilter && matchesType;
                })
                .map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription className="capitalize">
                                {item.type.replace('_', ' ')}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(item.status)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(item.status)}
                              {item.status.replace('_', ' ')}
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {item.location}
                          </div>

                          {item.requiresTraining && (
                            <div className="flex items-center text-sm text-orange-600">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Training Required
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2">
                            {item.status === 'available' ? (
                              <Button 
                                onClick={() => handleReserveEquipment(item.id, item.name)}
                                size="sm"
                                className="flex-1 mr-2"
                              >
                                <Calendar className="w-4 h-4 mr-1" />
                                Reserve
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="flex-1 mr-2" disabled>
                                {item.status === 'in_use' && 'In Use'}
                                {item.status === 'maintenance' && 'In Maintenance'}
                                {item.status === 'damaged' && 'Out of Order'}
                                {item.status === 'retired' && 'Retired'}
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMaintenanceRequest(item.id, item.name)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Equipment Found</h3>
                <p className="text-gray-600 mb-4">No equipment matches your current filters.</p>
                <Button onClick={() => {setSearchQuery(''); setSelectedFilter('all'); setSelectedType('all');}}>
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

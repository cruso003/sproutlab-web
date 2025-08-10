'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  Users, 
  Zap, 
  Settings,
  Printer,
  Scissors,
  Hammer,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FabricationLabPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const equipment = [
    {
      id: '3d-printer',
      name: '3D Printer (Ultimaker S3)',
      status: 'available',
      description: 'High-precision 3D printing for prototyping',
      icon: Printer,
      color: 'text-blue-400'
    },
    {
      id: 'laser-cutter',
      name: 'Laser Cutter',
      status: 'in-use',
      description: 'Precision cutting for enclosures and panels',
      icon: Scissors,
      color: 'text-red-400'
    },
    {
      id: 'soldering-station',
      name: 'Soldering Stations',
      status: 'available',
      description: 'Professional soldering equipment',
      icon: Zap,
      color: 'text-yellow-400'
    },
    {
      id: 'assembly-tools',
      name: 'Assembly Tools',
      status: 'available',
      description: 'Hand tools and precision instruments',
      icon: Hammer,
      color: 'text-green-400'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-300';
      case 'in-use': return 'bg-red-500/20 text-red-300';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <Wrench className="w-12 h-12 text-orange-400" />
            <h1 className="text-4xl font-bold text-white">Fabrication Lab</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional fabrication equipment and workspace for prototyping and manufacturing your IoT innovations
          </p>
        </motion.div>

        {/* Lab Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-sm text-gray-400">Available</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-sm text-gray-400">In Use</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-400">Hours Avg</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Equipment Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {equipment.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-orange-400/30 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                  <Badge className={`${getStatusColor(item.status)} capitalize`}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-16"
        >
          <Wrench className="w-24 h-24 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Professional Fabrication Workspace
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Coming soon! Equipment booking, project queue management, safety training, and real-time lab monitoring.
          </p>
          
          {/* Feature Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Equipment Booking</h3>
                <p className="text-gray-400 text-sm">Reserve equipment slots for your projects</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Eye className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Live Monitoring</h3>
                <p className="text-gray-400 text-sm">Real-time equipment status and usage</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Safety Training</h3>
                <p className="text-gray-400 text-sm">Required certifications and protocols</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Badge className="bg-orange-500/20 text-orange-300 px-4 py-2">
              Fabrication Management System Coming Soon
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

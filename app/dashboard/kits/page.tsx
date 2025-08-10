'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Search, 
  Filter, 
  ShoppingCart, 
  Zap, 
  Wifi, 
  Thermometer,
  Camera,
  Mic,
  Battery,
  ArrowRight,
  Plus,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SmartKitAssemblyPage() {
  const [searchQuery, setSearchQuery] = useState('');

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
            <Cpu className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Smart Kit Assembly</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Build custom IoT solutions by selecting sensors, microcontrollers, and components for your innovation projects
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search IoT components, sensors, boards..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* Coming Soon Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <Cpu className="w-24 h-24 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Smart Kit Assembly Hub
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Coming soon! This is where you'll be able to browse, select, and assemble custom IoT kits for your innovation projects.
          </p>
          
          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Microcontrollers</h3>
                <p className="text-gray-400 text-sm">Arduino, Raspberry Pi, ESP32, and more</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Thermometer className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Sensors & Modules</h3>
                <p className="text-gray-400 text-sm">Temperature, humidity, motion, and environmental sensors</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Wifi className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Connectivity</h3>
                <p className="text-gray-400 text-sm">WiFi, Bluetooth, LoRa, and cellular modules</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Badge className="bg-blue-500/20 text-blue-300 px-4 py-2">
              Component Catalog & Assembly Tools Coming Soon
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Timer,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function BookLabTimePage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const upcomingBookings = [
    {
      id: 1,
      title: 'IoT Prototype Session',
      date: '2025-08-12',
      time: '14:00 - 16:00',
      location: 'Fabrication Lab',
      attendees: 3,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Team Collaboration',
      date: '2025-08-15',
      time: '10:00 - 12:00',
      location: 'Innovation Hub',
      attendees: 5,
      status: 'pending'
    }
  ];

  const availableSlots = [
    { time: '09:00 - 11:00', available: true, capacity: 8, booked: 2 },
    { time: '11:00 - 13:00', available: true, capacity: 8, booked: 5 },
    { time: '13:00 - 15:00', available: false, capacity: 8, booked: 8 },
    { time: '15:00 - 17:00', available: true, capacity: 8, booked: 3 },
    { time: '17:00 - 19:00', available: true, capacity: 8, booked: 1 }
  ];

  const labSpaces = [
    {
      name: 'Innovation Hub',
      capacity: 12,
      equipment: ['Whiteboards', 'Projector', 'Collaboration Tools'],
      available: true
    },
    {
      name: 'Fabrication Lab',
      capacity: 8,
      equipment: ['3D Printer', 'Laser Cutter', 'Soldering Stations'],
      available: false
    },
    {
      name: 'Electronics Lab',
      capacity: 6,
      equipment: ['Oscilloscopes', 'Function Generators', 'Component Library'],
      available: true
    },
    {
      name: 'Testing Area',
      capacity: 4,
      equipment: ['Environmental Chamber', 'Network Analyzer', 'Power Supplies'],
      available: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
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
            <Calendar className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Book Lab Time</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Reserve workspace, equipment, and collaboration time for your innovation projects
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <CalendarDays className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-400">This Week</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <Timer className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">12h</div>
              <div className="text-sm text-gray-400">Booked Hours</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <UserCheck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-sm text-gray-400">Team Members</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-sm text-gray-400">Lab Spaces</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Upcoming Bookings</h2>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 hover:border-purple-400/30 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-white">{booking.title}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{booking.attendees} attendees</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lab Spaces */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Available Lab Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labSpaces.map((space, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className={`${space.available ? 'bg-white/5 border-white/10 hover:border-green-400/30' : 'bg-red-500/5 border-red-500/20'} transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-white font-semibold">{space.name}</h3>
                      {space.available ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">Capacity: {space.capacity}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400">Equipment:</span>
                        {space.equipment.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs border-gray-500/50 text-gray-300">
                            {item}
                          </Badge>
                        ))}
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
          transition={{ delay: 0.6 }}
          className="text-center py-16"
        >
          <Calendar className="w-24 h-24 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Smart Lab Scheduling System
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Coming soon! Real-time availability, automated equipment booking, team coordination, and smart conflict resolution.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Real-time Booking</h3>
                <p className="text-gray-400 text-sm">Live equipment status and instant reservations</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Team Coordination</h3>
                <p className="text-gray-400 text-sm">Automatic scheduling for project teams</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Smart Optimization</h3>
                <p className="text-gray-400 text-sm">AI-powered scheduling optimization</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Badge className="bg-purple-500/20 text-purple-300 px-4 py-2">
              Advanced Booking System Coming Soon
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

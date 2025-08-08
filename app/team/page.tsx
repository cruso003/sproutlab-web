'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter,
  Shield,
  Settings,
  Activity,
  Plus,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Key
} from 'lucide-react';
import { useUsers, useAuth } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import Sidebar from '@/components/layout/sidebar';

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  
  const { user } = useAuth();
  const { data: users, isLoading } = useUsers();
  const { addNotification, openModal } = useUIStore();

  const teamStats = [
    {
      title: 'Total Members',
      value: users?.data?.data?.length || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: '+5 this month'
    },
    {
      title: 'Active Students',
      value: users?.data?.data?.filter((u: any) => u.role === 'student').length || 0,
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      trend: '87% active'
    },
    {
      title: 'Staff Members',
      value: users?.data?.data?.filter((u: any) => u.role === 'staff' || u.role === 'admin').length || 0,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      trend: 'Well staffed'
    },
    {
      title: 'Online Now',
      value: Math.floor(Math.random() * 15) + 5,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      trend: 'Peak hours'
    }
  ];

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'student', label: 'Students' },
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Administrators' },
    { value: 'super_admin', label: 'Super Admin' }
  ];

  const disciplines = [
    { value: 'all', label: 'All Disciplines' },
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'electrical_engineering', label: 'Electrical Engineering' },
    { value: 'mechanical_engineering', label: 'Mechanical Engineering' },
    { value: 'civil_engineering', label: 'Civil Engineering' }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4" />;
      case 'admin': return <Key className="w-4 h-4" />;
      case 'staff': return <Briefcase className="w-4 h-4" />;
      case 'student': return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'computer_science': return '💻';
      case 'electrical_engineering': return '⚡';
      case 'mechanical_engineering': return '⚙️';
      case 'civil_engineering': return '🏗️';
      default: return '🎓';
    }
  };

  const handleInviteUser = () => {
    openModal('inviteUser');
    addNotification({
      type: 'info',
      title: 'User Invitation',
      message: 'Opening invitation form...'
    });
  };

  const handleEditUser = (userId: string, userName: string) => {
    addNotification({
      type: 'info',
      title: 'Edit User',
      message: `Opening editor for ${userName}...`
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    addNotification({
      type: 'warning',
      title: 'User Deletion',
      message: `Confirm deletion of ${userName}?`
    });
  };

  const isOnline = () => Math.random() > 0.7; // Simulate online status

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
              <Users className="w-8 h-8 mr-3 text-indigo-600" />
              Team Management
            </h1>
            <p className="text-gray-600">
              Manage users, roles, and permissions
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </Button>
            <Button onClick={handleInviteUser}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
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
          {teamStats.map((stat, index) => (
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
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by role"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by discipline"
            >
              {disciplines.map((discipline) => (
                <option key={discipline.value} value={discipline.value}>
                  {discipline.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Team Members Grid */}
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
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : users?.data?.data && users.data.data.length > 0 ? (
              users.data.data
                .filter((member: any) => {
                  const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
                  const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                                      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      member.username.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesRole = selectedRole === 'all' || member.role === selectedRole;
                  const matchesDiscipline = selectedDiscipline === 'all' || member.discipline === selectedDiscipline;
                  return matchesSearch && matchesRole && matchesDiscipline;
                })
                .map((member: any) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {member.firstName?.[0]}{member.lastName?.[0]}
                              </div>
                              {isOnline() && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {member.firstName} {member.lastName}
                              </CardTitle>
                              <CardDescription>
                                @{member.username}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={getRoleColor(member.role)}
                          >
                            <div className="flex items-center gap-1">
                              {getRoleIcon(member.role)}
                              {member.role}
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {member.email}
                          </div>

                          {member.discipline && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">{getDisciplineIcon(member.discipline)}</span>
                              {member.discipline.replace('_', ' ')}
                            </div>
                          )}

                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            Joined {new Date(member.createdAt).toLocaleDateString()}
                          </div>

                          {member.skills && member.skills.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Skills:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {member.skills.slice(0, 3).map((skill: any, index: any) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {member.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{member.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditUser(member.id, `${member.firstName} ${member.lastName}`)}
                              className="flex-1 mr-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            
                            <Button 
                              size="sm"
                              variant="outline"
                              className="ml-1"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>

                            {(user?.role === 'admin' || user?.role === 'super_admin') && member.role !== 'super_admin' && (
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(member.id, `${member.firstName} ${member.lastName}`)}
                                className="ml-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members Found</h3>
                <p className="text-gray-600 mb-4">No members match your current filters.</p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => {setSearchQuery(''); setSelectedRole('all'); setSelectedDiscipline('all');}}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={handleInviteUser}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite First Member
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Sidebar>
  );
}

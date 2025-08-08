'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Lightbulb,
  Wrench,
  Cpu,
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Zap,
  Database,
  Shield,
  Activity,
  Globe,
  FileText,
  Award,
  Briefcase,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useProjects, useEquipment, useTrainingModules, useProjectStats } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import { useRouter, usePathname } from 'next/navigation';

const quickActions = [
  {
    title: 'Schedule Equipment',
    icon: Calendar,
    href: '/equipment/schedule',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Create Project',
    icon: Lightbulb,
    href: '/projects/create',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Support Ticket',
    icon: MessageSquare,
    href: '/support/create',
    color: 'from-green-500 to-green-600'
  }
];

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, logout } = useAuth();
  const { addNotification } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch real data for badges
  const { data: projectsData } = useProjects();
  const { data: projectStats } = useProjectStats();
  const { data: equipmentData } = useEquipment();
  const { data: trainingData } = useTrainingModules();

  // Calculate dynamic badge counts
  const getProjectsBadge = () => {
    // Use real project stats if available, fallback to counting projects
    if (projectStats?.activeProjects?.count) {
      return projectStats.activeProjects.count > 0 ? projectStats.activeProjects.count.toString() : null;
    }
    if (!projectsData?.data) return null;
    const activeProjects = projectsData.data.filter((p: any) => 
      p.status === 'design' || p.status === 'prototype' || p.status === 'testing'
    );
    return activeProjects?.length > 0 ? activeProjects.length.toString() : null;
  };

  const getEquipmentBadge = () => {
    if (!equipmentData) return null;
    // Handle both array and paginated response
    const equipment = Array.isArray(equipmentData) ? equipmentData : equipmentData.data;
    const maintenanceEquipment = equipment?.filter((e: any) => 
      e.status === 'maintenance' || e.status === 'reserved'
    );
    return maintenanceEquipment?.length > 0 ? maintenanceEquipment.length.toString() : null;
  };

  const getTrainingBadge = () => {
    if (!trainingData?.data) return null;
    // Handle training modules data structure
    const modules = trainingData.data.data || trainingData.data;
    const pendingModules = modules?.filter((t: any) => 
      t.difficulty === 'beginner'
    );
    return pendingModules?.length > 0 ? pendingModules.length.toString() : null;
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      badge: null,
      description: 'Overview & Analytics'
    },
    {
      title: 'Innovation Hub',
      icon: Lightbulb,
      href: '/projects',
      badge: getProjectsBadge(),
      description: 'Project Management',
      submenu: [
        { title: 'All Projects', href: '/projects', icon: Lightbulb },
        { title: 'Active Projects', href: '/projects/active', icon: Zap },
        { title: 'Project Templates', href: '/projects/templates', icon: FileText },
        { title: 'Collaboration', href: '/projects/collaboration', icon: Users }
      ]
    },
    {
      title: 'Equipment Bay',
      icon: Wrench,
      href: '/equipment',
      badge: getEquipmentBadge(),
      description: 'Equipment Management',
      submenu: [
        { title: 'All Equipment', href: '/equipment', icon: Wrench },
        { title: 'Equipment Catalog', href: '/equipment/catalog', icon: Database },
        { title: 'Reservations', href: '/equipment/reservations', icon: Calendar },
        { title: 'Maintenance', href: '/equipment/maintenance', icon: Settings }
      ]
    },
    {
      title: 'IoT Ecosystem',
      icon: Cpu,
      href: '/iot',
      badge: 'NEW',
      description: 'IoT Kit Management',
      submenu: [
        { title: 'All IoT Kits', href: '/iot', icon: Cpu },
        { title: 'Kit Library', href: '/iot/kits', icon: Cpu },
        { title: 'Sensor Network', href: '/iot/sensors', icon: Globe },
        { title: 'Data Streams', href: '/iot/data', icon: Activity }
      ]
    },
    {
      title: 'Knowledge Base',
      icon: BookOpen,
      href: '/knowledge',
      badge: null,
      description: 'Learning Resources',
      submenu: [
        { title: 'All Articles', href: '/knowledge', icon: BookOpen },
        { title: 'Documentation', href: '/knowledge/docs', icon: FileText },
        { title: 'Tutorials', href: '/knowledge/tutorials', icon: GraduationCap },
        { title: 'Community Wiki', href: '/knowledge/wiki', icon: Users }
      ]
    },
    {
      title: 'Training Center',
      icon: GraduationCap,
      href: '/training',
      badge: getTrainingBadge(),
      description: 'Skill Development',
      submenu: [
        { title: 'All Modules', href: '/training', icon: GraduationCap },
        { title: 'Training Modules', href: '/training/modules', icon: BookOpen },
        { title: 'Certifications', href: '/training/certifications', icon: Award },
        { title: 'Safety Training', href: '/training/safety', icon: Shield }
      ]
    },
    {
      title: 'Team Management',
      icon: Users,
      href: '/team',
      badge: null,
      description: 'User & Role Management',
      submenu: [
        { title: 'All Members', href: '/team', icon: Users },
        { title: 'Team Members', href: '/team/members', icon: Users },
        { title: 'Access Control', href: '/team/access', icon: Shield },
        { title: 'Role Management', href: '/team/roles', icon: Settings }
      ]
    },
    {
      title: 'Community Hub',
      icon: MessageSquare,
      href: '/community',
      badge: null,
      description: 'Community & Discussions'
    },
    {
      title: 'Analytics Hub',
      icon: BarChart3,
      href: '/analytics',
      badge: null,
      description: 'Data & Insights',
      submenu: [
        { title: 'Overview', href: '/analytics', icon: BarChart3 },
        { title: 'Usage Analytics', href: '/analytics/usage', icon: Activity },
        { title: 'Performance Metrics', href: '/analytics/performance', icon: BarChart3 },
        { title: 'Reports', href: '/analytics/reports', icon: FileText }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    addNotification({
      type: 'success',
      title: 'Logged out',
      message: 'Session ended successfully'
    });
    router.push('/');
  };

  const handleNavigation = (href: string, title: string) => {
    router.push(href);
    setIsMobileOpen(false);
    addNotification({
      type: 'info',
      title: 'Navigation',
      message: `Switched to ${title}`
    });
  };

  const filteredNavigation = navigationItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 lg:relative flex-col shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="text-lg font-bold text-slate-900">SproutLab</h1>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-3">
            {filteredNavigation.map((item) => (
              <div key={item.title}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (item.submenu) {
                      setExpandedItem(expandedItem === item.title ? null : item.title);
                    } else {
                      handleNavigation(item.href, item.title);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors ${
                    isItemActive(item.href)
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className={`w-5 h-5 ${isItemActive(item.href) ? 'text-indigo-600' : ''}`} />
                    {!isCollapsed && (
                      <div className="ml-3">
                        <div className="flex items-center">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="ml-2 text-xs px-2 py-0.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && item.submenu && (
                    <ChevronRight 
                      className={`w-4 h-4 transition-transform ${
                        expandedItem === item.title ? 'rotate-90' : ''
                      }`} 
                    />
                  )}
                </motion.button>

                {/* Submenu */}
                <AnimatePresence>
                  {!isCollapsed && expandedItem === item.title && item.submenu && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="py-2 space-y-1">
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.title}
                            onClick={() => handleNavigation(subItem.href, subItem.title)}
                            className={`w-full flex items-center p-2 ml-6 text-left rounded-lg transition-colors ${
                              isItemActive(subItem.href)
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4 mr-3" />
                            <span className="text-sm">{subItem.title}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="px-3 pt-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(action.href, action.title)}
                    className={`w-full flex items-center p-3 text-left rounded-lg bg-gradient-to-r ${action.color} text-white shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <action.icon className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">{action.title}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900">SproutLab</h1>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search navigation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-2 px-3">
                {filteredNavigation.map((item) => (
                  <div key={item.title}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (item.submenu) {
                          setExpandedItem(expandedItem === item.title ? null : item.title);
                        } else {
                          handleNavigation(item.href, item.title);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors ${
                        isItemActive(item.href)
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`w-5 h-5 ${isItemActive(item.href) ? 'text-indigo-600' : ''}`} />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="font-medium">{item.title}</span>
                            {item.badge && (
                              <Badge 
                                variant="secondary" 
                                className="ml-2 text-xs px-2 py-0.5"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      {item.submenu && (
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedItem === item.title ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </motion.button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {expandedItem === item.title && item.submenu && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="py-2 space-y-1">
                            {item.submenu.map((subItem) => (
                              <button
                                key={subItem.title}
                                onClick={() => handleNavigation(subItem.href, subItem.title)}
                                className={`w-full flex items-center p-2 ml-6 text-left rounded-lg transition-colors ${
                                  isItemActive(subItem.href)
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                              >
                                <subItem.icon className="w-4 h-4 mr-3" />
                                <span className="text-sm">{subItem.title}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="px-3 pt-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.title}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(action.href, action.title)}
                      className={`w-full flex items-center p-3 text-left rounded-lg bg-gradient-to-r ${action.color} text-white shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <action.icon className="w-4 h-4 mr-3" />
                      <span className="text-sm font-medium">{action.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="bg-white shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="lg:hidden w-10"></div>
              <h1 className="text-lg font-bold text-slate-900">SproutLab</h1>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

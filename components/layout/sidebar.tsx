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
  Globe,
  Award,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects, useEquipment, useTrainingModules, useProjectStats } from '@/lib/hooks';
import { useUIStore } from '@/lib/stores';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

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

  // Calculate dynamic badge counts
  const getProjectsBadge = () => {
    if (projectStats?.activeProjects?.count) {
      return projectStats.activeProjects.count > 0 ? projectStats.activeProjects.count.toString() : null;
    }
    if (!projectsData?.data) return null;
    const activeProjects = projectsData.data.filter((p: any) => 
      p.status === 'design' || p.status === 'prototype' || p.status === 'testing'
    );
    return activeProjects?.length > 0 ? activeProjects.length.toString() : null;
  };

  const navigationItems = [
    {
      title: 'Innovation Dashboard',
      icon: Home,
      href: '/dashboard',
      badge: null,
      description: 'Opportunities & Pipeline Overview'
    },
    {
      title: 'Start Innovation',
      icon: Zap,
      href: '/dashboard/innovation/start',
      badge: 'HOT',
      description: 'Transform Ideas into Breakthroughs'
    },
    {
      title: 'My Innovation Lab',
      icon: Lightbulb,
      href: '/dashboard/lab',
      badge: getProjectsBadge(),
      description: 'Projects, Resources & Learning',
      submenu: [
        { title: 'Active Projects', href: '/dashboard/projects', icon: Zap },
        { title: 'Smart Kit Assembly', href: '/dashboard/kits', icon: Cpu },
        { title: 'Fabrication Lab', href: '/dashboard/fabrication', icon: Wrench },
        { title: 'Project Learning', href: '/dashboard/learning', icon: BookOpen },
        { title: 'Book Lab Time', href: '/dashboard/schedule', icon: Calendar }
      ]
    },
    {
      title: 'Innovation Community',
      icon: Users,
      href: '/dashboard/community',
      badge: null,
      description: 'Collaborate & Share Success',
      submenu: [
        { title: 'Find Co-Innovators', href: '/dashboard/community/team-matching', icon: Users },
        { title: 'Mentors & Support', href: '/dashboard/community/mentors', icon: GraduationCap },
        { title: 'Success Gallery', href: '/dashboard/community/showcase', icon: Award },
        { title: 'Innovation Forums', href: '/dashboard/community/discussions', icon: MessageSquare }
      ]
    },
    {
      title: 'Business & Career',
      icon: Briefcase,
      href: '/dashboard/business',
      badge: 'OPPORTUNITIES',
      description: 'Commercialization & Professional Growth',
      submenu: [
        { title: 'SaharaSprout Pipeline', href: '/dashboard/business/saharasprout', icon: Globe },
        { title: 'Launch Startup', href: '/dashboard/business/startup', icon: Zap },
        { title: 'Marketplace Store', href: '/dashboard/business/marketplace', icon: Settings },
        { title: 'Career Opportunities', href: '/dashboard/business/careers', icon: GraduationCap },
        { title: 'Revenue Analytics', href: '/dashboard/business/analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'Profile & Settings',
      icon: User,
      href: '/dashboard/settings',
      badge: null,
      description: 'Account & Preferences'
    }
  ];

  const handleLogout = async () => {
    await logout();
    addNotification({
      type: 'success',
      title: 'Logged out',
      message: 'Session ended successfully'
    });
    router.push('/auth/login');
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

  console.log("user", user);

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
              <div>
                <h1 className="text-lg font-bold text-slate-900">SproutLab</h1>
                <p className="text-xs text-slate-500">Innovation Catalyst</p>
              </div>
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
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${isItemActive(item.href) ? 'text-indigo-600' : 'text-slate-500'}`} />
                    {!isCollapsed && (
                      <div>
                        <span className="font-medium">{item.title}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {item.submenu && (
                        <ChevronRight 
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            expandedItem === item.title ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </div>
                  )}
                </motion.button>

                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && expandedItem === item.title && !isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 mt-2 space-y-1"
                    >
                      {item.submenu.map((subItem) => (
                        <motion.button
                          key={subItem.title}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigation(subItem.href, subItem.title)}
                          className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors ${
                            isItemActive(subItem.href)
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <subItem.icon className={`w-4 h-4 ${isItemActive(subItem.href) ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className="text-sm">{subItem.title}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.firstName?.[0] || user?.username?.[0] || '?'}{user?.lastName?.[0] || user?.username?.[1] || ''}
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.username || 'User'}
                  </p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/dashboard/settings')}
                >
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
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-white border-r border-slate-200 z-50 lg:hidden flex flex-col shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">SproutLab</h1>
                  <p className="text-xs text-slate-500">Innovation Catalyst</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
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
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${isItemActive(item.href) ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.submenu && (
                          <ChevronRight 
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              expandedItem === item.title ? 'rotate-90' : ''
                            }`} 
                          />
                        )}
                      </div>
                    </motion.button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.submenu && expandedItem === item.title && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-8 mt-2 space-y-1"
                        >
                          {item.submenu.map((subItem) => (
                            <motion.button
                              key={subItem.title}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleNavigation(subItem.href, subItem.title)}
                              className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors ${
                                isItemActive(subItem.href)
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <subItem.icon className={`w-4 h-4 ${isItemActive(subItem.href) ? 'text-indigo-600' : 'text-slate-400'}`} />
                              <span className="text-sm">{subItem.title}</span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0] || user?.username?.[0] || '?'}{user?.lastName?.[0] || user?.username?.[1] || ''}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.username || 'User'}
                    </p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      router.push('/dashboard/settings');
                      setIsMobileOpen(false);
                    }}
                  >
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileOpen(true)}
                className="bg-white shadow-sm"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
            <div className="hidden lg:block flex-1"></div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  addNotification({
                    type: 'info',
                    title: 'Notifications',
                    message: 'No new notifications'
                  });
                }}
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/dashboard/settings')}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

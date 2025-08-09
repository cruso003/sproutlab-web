'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Shield, 
  Bell,
  Palette,
  Database,
  Key,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();

  const settingsCategories = [
    {
      title: 'Account Settings',
      description: 'Manage your personal information',
      icon: User,
      items: [
        { label: 'Profile Information', value: 'Update name, bio, and avatar' },
        { label: 'Email Address', value: user?.email || 'Not set' },
        { label: 'Discipline', value: user?.discipline || 'Not specified' },
        { label: 'University ID', value: 'IUEA' + (user?.id?.slice(-4) || '****') }
      ]
    },
    {
      title: 'Privacy & Security',
      description: 'Control your account security',
      icon: Shield,
      items: [
        { label: 'Change Password', value: 'Last updated never' },
        { label: 'Two-Factor Auth', value: 'Disabled' },
        { label: 'Active Sessions', value: '1 device' },
        { label: 'Data Export', value: 'Download your data' }
      ]
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      items: [
        { label: 'Project Updates', value: 'Enabled' },
        { label: 'Team Invitations', value: 'Enabled' },
        { label: 'Equipment Alerts', value: 'Enabled' },
        { label: 'Weekly Digest', value: 'Disabled' }
      ]
    },
    {
      title: 'Preferences',
      description: 'Customize your experience',
      icon: Palette,
      items: [
        { label: 'Theme', value: 'Light mode' },
        { label: 'Language', value: 'English' },
        { label: 'Timezone', value: 'EAT (UTC+3)' },
        { label: 'Default View', value: 'Dashboard' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-blue-600" />
            Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account, preferences, and privacy settings
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {user?.role || 'User'}
        </Badge>
      </motion.div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <category.icon className="w-5 h-5 mr-2 text-blue-600" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{item.value}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  Manage {category.title}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Key className="w-5 h-5 mr-2 text-orange-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common settings tasks and account management
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Update Email
            </Button>
            <Button variant="outline" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
            <Button variant="outline" className="flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-gray-500 bg-white p-4 rounded-lg border"
      >
        <p>
          🔒 Your privacy is important to us. All changes are saved securely and you can always revert them.
        </p>
      </motion.div>
    </div>
  );
}

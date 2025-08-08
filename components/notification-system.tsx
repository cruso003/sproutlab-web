'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useUIStore } from '@/lib/stores';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'from-green-500 to-emerald-600 text-white border-green-400',
  error: 'from-red-500 to-rose-600 text-white border-red-400',
  warning: 'from-yellow-500 to-orange-600 text-white border-yellow-400',
  info: 'from-blue-500 to-indigo-600 text-white border-blue-400',
};

export default function NotificationSystem() {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
              className={`
                max-w-sm w-full shadow-lg rounded-lg border-l-4 p-3
                ${colorMap[notification.type]}
              `}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="mt-1 text-xs opacity-75 leading-relaxed">
                      {notification.message}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="inline-flex text-current hover:opacity-75 transition-opacity"
                    title="Close notification"
                    aria-label="Close notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useUIStore } from '@/lib/stores';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColorMap = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export default function ToastContainer() {
  const { notifications, removeNotification } = useUIStore();

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    notifications.forEach((notification) => {
      const timeLeft = 5000 - (Date.now() - notification.timestamp.getTime());
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, timeLeft);
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          const colorClass = colorMap[notification.type];
          const iconColorClass = iconColorMap[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`
                relative overflow-hidden rounded-lg shadow-lg border
                ${colorClass}
                p-4 backdrop-blur-sm
              `}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <Icon className={`w-5 h-5 ${iconColorClass}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight">
                    {notification.title}
                  </h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90">
                    {notification.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/10 transition-colors"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: number;
  type: 'booking' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock notifications - replace with real data
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'booking',
    title: 'New Booking Request',
    message: 'You have a new booking request for Gel Manicure',
    timestamp: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of Ksh 2,500 has been confirmed',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated',
    timestamp: '3 hours ago',
    read: true,
  },
];

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'payment': return <Check className="h-4 w-4 text-green-500" />;
      case 'system': return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-80 z-50"
            >
              <Card className="shadow-xl border-border/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Mark all read
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-80">
                    {notifications.length > 0 ? (
                      <div className="space-y-1">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 border-b border-border/40 cursor-pointer transition-colors hover:bg-muted/50 ${
                              !notification.read ? 'bg-primary/5' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-medium text-sm truncate">{notification.title}</p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notification.timestamp}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No notifications yet</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
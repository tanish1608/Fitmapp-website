import { useState } from 'react';
import type { Notification } from '../types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New client request',
      message: 'John Doe requested to join your training program',
      type: 'info',
      timestamp: '12:00 pm',
      read: false
    },
    {
      id: '2',
      title: 'Missed workout',
      message: 'Sarah Smith missed her scheduled workout',
      type: 'warning',
      timestamp: '11:30 am',
      read: false
    },
    {
      id: '3',
      title: 'Diet plan completed',
      message: 'Mike Johnson completed his 12-week diet plan',
      type: 'success',
      timestamp: '10:15 am',
      read: false
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isOpen,
    unreadCount,
    setIsOpen,
    markAsRead,
    markAllAsRead
  };
}
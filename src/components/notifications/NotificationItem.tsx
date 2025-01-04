import React from 'react';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
        !notification.read ? 'bg-purple-500/5' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${getTypeStyles()}`}></span>
        <span className="font-medium">{notification.title}</span>
        <span className="text-sm text-gray-400 ml-auto">{notification.timestamp}</span>
      </div>
      <p className="text-sm text-gray-400">{notification.message}</p>
    </div>
  );
}
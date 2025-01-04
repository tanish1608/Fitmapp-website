import React from 'react';
import { X } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '../../types/notification';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({ 
  notifications, 
  onClose, 
  onMarkAsRead,
  onMarkAllAsRead 
}: NotificationPanelProps) {
  return (
    <div className="absolute top-12 right-0 w-96 bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={onMarkAllAsRead}
            className="text-sm text-purple-500 hover:text-purple-400"
          >
            Mark all as read
          </button>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
import React from 'react';
import type { AdminNotification } from '../types';
import { UserIcon, CreditCardIcon, DotIcon, SecurityIcon } from './Icons';

interface AdminNotificationPanelProps {
  notifications: AdminNotification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationIcon: React.FC<{ type: AdminNotification['type'] }> = ({ type }) => {
    switch (type) {
        case 'new_user':
            return <UserIcon className="w-5 h-5 text-green-500" />;
        case 'payment_failed':
            return <CreditCardIcon className="w-5 h-5 text-red-500" />;
        case 'password_reset_request':
            return <SecurityIcon className="w-5 h-5 text-blue-500" />;
        default:
            return <UserIcon className="w-5 h-5 text-gray-500" />;
    }
};

const AdminNotificationPanel: React.FC<AdminNotificationPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    return (
        <div className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-secondary">Notifications</h3>
                <button onClick={onMarkAllAsRead} className="text-xs font-medium text-primary hover:underline">
                    Mark all as read
                </button>
            </div>
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <li 
                            key={notification.id} 
                            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
                            className={`p-4 flex items-start space-x-3 transition-colors ${!notification.isRead ? 'bg-primary/5 hover:bg-primary/10 cursor-pointer' : 'bg-white'}`}
                        >
                            <div className="bg-gray-100 p-2 rounded-full mt-1">
                                <NotificationIcon type={notification.type} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{timeSince(notification.timestamp)}</p>
                            </div>
                            {!notification.isRead && <DotIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />}
                        </li>
                    ))
                ) : (
                    <li className="p-8 text-center text-sm text-gray-500">
                        You have no new notifications.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default AdminNotificationPanel;

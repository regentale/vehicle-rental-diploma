import React, { useState } from 'react';
import { FaBell, FaTimes, FaCheck } from 'react-icons/fa';
import { notificationService } from '../services/notification.service';
import { toast } from 'react-hot-toast';

interface NotificationsDropdownProps {
  notifications: any[];
  unreadCount: number;
  onUpdate: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  unreadCount,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setIsMarking(true);
      await notificationService.markAsRead(notificationId);
      onUpdate();
      toast.success('Уведомление прочитано');
    } catch (err) {
      console.error('Failed to mark notification as read', err);
      toast.error('Не удалось отметить уведомление');
    } finally {
      setIsMarking(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'review':
        return '⭐';
      case 'payment':
        return '💳';
      case 'message':
        return '💬';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'review':
        return 'from-amber-500/20 to-orange-500/20';
      case 'payment':
        return 'from-green-500/20 to-emerald-500/20';
      case 'message':
        return 'from-purple-500/20 to-pink-500/20';
      default:
        return 'from-orange-500/20 to-rose-500/20';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-400 hover:text-orange-400 transition-colors duration-300"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-orange-500 to-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-96 glass rounded-2xl shadow-2xl shadow-black/40 z-40 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500/20 to-rose-500/20 border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg">Уведомления</h3>
                {unreadCount > 0 && (
                  <p className="text-gray-400 text-xs mt-1">
                    {unreadCount} новое{unreadCount === 1 ? '' : 'х'}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <FaBell className="text-4xl text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Уведомлений нет</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 transition-all ${
                        notification.isRead
                          ? 'bg-white/2 hover:bg-white/5'
                          : 'bg-gradient-to-r ' +
                            getNotificationColor(notification.type)
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl mt-0.5 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-white font-semibold text-sm truncate">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-gray-600 text-xs mt-2">
                            {new Date(notification.createdAt).toLocaleDateString('ru-RU', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={isMarking}
                            className="flex-shrink-0 text-orange-400 hover:text-orange-300 transition-colors mt-1 disabled:opacity-50"
                          >
                            <FaCheck className="text-sm" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-white/10 px-6 py-3 bg-white/2 text-center">
                <a
                  href="/notifications"
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                >
                  Все уведомления →
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsDropdown;

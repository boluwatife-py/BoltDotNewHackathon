import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const NotificationPermissionBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and permission status
    if ('Notification' in window) {
      const permission = Notification.permission;
      // Show banner if permission is default (not granted or denied)
      setShowBanner(permission === 'default');
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;

    setIsRequesting(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' || permission === 'denied') {
        setShowBanner(false);
      }
    } catch (error) {
    } finally {
      setIsRequesting(false);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    // Store dismissal in localStorage to avoid showing again
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  // Don't show if user previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('notificationBannerDismissed');
    if (dismissed === 'true') {
      setShowBanner(false);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-[var(--primary-light)] border border-[var(--primary-color)] rounded-lg p-3 mx-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Bell className="w-5 h-5 text-[var(--primary-color)]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[var(--text-primary)] text-sm mb-1">
            Enable Notifications
          </h4>
          <p className="text-[var(--text-secondary)] text-xs mb-3">
            Get reminded when it's time to take your supplements and never miss a dose.
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={requestPermission}
              disabled={isRequesting}
              className={`px-3 py-1.5 bg-[var(--primary-color)] text-white rounded-md text-xs font-medium transition-colors ${
                isRequesting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--primary-dark)]'
              }`}
            >
              {isRequesting ? 'Requesting...' : 'Enable Notifications'}
            </button>
            
            <button
              onClick={dismissBanner}
              className="text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
        
        <button
          onClick={dismissBanner}
          className="flex-shrink-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
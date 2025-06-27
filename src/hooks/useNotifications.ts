import { useEffect, useRef } from 'react';
import { type SupplementItem } from '../types/Supplement';

interface NotificationOptions {
  supplements: SupplementItem[];
  onSupplementDue: (supplement: SupplementItem) => void;
  onSupplementMissed: (supplement: SupplementItem) => void;
}

export function useNotifications({ supplements, onSupplementDue, onSupplementMissed }: NotificationOptions) {
  const notificationTimeouts = useRef<Map<number, number>>(new Map());
  const missedTimeouts = useRef<Map<number, number>>(new Map());
  const lastNotifiedTime = useRef<Map<number, string>>(new Map());

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Set up notifications for each supplement
  useEffect(() => {
    // Clear existing timeouts
    notificationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    missedTimeouts.current.forEach(timeout => clearTimeout(timeout));
    notificationTimeouts.current.clear();
    missedTimeouts.current.clear();

    supplements.forEach(supplement => {
      // Skip if supplement is muted or already completed
      if (supplement.muted || supplement.completed) return;

      const [hours, minutes] = supplement.time.split(':').map(Number);
      const now = new Date();
      const supplementTime = new Date();
      supplementTime.setHours(hours, minutes, 0, 0);

      // If the time has passed today, set for tomorrow
      if (supplementTime <= now) {
        supplementTime.setDate(supplementTime.getDate() + 1);
      }

      const timeUntilDue = supplementTime.getTime() - now.getTime();

      // Don't set duplicate notifications for the same supplement at the same time
      if (lastNotifiedTime.current.get(supplement.id) === supplement.time) {
        return;
      }

      // Set timeout for when supplement is due
      const dueTimeout = window.setTimeout(() => {
        if (!supplement.muted && !supplement.completed) {
          onSupplementDue(supplement);
          lastNotifiedTime.current.set(supplement.id, supplement.time);
          
          // Set timeout for missed notification (30 minutes after due time)
          const missedTimeout = window.setTimeout(() => {
            if (!supplement.completed) {
              onSupplementMissed(supplement);
            }
          }, 30 * 60 * 1000); // 30 minutes

          missedTimeouts.current.set(supplement.id, missedTimeout);
        }
      }, timeUntilDue);

      notificationTimeouts.current.set(supplement.id, dueTimeout);
    });

    // Cleanup function
    return () => {
      notificationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      missedTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [supplements, onSupplementDue, onSupplementMissed]);

  // Function to send browser notification
  const sendBrowserNotification = (title: string, body: string, icon?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/vite.svg',
        badge: '/vite.svg',
        tag: 'safedoser-notification',
        requireInteraction: true,
      });
    }
  };

  return { sendBrowserNotification };
}
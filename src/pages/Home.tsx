import React, { useState } from "react";
import GreetingCard from "../components/GreetingCard/GreetingCard";
import NoticeCard from "../components/NoticeCard/NoticeCard";
import TimeLineTime from "../components/UI/TimeLineTime";
import SupplementCard from "../components/SupplementCard/SupplementCard";
import LoadingCard from "../components/UI/LoadingCard";
import AddButton from "../components/NewSupp";
import NotificationToast from "../components/UI/NotificationToast";
import NotificationPermissionBanner from "../components/UI/NotificationPermissionBanner";
import { useSupplements } from "../hooks/useSupplements";
import { useNotifications } from "../hooks/useNotifications";
import { type SupplementItem } from "../types/Supplement";

const getTimeSlot = (hour: number): "morning" | "afternoon" | "evening" => {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

const Home: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { supplements, isLoading, error, handleToggleMute, handleToggleCompleted, refetch } = useSupplements();
  
  // Notification state
  const [notificationToast, setNotificationToast] = useState<{
    isVisible: boolean;
    supplement: SupplementItem | null;
    type: 'due' | 'missed';
  }>({
    isVisible: false,
    supplement: null,
    type: 'due',
  });

  // Handle supplement due notification
  const handleSupplementDue = (supplement: SupplementItem) => {
    // Show toast notification
    setNotificationToast({
      isVisible: true,
      supplement,
      type: 'due',
    });

    // Send browser notification
    sendBrowserNotification(
      'SafeDoser - Time for your supplement!',
      `It's time to take your ${supplement.name}`,
      '/vite.svg'
    );

    // Play notification sound (optional)
    if ('Audio' in window) {
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  // Handle supplement missed notification
  const handleSupplementMissed = (supplement: SupplementItem) => {
    // Show toast notification
    setNotificationToast({
      isVisible: true,
      supplement,
      type: 'missed',
    });

    // Send browser notification
    sendBrowserNotification(
      'SafeDoser - Supplement missed',
      `You missed your ${supplement.name} at ${supplement.time}`,
      '/vite.svg'
    );
  };

  // Use notifications hook
  const { sendBrowserNotification } = useNotifications({
    supplements,
    onSupplementDue: handleSupplementDue,
    onSupplementMissed: handleSupplementMissed,
  });

  // Close notification toast
  const closeNotificationToast = () => {
    setNotificationToast(prev => ({ ...prev, isVisible: false }));
  };

  // Mark supplement as completed from notification
  const markSupplementCompleted = () => {
    if (notificationToast.supplement) {
      handleToggleCompleted(notificationToast.supplement.id);
    }
  };

  const getSupplementsBySlot = (slot: "morning" | "afternoon" | "evening") =>
    supplements.filter((supp) => {
      const hour = parseInt(supp.time.split(":")[0], 10);
      return getTimeSlot(hour) === slot;
    });

  const morningSupplements = getSupplementsBySlot("morning");
  const afternoonSupplements = getSupplementsBySlot("afternoon");
  const eveningSupplements = getSupplementsBySlot("evening");

  if (error) {
    return (
      <div className="bg-[var(--bg-primary)] dark:bg-gray-900 min-h-[calc(100vh-60px)]">
        <h1 className="flex justify-center px-[16px] pt-[var(--lg)] pb-[var(--md)] text-[28px] font-bold text-[var(--text-primary)] dark:text-white bg-[var(--bg-secondary)] dark:bg-gray-800">
          SafeDoser
        </h1>
        
        <div className="p-4">
          <GreetingCard />
          <NoticeCard />
          
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] dark:bg-gray-900 min-h-[calc(100vh-60px)]">
      <h1 className="flex justify-center px-[16px] pt-[var(--lg)] pb-[var(--md)] text-[28px] font-bold text-[var(--text-primary)] dark:text-white bg-[var(--bg-secondary)] dark:bg-gray-800">
        SafeDoser
      </h1>

      <div className="p-4">
        <GreetingCard />
        
        {/* Notification Permission Banner */}
        <NotificationPermissionBanner />
        
        <NoticeCard />

        <div className="px-[var(--lg)] py-[var(--slg)] text-center">
          <h1 className="text-[28px] font-bold text-[var(--text-primary)] dark:text-white tracking-[-0.5px]">
            Today,{" "}
            <span className="block text-[12px] font-medium">{formattedDate}</span>
          </h1>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : (
          <>
            {morningSupplements.length > 0 && (
              <>
                <TimeLineTime time="morning" />
                <SupplementCard
                  supplements={morningSupplements}
                  onToggleMute={handleToggleMute}
                  onToggleCompleted={handleToggleCompleted}
                />
              </>
            )}

            {afternoonSupplements.length > 0 && (
              <>
                <TimeLineTime time="afternoon" />
                <SupplementCard
                  supplements={afternoonSupplements}
                  onToggleMute={handleToggleMute}
                  onToggleCompleted={handleToggleCompleted}
                />
              </>
            )}

            {eveningSupplements.length > 0 && (
              <>
                <TimeLineTime time="evening" />
                <SupplementCard
                  supplements={eveningSupplements}
                  onToggleMute={handleToggleMute}
                  onToggleCompleted={handleToggleCompleted}
                />
              </>
            )}

            {morningSupplements.length === 0 &&
              afternoonSupplements.length === 0 &&
              eveningSupplements.length === 0 && (
                <div className="text-center mt-8 text-[var(--text-light)] dark:text-gray-400 text-base">
                  No supplements scheduled for today. You're all set!
                </div>
              )}
          </>
        )}
      </div>

      {/* Notification Toast */}
      {notificationToast.supplement && (
        <NotificationToast
          isVisible={notificationToast.isVisible}
          onClose={closeNotificationToast}
          supplement={notificationToast.supplement}
          type={notificationToast.type}
          onMarkCompleted={markSupplementCompleted}
        />
      )}

      <AddButton />
    </div>
  );
};

export default Home;
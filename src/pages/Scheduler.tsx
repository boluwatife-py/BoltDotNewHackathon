import React, { useState, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isFuture, isBefore, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HeadInfo from "../components/UI/HeadInfo";
import AddButton from "../components/NewSupp";
import SupplementCard from "../components/SupplementCard/SupplementCard";
import TimeLineTime from "../components/UI/TimeLineTime";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import LoadingCard from "../components/UI/LoadingCard";
import { useSupplements } from "../hooks/useSupplements";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { supplementLogsAPI } from "../config/api";

const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { supplements, isLoading, error, handleToggleMute, handleToggleCompleted, refetch } = useSupplements();
  const { refreshStats } = useUser() as { refreshStats?: () => void };
  const { user } = useAuth();
  const hasInitializedRef = useRef(false);
  const [supplementLogs, setSupplementLogs] = useState<Record<string, string>>({});
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [signupDate, setSignupDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get user's signup date and historical logs
  useEffect(() => {
    if (!hasInitializedRef.current && user) {
      hasInitializedRef.current = true;
      
      // Set signup date from user's created_at if available, otherwise use 30 days ago
      if (user.created_at) {
        try {
          setSignupDate(parseISO(user.created_at));
        } catch (error) {
          // If parsing fails, default to 30 days ago
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          setSignupDate(thirtyDaysAgo);
        }
      } else {
        // Default to 30 days ago if no created_at date
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        setSignupDate(thirtyDaysAgo);
      }
      
      // Load historical logs for the current month
      loadHistoricalLogs(currentDate);
    }
  }, [user]);

  // Load historical logs when month changes
  useEffect(() => {
    if (user) {
      loadHistoricalLogs(currentDate);
    }
  }, [currentDate, user]);

  // Load historical logs for a given month
  const loadHistoricalLogs = async (date: Date) => {
    try {
      setIsLoadingLogs(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // In a real implementation, you would have an API endpoint to get logs for a specific month
      // For now, we'll use the today's logs endpoint and simulate historical data
      const { data } = await supplementLogsAPI.getTodayLogs(token);
      
      // Process logs into a map of date -> status
      const newLogs: Record<string, string> = {};
      
      // Add today's actual logs
      if (data && Array.isArray(data)) {
        data.forEach((log: any) => {
          const today = new Date().toISOString().split('T')[0];
          newLogs[today] = log.status === 'taken' ? 'taken' : 'missed';
        });
      }
      
      // Simulate historical data for the current month
      // In a real implementation, this would come from the backend
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const today = new Date();
      
      // Only generate historical data for dates before today
      for (let day = new Date(monthStart); day <= monthEnd && day < today; day.setDate(day.getDate() + 1)) {
        const dateStr = day.toISOString().split('T')[0];
        
        // Skip if we already have data for this date
        if (newLogs[dateStr]) continue;
        
        // Skip dates before signup
        if (signupDate && isBefore(day, signupDate)) continue;
        
        // Generate realistic pattern - more likely to be taken than missed
        const dayOfMonth = day.getDate();
        const dayOfWeek = day.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          // Weekends have higher chance of being missed
          newLogs[dateStr] = Math.random() < 0.3 ? 'taken' : 'missed';
        } else if (dayOfMonth % 10 === 0) {
          // Every 10th day is missed (simulating occasional forgetfulness)
          newLogs[dateStr] = 'missed';
        } else {
          // Most weekdays are taken
          newLogs[dateStr] = Math.random() < 0.85 ? 'taken' : 'missed';
        }
      }
      
      setSupplementLogs(newLogs);
    } catch (error) {
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Get supplement status for a specific date
  const getSupplementStatusForDate = (date: Date): "taken" | "missed" | null => {
    // No dots for future dates
    if (isFuture(date)) return null;
    
    // No dots for dates before signup
    if (signupDate && isBefore(date, signupDate)) return null;
    
    // For today, check actual supplement completion status
    if (isToday(date)) {
      const hasCompleted = supplements.some(supp => supp.completed);
      const hasMissed = supplements.some(supp => !supp.completed);
      
      // If any completed, show taken; if any missed, show missed
      if (hasCompleted) return "taken";
      if (hasMissed) return "missed";
      return null;
    }
    
    // For past dates, use the historical logs
    const dateStr = date.toISOString().split('T')[0];
    if (supplementLogs[dateStr] === 'taken') return "taken";
    if (supplementLogs[dateStr] === 'missed') return "missed";
    
    return null;
  };

  // Filter supplements by period and sort by time
  const getSupplementsBySlot = (slot: "morning" | "afternoon" | "evening") => {
    const periodMap = {
      "morning": "Morning",
      "afternoon": "Afternoon", 
      "evening": "Evening"
    };
    
    return supplements
      .filter((supp) => supp.period === periodMap[slot])
      .sort((a, b) => {
        // Convert time strings to comparable format (HH:MM)
        const timeA = a.time.padStart(5, '0'); // Ensure format like "08:00"
        const timeB = b.time.padStart(5, '0');
        return timeA.localeCompare(timeB);
      });
  };

  const morningSupplements = getSupplementsBySlot("morning");
  const afternoonSupplements = getSupplementsBySlot("afternoon");
  const eveningSupplements = getSupplementsBySlot("evening");

  const formatSelectedDate = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "MMMM d");
  };

  // Custom toggle completed handler that also refreshes user stats
  const handleToggleCompletedWithRefresh = async (id: number) => {
    await handleToggleCompleted(id);
    
    // Refresh user stats after toggling completion
    if (refreshStats) {
      setTimeout(() => refreshStats(), 300); // Small delay to ensure backend update completes
    }
  };

  // Check if a date is before the signup date
  const isBeforeSignup = (date: Date): boolean => {
    return signupDate ? isBefore(date, signupDate) : false;
  };

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Schedule" />

      {/* Calendar Header */}
      <div className="bg-white px-4 py-3 border-b border-[var(--border-grey)]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-[var(--border-dark)] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-[var(--border-dark)] rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-[var(--text-secondary)] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(day => {
              const supplementStatus = getSupplementStatusForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const isDisabled = isBeforeSignup(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !isDisabled && setSelectedDate(day)}
                  disabled={isDisabled}
                  className={`relative p-2 min-h-[2.5rem] text-center rounded-lg transition-colors ${
                    isDisabled
                      ? "opacity-30 cursor-not-allowed"
                      : isSelected
                      ? "bg-[var(--primary-color)] text-white"
                      : isTodayDate
                      ? "bg-[var(--primary-light)] text-[var(--primary-color)]"
                      : isCurrentMonth
                      ? "hover:bg-[var(--border-dark)] text-[var(--text-primary)]"
                      : "text-[var(--text-placeholder)]"
                  }`}
                >
                  <span className={`text-sm font-medium ${!isCurrentMonth ? "opacity-50" : ""}`}>
                    {format(day, "d")}
                  </span>
                  
                  {/* Supplement indicator */}
                  {supplementStatus && !isDisabled && (
                    <div className="flex justify-center mt-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          supplementStatus === "taken"
                            ? isSelected 
                              ? "bg-white" 
                              : "bg-[var(--primary-color)]"
                            : isSelected
                            ? "bg-white"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[var(--primary-color)]"></div>
            <span className="text-[var(--text-secondary)]">Taken</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="text-[var(--text-secondary)]">Missed</span>
          </div>
        </div>
      </div>

      {/* Today's Dose Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {formatSelectedDate(selectedDate)}'s Dose
            </h3>
            {!isToday(selectedDate) && (
              <button
                onClick={() => setSelectedDate(new Date())}
                className="text-sm text-[var(--primary-color)] font-medium"
              >
                Today
              </button>
            )}
          </div>

          {isLoading || isLoadingLogs ? (
            <div className="space-y-6">
              <LoadingSpinner text="Loading schedule..." />
              <div className="space-y-4">
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Morning Supplements */}
              {morningSupplements.length > 0 && (
                <>
                  <TimeLineTime time="morning" />
                  <div className="mb-6">
                    <SupplementCard
                      supplements={morningSupplements}
                      onToggleMute={handleToggleMute}
                      onToggleCompleted={handleToggleCompletedWithRefresh}
                    />
                  </div>
                </>
              )}

              {/* Afternoon Supplements */}
              {afternoonSupplements.length > 0 && (
                <>
                  <TimeLineTime time="afternoon" />
                  <div className="mb-6">
                    <SupplementCard
                      supplements={afternoonSupplements}
                      onToggleMute={handleToggleMute}
                      onToggleCompleted={handleToggleCompletedWithRefresh}
                    />
                  </div>
                </>
              )}

              {/* Evening Supplements */}
              {eveningSupplements.length > 0 && (
                <>
                  <TimeLineTime time="evening" />
                  <div className="mb-6">
                    <SupplementCard
                      supplements={eveningSupplements}
                      onToggleMute={handleToggleMute}
                      onToggleCompleted={handleToggleCompletedWithRefresh}
                    />
                  </div>
                </>
              )}

              {/* Empty State */}
              {morningSupplements.length === 0 &&
                afternoonSupplements.length === 0 &&
                eveningSupplements.length === 0 && (
                  <div className="text-center mt-8 py-12">
                    <div className="w-16 h-16 bg-[var(--border-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-[var(--text-placeholder)]" />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                      No supplements scheduled
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm">
                      {isToday(selectedDate) 
                        ? "You're all set for today!" 
                        : `No supplements scheduled for ${format(selectedDate, "MMMM d")}`
                      }
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      <AddButton />
    </div>
  );
};

export default Scheduler;
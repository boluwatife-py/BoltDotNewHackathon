import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isFuture } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HeadInfo from "../components/UI/HeadInfo";
import AddButton from "../components/NewSupp";
import SupplementCard from "../components/SupplementCard/SupplementCard";
import TimeLineTime from "../components/UI/TimeLineTime";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import LoadingCard from "../components/UI/LoadingCard";
import { useSupplements } from "../hooks/useSupplements";

const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { supplements, isLoading, error, handleToggleMute, handleToggleCompleted, refetch } = useSupplements();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get supplement status for a specific date
  const getSupplementStatusForDate = (date: Date): "taken" | "missed" | null => {
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    
    // No dots for future dates or dates outside current month
    if (!isCurrentMonth || isFuture(date)) return null;
    
    // For today, check actual supplement completion status
    if (isToday(date)) {
      const hasCompleted = supplements.some(supp => supp.completed);
      const hasMissed = supplements.some(supp => !supp.completed);
      
      // If any completed, show taken; if any missed, show missed
      if (hasCompleted) return "taken";
      if (hasMissed) return "missed";
      return null;
    }
    
    // For past dates, simulate realistic supplement history
    const dayOfMonth = date.getDate();
    
    // Create a realistic pattern where most days are taken, some are missed
    if (dayOfMonth % 7 === 0) {
      // Every 7th day might be missed (weekend forgetfulness)
      return "missed";
    } else if (dayOfMonth % 3 === 0) {
      // Every 3rd day is taken
      return "taken";
    } else if (dayOfMonth % 5 === 0) {
      // Every 5th day is taken
      return "taken";
    }
    
    // Most other past days have no supplements scheduled
    return null;
  };

  const getSupplementsBySlot = (slot: "morning" | "afternoon" | "evening") =>
    supplements.filter((supp) => {
      const hour = parseInt(supp.time.split(":")[0], 10);
      if (slot === "morning") return hour < 12;
      if (slot === "afternoon") return hour >= 12 && hour < 18;
      return hour >= 18;
    });

  const morningSupplements = getSupplementsBySlot("morning");
  const afternoonSupplements = getSupplementsBySlot("afternoon");
  const eveningSupplements = getSupplementsBySlot("evening");

  const formatSelectedDate = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "MMMM d");
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

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative p-2 min-h-[2.5rem] text-center rounded-lg transition-colors ${
                    isSelected
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
                  
                  {/* Single supplement indicator */}
                  {supplementStatus && (
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

          {isLoading ? (
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
                      onToggleCompleted={handleToggleCompleted}
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
                      onToggleCompleted={handleToggleCompleted}
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
                      onToggleCompleted={handleToggleCompleted}
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
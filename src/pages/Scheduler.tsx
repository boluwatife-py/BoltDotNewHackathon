import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HeadInfo from "../components/UI/HeadInfo";
import AddButton from "../components/NewSupp";
import SupplementCard from "../components/SupplementCard/SupplementCard";
import TimeLineTime from "../components/UI/TimeLineTime";
import supplementsToday from "../Data/Supplement";
import type { SupplementItem } from "../types/Supplement";

const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [supplements, setSupplements] = useState<SupplementItem[]>([]);

  useEffect(() => {
    setSupplements(supplementsToday);
  }, []);

  const handleToggleMute = (id: number) => {
    setSupplements((prev) =>
      prev.map((item) =>
        item.id === id && !item.completed
          ? { ...item, muted: !item.muted }
          : item
      )
    );
  };

  const handleToggleCompleted = (id: number) => {
    setSupplements((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              muted: !item.completed ? true : item.muted,
            }
          : item
      )
    );
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get supplements for a specific date (mock data for now)
  const getSupplementsForDate = (date: Date) => {
    // For demo purposes, show supplements on certain days
    const dayOfMonth = date.getDate();
    if (dayOfMonth % 3 === 0) {
      return supplements.slice(0, 2);
    } else if (dayOfMonth % 2 === 0) {
      return supplements.slice(0, 1);
    }
    return [];
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
              const daySupplements = getSupplementsForDate(day);
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
                  
                  {/* Supplement indicators */}
                  {daySupplements.length > 0 && (
                    <div className="flex justify-center mt-1">
                      <div className="flex gap-1">
                        {daySupplements.slice(0, 3).map((_, index) => (
                          <div
                            key={index}
                            className={`w-1 h-1 rounded-full ${
                              isSelected ? "bg-white" : "bg-[var(--primary-color)]"
                            }`}
                          />
                        ))}
                      </div>
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
        </div>
      </div>

      <AddButton />
    </div>
  );
};

export default Scheduler;
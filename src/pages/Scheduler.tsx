import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar, Filter, Search } from "lucide-react";
import HeadInfo from "../components/UI/HeadInfo";
import AddButton from "../components/NewSupp";
import { supplements } from "../Data/Supplement";
import { type SupplementData } from "../types/FormData";

interface ScheduledSupplement extends SupplementData {
  scheduledTimes: Date[];
  nextDose?: Date;
  status: "upcoming" | "due" | "overdue" | "completed";
}

const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "due" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledSupplements, setScheduledSupplements] = useState<ScheduledSupplement[]>([]);

  // Convert supplements to scheduled supplements with times
  useEffect(() => {
    const scheduled = supplements.map(supplement => {
      const scheduledTimes: Date[] = [];
      const today = new Date();
      
      // Generate scheduled times for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Add times based on supplement's timesOfDay
        Object.entries(supplement.timesOfDay).forEach(([period, times]) => {
          times.forEach(time => {
            const scheduledTime = new Date(date);
            scheduledTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
            scheduledTimes.push(scheduledTime);
          });
        });
      }

      // Determine status for next dose
      const now = new Date();
      const nextDose = scheduledTimes.find(time => time > now);
      let status: "upcoming" | "due" | "overdue" | "completed" = "upcoming";
      
      if (nextDose) {
        const timeDiff = nextDose.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        
        if (minutesDiff <= 30 && minutesDiff >= -30) {
          status = "due";
        } else if (minutesDiff < -30) {
          status = "overdue";
        }
      }

      return {
        ...supplement,
        scheduledTimes,
        nextDose,
        status
      };
    });

    setScheduledSupplements(scheduled);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getSupplementsForDate = (date: Date) => {
    return scheduledSupplements.filter(supplement =>
      supplement.scheduledTimes.some(time => isSameDay(time, date))
    );
  };

  const getFilteredSupplements = () => {
    let filtered = scheduledSupplements;

    if (filterStatus !== "all") {
      filtered = filtered.filter(supplement => supplement.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(supplement =>
        supplement.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "due":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const formatTimeForDisplay = (date: Date) => {
    return format(date, "h:mm a");
  };

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Scheduler" />

      {/* Header Controls */}
      <div className="bg-white px-4 py-3 border-b border-[var(--border-grey)]">
        {/* Search and Filter Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-placeholder)] w-4 h-4" />
            <input
              type="text"
              placeholder="Search supplements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--border-dark)] border border-[#CCC] rounded-lg text-sm focus:outline-none focus:border-[var(--primary-color)]"
            />
          </div>
          <button className="p-2 bg-[var(--border-dark)] border border-[#CCC] rounded-lg">
            <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex bg-[var(--border-dark)] rounded-lg p-1">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "calendar"
                  ? "bg-white text-[var(--primary-color)] shadow-sm"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-[var(--primary-color)] shadow-sm"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              <Clock className="w-4 h-4" />
              List
            </button>
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-[#CCC] rounded-lg text-sm focus:outline-none focus:border-[var(--primary-color)]"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="due">Due Now</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="flex-1 bg-white">
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-grey)]">
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
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-medium text-[var(--text-secondary)] py-2">
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
                    className={`relative p-2 min-h-[3rem] text-left rounded-lg transition-colors ${
                      isSelected
                        ? "bg-[var(--primary-color)] text-white"
                        : isTodayDate
                        ? "bg-[var(--primary-light)] text-[var(--primary-color)]"
                        : isCurrentMonth
                        ? "hover:bg-[var(--border-dark)]"
                        : "text-[var(--text-placeholder)]"
                    }`}
                  >
                    <span className={`text-sm font-medium ${!isCurrentMonth ? "opacity-50" : ""}`}>
                      {format(day, "d")}
                    </span>
                    
                    {/* Supplement indicators */}
                    {daySupplements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {daySupplements.slice(0, 2).map((supplement, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-white" : "bg-[var(--primary-color)]"
                            }`}
                          />
                        ))}
                        {daySupplements.length > 2 && (
                          <span className={`text-xs ${isSelected ? "text-white" : "text-[var(--primary-color)]"}`}>
                            +{daySupplements.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="border-t border-[var(--border-grey)] p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            
            {getSupplementsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getSupplementsForDate(selectedDate).map(supplement => {
                  const dayTimes = supplement.scheduledTimes.filter(time => isSameDay(time, selectedDate));
                  
                  return (
                    <div key={supplement.id} className="bg-[var(--border-dark)] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[var(--text-primary)]">{supplement.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(supplement.status)}`}>
                          {supplement.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {dayTimes.map((time, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white rounded-md text-sm text-[var(--text-secondary)]"
                          >
                            {formatTimeForDisplay(time)}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-[var(--text-secondary)] mt-2">
                        {supplement.dose.quantity} {supplement.dose.unit} • {supplement.frequency}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[var(--text-secondary)] text-center py-8">
                No supplements scheduled for this day
              </p>
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-y-auto">
          {getFilteredSupplements().length > 0 ? (
            <div className="p-4 space-y-3">
              {getFilteredSupplements().map(supplement => (
                <div key={supplement.id} className="bg-white rounded-lg p-4 shadow-sm border border-[var(--border-grey)]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text-primary)] text-lg">{supplement.name}</h3>
                      <p className="text-[var(--text-secondary)] text-sm">{supplement.brand}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(supplement.status)}`}>
                      {supplement.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-[var(--text-secondary)] font-medium">DOSE</span>
                      <p className="text-sm text-[var(--text-primary)]">{supplement.dose.quantity} {supplement.dose.unit}</p>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-secondary)] font-medium">FREQUENCY</span>
                      <p className="text-sm text-[var(--text-primary)]">{supplement.frequency}</p>
                    </div>
                  </div>

                  {supplement.nextDose && (
                    <div className="bg-[var(--border-dark)] rounded-lg p-3">
                      <span className="text-xs text-[var(--text-secondary)] font-medium">NEXT DOSE</span>
                      <p className="text-sm text-[var(--text-primary)] font-medium">
                        {format(supplement.nextDose, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-2 px-3 bg-[var(--primary-color)] text-white rounded-lg text-sm font-medium">
                      Mark as Taken
                    </button>
                    <button className="py-2 px-3 border border-[var(--border-grey)] rounded-lg text-sm font-medium text-[var(--text-secondary)]">
                      Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--border-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-[var(--text-placeholder)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No supplements found</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  {searchQuery ? "Try adjusting your search or filter" : "Add supplements to start scheduling"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <AddButton />
    </div>
  );
};

export default Scheduler;
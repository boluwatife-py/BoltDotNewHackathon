import { useState, useRef, useEffect } from "react";
import { Clock, Minus } from "lucide-react";

const TOD = ["Morning", "Afternoon", "Evening"] as const;
type TODKey = (typeof TOD)[number];

type TimeOfDayPickerProps = {
  errors?: string;
  timesOfDay: Record<TODKey, Date[]>;
  onChange: (timesOfDay: Record<TODKey, Date[]>) => void;
};

// iOS-style wheel picker component
const WheelPicker = ({ 
  values, 
  selectedValue, 
  onChange, 
  suffix = "" 
}: { 
  values: string[]; 
  selectedValue: string; 
  onChange: (value: string) => void;
  suffix?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 44; // Height of each item
  const visibleItems = 5; // Number of visible items
  const centerIndex = Math.floor(visibleItems / 2);

  const selectedIndex = values.indexOf(selectedValue);

  useEffect(() => {
    if (containerRef.current) {
      const scrollTop = selectedIndex * itemHeight;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [selectedIndex, itemHeight]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const newIndex = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(newIndex, values.length - 1));
    
    if (values[clampedIndex] !== selectedValue) {
      onChange(values[clampedIndex]);
    }
  };

  const handleItemClick = (value: string, index: number) => {
    onChange(value);
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  };

  return (
    <div className="relative h-[220px] overflow-hidden">
      {/* Selection indicator */}
      <div 
        className="absolute left-0 right-0 bg-gray-100 border-t border-b border-gray-200 pointer-events-none z-10"
        style={{
          top: centerIndex * itemHeight,
          height: itemHeight
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-[88px] bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
      
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollSnapType: 'y mandatory',
          paddingTop: centerIndex * itemHeight,
          paddingBottom: centerIndex * itemHeight
        }}
      >
        {values.map((value, index) => {
          const isSelected = value === selectedValue;
          return (
            <div
              key={value}
              className={`flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'text-black font-semibold text-2xl' 
                  : 'text-gray-400 text-xl'
              }`}
              style={{
                height: itemHeight,
                scrollSnapAlign: 'center'
              }}
              onClick={() => handleItemClick(value, index)}
            >
              {value}{suffix}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// iOS-style time picker modal
const IOSTimePicker = ({ 
  isOpen, 
  onClose, 
  selectedTime, 
  onTimeChange,
  minTime,
  maxTime 
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedTime: Date;
  onTimeChange: (time: Date) => void;
  minTime?: Date;
  maxTime?: Date;
}) => {
  const [tempHour, setTempHour] = useState(selectedTime.getHours() % 12 || 12);
  const [tempMinute, setTempMinute] = useState(selectedTime.getMinutes());
  const [tempPeriod, setTempPeriod] = useState(selectedTime.getHours() >= 12 ? 'PM' : 'AM');

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const handleConfirm = () => {
    const newDate = new Date(selectedTime);
    let hour24 = tempHour;
    
    if (tempPeriod === 'PM' && tempHour !== 12) {
      hour24 += 12;
    } else if (tempPeriod === 'AM' && tempHour === 12) {
      hour24 = 0;
    }
    
    newDate.setHours(hour24, tempMinute, 0, 0);
    
    // Check bounds
    if (minTime && newDate < minTime) {
      newDate.setTime(minTime.getTime());
    }
    if (maxTime && newDate > maxTime) {
      newDate.setTime(maxTime.getTime());
    }
    
    onTimeChange(newDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-blue-500 font-medium text-lg"
          >
            Cancel
          </button>
          <h3 className="text-lg font-semibold">Select Time</h3>
          <button
            onClick={handleConfirm}
            className="text-blue-500 font-medium text-lg"
          >
            Done
          </button>
        </div>
        
        {/* Time Picker */}
        <div className="p-4">
          <div className="flex justify-center items-center bg-gray-50 rounded-2xl overflow-hidden">
            <div className="flex-1">
              <WheelPicker
                values={hours}
                selectedValue={String(tempHour).padStart(2, '0')}
                onChange={(value) => setTempHour(parseInt(value))}
              />
            </div>
            
            <div className="flex-1">
              <WheelPicker
                values={minutes}
                selectedValue={String(tempMinute).padStart(2, '0')}
                onChange={(value) => setTempMinute(parseInt(value))}
              />
            </div>
            
            <div className="flex-1">
              <WheelPicker
                values={periods}
                selectedValue={tempPeriod}
                onChange={setTempPeriod}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TimeOfDayPicker({
  errors,
  timesOfDay,
  onChange,
}: TimeOfDayPickerProps) {
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TODKey>("Morning");
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);

  const getTimeBounds = () => {
    switch (selectedTimeOfDay) {
      case "Morning":
        return {
          minTime: new Date().setHours(5, 0, 0, 0),
          maxTime: new Date().setHours(11, 59, 0, 0),
        };
      case "Afternoon":
        return {
          minTime: new Date().setHours(12, 0, 0, 0),
          maxTime: new Date().setHours(16, 59, 0, 0),
        };
      case "Evening":
        return {
          minTime: new Date().setHours(17, 0, 0, 0),
          maxTime: new Date().setHours(21, 59, 0, 0),
        };
    }
  };

  const { minTime, maxTime } = getTimeBounds();

  const handleTimeChange = (date: Date, index: number) => {
    const newDate = new Date(date);

    if (minTime && maxTime) {
      const min = new Date(minTime).getTime();
      const max = new Date(maxTime).getTime();
      if (newDate.getTime() < min) newDate.setTime(min);
      if (newDate.getTime() > max) newDate.setTime(max);
    }

    const updatedTimes = [...timesOfDay[selectedTimeOfDay]];
    updatedTimes[index] = newDate;
    onChange({ ...timesOfDay, [selectedTimeOfDay]: updatedTimes });
  };

  const addTimePicker = () => {
    const defaults = {
      Morning: new Date(new Date().setHours(8, 0, 0, 0)),
      Afternoon: new Date(new Date().setHours(13, 0, 0, 0)),
      Evening: new Date(new Date().setHours(18, 0, 0, 0)),
    };
    onChange({
      ...timesOfDay,
      [selectedTimeOfDay]: [
        ...timesOfDay[selectedTimeOfDay],
        defaults[selectedTimeOfDay],
      ],
    });
  };

  const removeTimePicker = (index: number) => {
    const updatedTimes = [...timesOfDay[selectedTimeOfDay]];
    updatedTimes.splice(index, 1);
    onChange({ ...timesOfDay, [selectedTimeOfDay]: updatedTimes });
  };

  const openTimePicker = (index: number) => {
    setEditingTimeIndex(index);
    setIsTimePickerOpen(true);
  };

  const handleTimePickerChange = (newTime: Date) => {
    if (editingTimeIndex !== null) {
      handleTimeChange(newTime, editingTimeIndex);
    }
  };

  return (
    <div className="px-4 py-3">
      <label className="block text-xl font-medium mb-2">Time of Day</label>
      {errors && (
        <p className="text-[var(--alarm-danger)] text-sm mb-2">{errors}</p>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TOD.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => setSelectedTimeOfDay(time)}
            className={`flex-1 border p-3 rounded-[0.75rem] font-medium cursor-pointer transition-all ${
              selectedTimeOfDay === time
                ? "bg-[var(--primary-color)] text-white shadow-md"
                : "border-[#CCC] hover:border-[var(--primary-color)] hover:bg-gray-50"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Time pickers */}
      <div className="flex flex-col gap-3">
        {timesOfDay[selectedTimeOfDay].map((time, index) => (
          <div key={index} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openTimePicker(index)}
              className={`flex-1 flex justify-between items-center px-4 py-3 border rounded-lg focus:outline-none transition-all ${
                errors
                  ? "border-[var(--alarm-danger)]"
                  : "border-[#CCC] focus:border-[var(--primary-color)] hover:border-[var(--primary-color)]"
              }`}
            >
              <span className="text-base">
                {new Date(time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Clock className="text-[#6B7280] w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => removeTimePicker(index)}
              className="text-[#6B7280] hover:text-red-500 p-1 transition-colors"
              title="Remove time"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Range info */}
      {minTime && maxTime && (
        <p className="text-xs text-[#6B7280] mt-1">
          {selectedTimeOfDay} range:{" "}
          {new Date(minTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {new Date(maxTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      <button
        className="px-4 flex items-center justify-center h-[2.75rem] w-full mt-2"
        type="button"
        onClick={addTimePicker}
      >
        <span className="text-[1.0625rem] text-[#08B5A6]">
          +Add another time
        </span>
      </button>

      {/* iOS Time Picker Modal */}
      <IOSTimePicker
        isOpen={isTimePickerOpen}
        onClose={() => {
          setIsTimePickerOpen(false);
          setEditingTimeIndex(null);
        }}
        selectedTime={
          editingTimeIndex !== null 
            ? timesOfDay[selectedTimeOfDay][editingTimeIndex] 
            : new Date()
        }
        onTimeChange={handleTimePickerChange}
        minTime={minTime ? new Date(minTime) : undefined}
        maxTime={maxTime ? new Date(maxTime) : undefined}
      />
    </div>
  );
}
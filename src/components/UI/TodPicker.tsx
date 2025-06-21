import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock } from "lucide-react";

const TOD = ["Morning", "Afternoon", "Evening"] as const;

const CustomTimeInput = forwardRef(({ value, onClick }: any, ref: any) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full self-stretch flex justify-between items-center px-4 py-3 border border-[#CCC] rounded-lg bg-white focus:border-[var(--primary-color)] focus:outline-none"
  >
    <span className={value ? "text-base" : "text-[#6B7280]"}>{value || "00:00 AM"}</span>
    <Clock className="text-[#6B7280]" />
  </button>
));

export default function TimeOfDayPicker() {
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>("Morning");

  // Store a list of times for each TOD
  const [timesByTimeOfDay, setTimesByTimeOfDay] = useState<{
    [K in (typeof TOD)[number]]: Date[];
  }>({
    Morning: [new Date()],
    Afternoon: [new Date()],
    Evening: [new Date()],
  });

  const getTimeBounds = () => {
    switch (selectedTimeOfDay) {
      case "Morning":
        return { minTime: new Date().setHours(5, 0), maxTime: new Date().setHours(11, 59) };
      case "Afternoon":
        return { minTime: new Date().setHours(12, 0), maxTime: new Date().setHours(16, 59) };
      case "Evening":
        return { minTime: new Date().setHours(17, 0), maxTime: new Date().setHours(21, 59) };
      default:
        return { minTime: undefined, maxTime: undefined };
    }
  };
  const { minTime, maxTime } = getTimeBounds();

  // Get the current list of times for selected TOD
  const currentTimes = timesByTimeOfDay[selectedTimeOfDay as keyof typeof timesByTimeOfDay];

  const handleTimeChange = (date: Date | null, index: number) => {
    if (!date) return;
    setTimesByTimeOfDay((prev) => {
      const updated = [...prev[selectedTimeOfDay as keyof typeof prev]];
      updated[index] = date;
      return { ...prev, [selectedTimeOfDay]: updated };
    });
  };

  const addTimePicker = () => {
    setTimesByTimeOfDay((prev) => ({
      ...prev,
      [selectedTimeOfDay]: [...prev[selectedTimeOfDay as keyof typeof prev], new Date()],
    }));
  };

  return (
    <div className="px-4 py-3">
      <label className="block text-xl font-medium mb-2">Time of Day</label>

      <div className="flex gap-2 mb-4">
        {TOD.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => setSelectedTimeOfDay(time)}
            className={`flex-1 border p-3 rounded-[0.75rem] font-medium ${
              selectedTimeOfDay === time ? "bg-[var(--primary-color)] text-white" : "border-[#CCC]"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {currentTimes.map((time, index) => (
          <DatePicker
            key={index}
            selected={time}
            onChange={(date) => handleTimeChange(date, index)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
            minTime={minTime ? new Date(minTime) : undefined}
            maxTime={maxTime ? new Date(maxTime) : undefined}
            customInput={<CustomTimeInput />}
          />
        ))}
      </div>

      {selectedTimeOfDay && minTime && maxTime && (
        <p className="text-xs text-[#6B7280] mt-1">
          {selectedTimeOfDay} range:{" "}
          {new Date(minTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
          {new Date(maxTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}

      <button
        className="px-4 flex items-center justify-center h-[2.75rem] w-full mt-2"
        type="button"
        onClick={addTimePicker}
      >
        <span className="text-[1.0625rem] text-[#08B5A6]">+Add another time</span>
      </button>
    </div>
  );
}

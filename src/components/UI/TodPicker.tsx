import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, Minus } from "lucide-react"; // <- Import Minus icon

const TOD = ["Morning", "Afternoon", "Evening"] as const;

type CustomTimeInputProps = {
  value?: string;
  onClick?: () => void;
};

const CustomTimeInput = forwardRef<HTMLButtonElement, CustomTimeInputProps>(
  ({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full self-stretch flex justify-between items-center px-4 py-3 border border-[#CCC] rounded-lg bg-white focus:border-[var(--primary-color)] focus:outline-none"
    >
      <span className={value ? "text-base" : "text-[#6B7280]"}>{value || "00:00 AM"}</span>
      <Clock className="text-[#6B7280]" />
    </button>
  )
);

export default function TimeOfDayPicker() {
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<(typeof TOD)[number]>("Morning");
  const [timesByTimeOfDay, setTimesByTimeOfDay] = useState<Record<(typeof TOD)[number], Date[]>>(
    {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [new Date(new Date().setHours(13, 0, 0, 0))],
      Evening: [new Date(new Date().setHours(18, 0, 0, 0))],
    }
  );

  const getTimeBounds = () => {
    switch (selectedTimeOfDay) {
      case "Morning":
        return { minTime: new Date().setHours(5, 0, 0, 0), maxTime: new Date().setHours(11, 59, 0, 0) };
      case "Afternoon":
        return { minTime: new Date().setHours(12, 0, 0, 0), maxTime: new Date().setHours(16, 59, 0, 0) };
      case "Evening":
        return { minTime: new Date().setHours(17, 0, 0, 0), maxTime: new Date().setHours(21, 59, 0, 0) };
      default:
        return { minTime: undefined, maxTime: undefined };
    }
  };
  const { minTime, maxTime } = getTimeBounds();
  const currentTimes = timesByTimeOfDay[selectedTimeOfDay];

  const handleTimeChange = (date: Date | null, index: number): void => {
    if (!date) return;
    const newDate = new Date(date);
    if (minTime && maxTime) {
      const min = new Date(minTime).getTime();
      const max = new Date(maxTime).getTime();
      const time = newDate.getTime();
      if (time < min) newDate.setTime(min);
      if (time > max) newDate.setTime(max);
    }
    setTimesByTimeOfDay((prev) => {
      const updated = [...prev[selectedTimeOfDay]];
      updated[index] = newDate;
      return { ...prev, [selectedTimeOfDay]: updated };
    });
  };

  const addTimePicker = () => {
    let newTime: Date;
    switch (selectedTimeOfDay) {
      case "Morning":
        newTime = new Date(new Date().setHours(8, 0, 0, 0));
        break;
      case "Afternoon":
        newTime = new Date(new Date().setHours(13, 0, 0, 0));
        break;
      case "Evening":
        newTime = new Date(new Date().setHours(18, 0, 0, 0));
        break;
      default:
        newTime = new Date();
    }
    setTimesByTimeOfDay((prev) => ({
      ...prev,
      [selectedTimeOfDay]: [...prev[selectedTimeOfDay], newTime],
    }));
  };

  const removeTimePicker = (index: number) => {
    setTimesByTimeOfDay((prev) => {
      const updated = [...prev[selectedTimeOfDay]];
      updated.splice(index, 1);
      return { ...prev, [selectedTimeOfDay]: updated };
    });
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
            className={`flex-1 border p-3 rounded-[0.75rem] font-medium cursor-pointer ${
              selectedTimeOfDay === time ? "bg-[var(--primary-color)] text-white" : "border-[#CCC]"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {currentTimes.map((time, index) => (
          <div key={index} className="flex items-center gap-2">
            <DatePicker
              selected={new Date(time)}
              onChange={(date) => handleTimeChange(date, index)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              minTime={minTime ? new Date(minTime) : undefined}
              maxTime={maxTime ? new Date(maxTime) : undefined}
              customInput={<CustomTimeInput />}
            />

            {/* 🆕 Minus icon for removing */}
            <button
              type="button"
              onClick={() => removeTimePicker(index)}
              className="text-[#6B7280] hover:text-red-500 p-1"
              title="Remove time"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
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

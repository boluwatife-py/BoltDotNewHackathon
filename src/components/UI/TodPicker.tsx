import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, Minus } from "lucide-react";

const TOD = ["Morning", "Afternoon", "Evening"] as const;
type TODKey = (typeof TOD)[number];

type TimeOfDayPickerProps = {
  errors?: string;
  timesOfDay: Record<TODKey, Date[]>;
  onChange: (timesOfDay: Record<TODKey, Date[]>) => void;
};

type CustomTimeInputProps = {
  value?: string;
  onClick?: () => void;
  errors?: string;
};

const CustomTimeInput = forwardRef<HTMLButtonElement, CustomTimeInputProps>(
  ({ value, onClick, errors, ...rest }, ref) => (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      {...rest}
      className={`w-full flex justify-between items-center px-4 py-3 border rounded-lg focus:outline-none ${
        errors
          ? "border-[var(--alarm-danger)]"
          : "border-[#CCC] focus:border-[var(--primary-color)]"
      }`}
    >
      <span className={value ? "text-base" : "text-[#6B7280]"}>
        {value || "Pick a time"}
      </span>
      <Clock className="text-[#6B7280]" />
    </button>
  )
);

CustomTimeInput.displayName = "CustomTimeInput";

export default function TimeOfDayPicker({
  errors,
  timesOfDay,
  onChange,
}: TimeOfDayPickerProps) {
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TODKey>("Morning");

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

  const handleTimeChange = (date: Date | null, index: number) => {
    if (!date) return;
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
            className={`flex-1 border p-3 rounded-[0.75rem] font-medium cursor-pointer ${
              selectedTimeOfDay === time
                ? "bg-[var(--primary-color)] text-white"
                : "border-[#CCC]"
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
            <DatePicker
              selected={new Date(time)}
              onChange={(date) => handleTimeChange(date, index)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              minTime={minTime ? new Date(minTime) : undefined}
              maxTime={maxTime ? new Date(maxTime) : undefined}
              // ✅ This will pass a formatted `value` to CustomTimeInput
              customInput={<CustomTimeInput errors={errors} />}
            />
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
    </div>
  );
}

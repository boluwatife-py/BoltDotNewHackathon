import { useState } from "react";
import Check from "../../assets/icons/Check/check.svg";

export default function Checkbox({checked}: {checked?: boolean}) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => setIsChecked((prev) => !prev);

  return (
    <label className="flex items-center cursor-pointer py-[.62rem] pr-[.62rem]">
      <input
        type="checkbox"
        className="hidden"
        checked={isChecked}
        onChange={handleToggle}
      />

      <span
        className={`w-[1.5rem] h-[1.5rem] rounded-[.3rem] flex items-center justify-center hover:border-gray-400 ${
          isChecked
            ? "bg-[var(--primary-color)]"
            : "bg-white border border-[#CCCCCC]"
        }`}
      >
        {isChecked && <img src={Check} alt="Checkmark" />}
      </span>
    </label>
  );
}

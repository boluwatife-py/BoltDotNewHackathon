import { useState } from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Toggle({ checked = false, onChange }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor="toggle"
      className="relative block w-[3.1875rem] h-[1.9375rem] cursor-pointer [-webkit-tap-highlight-color:_transparent] p-[1]"
    >
      <input
        type="checkbox"
        id="toggle"
        checked={isChecked}
        onChange={handleChange}
        className="sr-only peer"
      />
      <span className="absolute inset-0 rounded-full bg-[#E0E0E0] transition-colors peer-checked:bg-[#08B5A6]" />

      <span
        className={`absolute top-[0.125rem] left-[0.12rem] h-[1.6875rem] w-[1.6875rem] rounded-full bg-white transition-transform peer-checked:translate-x-[1.26rem]`}
        style={
          isChecked
            ? { filter: "drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.15))" }
            : { boxShadow: "0px 3px 8px 0px rgba(0, 0, 0, 0.15)" }
        }
      />
    </label>
  );
}

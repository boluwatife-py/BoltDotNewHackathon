import Check from "../../assets/icons/Check/check.svg";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({ checked = false, onChange }: CheckboxProps) {
  const handleToggle = () => {
    onChange?.(!checked); // notify parent with the new state
  };

  return (
    <label className="flex items-center cursor-pointer py-[.62rem] pr-[.62rem]">
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={handleToggle}
      />

      <span
        className={`w-[1.5rem] h-[1.5rem] rounded-[.3rem] flex items-center justify-center hover:border-gray-400 ${
          checked ? "bg-[var(--primary-color)]" : "bg-white border border-[#CCCCCC]"
        }`}
      >
        {checked && <img src={Check} alt="Checkmark" />}
      </span>
    </label>
  );
}

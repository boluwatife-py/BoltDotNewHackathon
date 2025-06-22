import Down from "../../assets/icons/down.svg";

type InputState = "default" | "success" | "error";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState;
  handleClick: () => void;
  value: string;
  unit?: string | null;
  onQuantityChange: (quantity: string) => void;
}

export default function Dose({
  state,
  handleClick,
  value,
  unit,
  onQuantityChange,
}: InputFieldProps) {
  return (
    <div
      className={`flex items-center w-full border rounded-[0.75rem] bg-[var(--border-dark)] ${
        state === "error" ? "border-[var(--alarm-danger)]" : "border-[#CCC]"
      }`}
    >
      {/* Input 20% */}
      <div className="w-1/5">
        <input
          type="number"
          step={1}
          min={0}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full px-[1rem] py-[0.75rem] text-end rounded-l-[0.75rem] border-r-2 border-r-[#CCC] placeholder-[#6B7280] outline-none"
          placeholder="Qty"
          value={value}
          onChange={(e) => onQuantityChange(e.target.value)}
          name="dose"
          id="dose"
        />
      </div>

      {/* Button 80% */}
      <div className="w-4/5">
        <button
          className="w-full flex items-center justify-between px-[1rem] py-[0.75rem] text-start rounded-r-[0.75rem]"
          type="button"
          onClick={handleClick}
        >
          <span
            className={`${
              unit ? "text-[var(--text-primary)]" : "text-[#6B7280]"
            }`}
          >
            {unit || "Select Unit"}
          </span>
          <img src={Down} alt="" />
        </button>
      </div>
    </div>
  );
}

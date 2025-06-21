import Down from "../../assets/icons/down.svg";

interface FrequencyProps {
  value?: string;
  onClick?: () => void;
  state?: "default" | "error";
}

export default function Frequency({ value, onClick, state = "default" }: FrequencyProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      name="frequency"
      className={`relative flex items-center justify-between w-full border px-4 py-3 rounded-xl bg-[var(--border-dark)] gap-2 text-left ${
        state === "error"
          ? "border-[var(--alarm-danger)]"
          : "border-[#CCC] focus-within:border-[var(--primary-color)]"
      }`}
    >
      <span
        className={`flex-1 ${
          value ? "text-base text-black" : "text-[#6B7280] text-base"
        }`}
      >
        {value || "How Often?"}
      </span>
      <img src={Down} alt="" />
    </button>
  );
}

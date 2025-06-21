import Alert from "../../assets/icons/alert.svg";

interface FrequencyProps {
  value?: string;
  onClick?: () => void;
  state?: "default" | "error";
}

export default function Frequency({
  value,
  onClick,
  state = "default",
}: FrequencyProps) {
  const errorIcon =
    state === "error" ? (
      <img src={Alert} className="w-6 h-6" alt="Error" />
    ) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      name="frequency"
      className={`relative flex items-center w-full border px-4 py-3 rounded-xl bg-[var(--border-dark)] gap-2 text-left ${
        state === "error"
          ? "border-[var(--alarm-danger)]"
          : "border-[#CCC] focus-within:border-[var(--primary-color)]"
      }`}
    >
      {errorIcon}
      <span
        className={`flex-1 ${value ? "text-base" : "text-[#6B7280] text-base"}`}
      >
        How Often?
      </span>
    </button>
  );
}

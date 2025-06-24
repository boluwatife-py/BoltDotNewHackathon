import { type ButtonHTMLAttributes } from "react";

export default function Button({
  text,
  className,
  handleClick,
  loading = false,
}: {
  text: string;
  className?: string;
  handleClick: () => void;
  loading?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center px-[1rem] pt-[0.75rem] pb-[1rem] ${className}`}
    >
      <button
        className={`w-full flex px-[1.25rem] h-[3rem] justify-center items-center rounded-[1.5rem] bg-[var(--primary-color)] cursor-pointer ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={!loading ? handleClick : undefined}
        disabled={loading}
      >
        {loading ? (
          <div className="flex flex-row gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : (
          <span className="text-white overflow-ellipsis font-bold text-[1.0625rem] text-center">
            {text}
          </span>
        )}
      </button>
    </div>
  );
}

interface ButtonReProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: "default" | "comp";
}

// Usage:
function ButtonRe({ text, variant = "default", ...props }: ButtonReProps) {
  return (
    <button
      {...props}
      className={`px-[1.25rem] py-[.8rem] font-medium rounded-[0.75rem] border border-[var(--primary-color)] cursor-pointer ... ${
        variant === "default"
          ? "text-[var(--text-primary)] bg-white"
          : "bg-[var(--primary-color)] text-white"
      }`}
    >
      {text}
    </button>
  );
}

export { ButtonRe };

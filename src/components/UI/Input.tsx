import React from "react";
import Alert from "../../assets/icons/alert.svg";
type InputState = "default" | "success" | "error";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState;
  placeholder?: string;
  errorMessage?: string;
}

export default function InputField({
  state = "default",
  errorMessage,
  placeholder,
  ...props
}: InputFieldProps) {
  const errorIcon =
    state === "error" ? (
      <img src={Alert} className="w-[1.5rem] h-[1.5rem]" alt="SafeDoser" />
    ) : null;

  return (
    <div className={`relative flex items-center justify-center w-full border px-[1rem] py-[0.75rem] rounded-[0.75rem] bg-[var(--border-dark)] gap-[0.5rem] ${
        state==='error'?"border-[var(--alarm-danger)]":"border-[#CCC] has-focus-within:border-[var(--primary-color)]"
    }`}>
      {errorIcon}
      <input
        placeholder={placeholder}
        className="bg-transparent flex-1 focus:outline-none placeholder-[#6B7280] text-base outline-none focus:border-none"
        {...props}
      />
    </div>
  );
}

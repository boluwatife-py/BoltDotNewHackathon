import React from "react";

type TypeButtonProps = {
  label: string;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
};

export default function TypeButton({ label, selected, onClick, type }: TypeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-[1rem] py-[0.75rem] flex items-center justify-center rounded-[0.75rem] transition-colors ${
        selected ? "bg-[var(--primary-color)] text-white" : "bg-[#E0E0E0] text-[var(--text-primary)]"
      }`}
      type={type}
    >
      {label}
    </button>
  );
}

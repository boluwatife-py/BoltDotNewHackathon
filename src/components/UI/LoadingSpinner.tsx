import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  color = "primary", 
  text,
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  const colorClasses = {
    primary: "bg-[var(--primary-color)]",
    white: "bg-white",
    gray: "bg-gray-400"
  };

  const dotClass = `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex flex-row gap-2">
        <div className={dotClass}></div>
        <div className={`${dotClass} [animation-delay:-.3s]`}></div>
        <div className={`${dotClass} [animation-delay:-.5s]`}></div>
      </div>
      {text && (
        <p className="text-[var(--text-secondary)] text-sm text-center">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
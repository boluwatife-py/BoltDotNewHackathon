import React from "react";

interface LoadingCardProps {
  className?: string;
  height?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ 
  className = "",
  height = "h-20"
}) => {
  return (
    <div className={`rounded-xl p-4 ${height} ${className} bg-none`}>
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-lg bg-gray-200 w-12 h-12"></div>
        <div className="flex-1 space-y-2 py-1 w-full">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;
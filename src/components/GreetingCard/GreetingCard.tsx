import React, { useEffect } from "react";
import { useUser } from "../../context/UserContext";

const GreetingCard: React.FC = () => {
  const user = useUser();
  const { name, completedDoses, totalDoses, avatarUrl, refreshStats } = user as {
    name: string;
    completedDoses: number;
    totalDoses: number;
    avatarUrl?: string;
    refreshStats?: () => void;
  };

  // Refresh stats when component mounts
  useEffect(() => {
    if (refreshStats) {
      refreshStats();
    }
  }, [refreshStats]);

  return (
    <div className="flex items-center px-[var-(--lg)] py-[var(--md)] gap-[var(--md)]">
      <div className="w-[56px] h-[56px] rounded-full overflow-hidden">
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col text-[var(--text-primary)]">
        <p>Hello, {name}!</p>
        <span className="text-[12px] font-medium text-[var(--text-light)]">
          You've completed {completedDoses}/{totalDoses} doses today.
        </span>
      </div>
    </div>
  );
};

export default GreetingCard;
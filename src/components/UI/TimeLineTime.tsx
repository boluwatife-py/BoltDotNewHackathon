import React from "react";
import MorningIcon from "../../assets/icons/morning.svg";
import AfternoonIcon from "../../assets/icons/afternoon.svg";
import EveningIcon from "../../assets/icons/evening.svg";

const TimeLineTime: React.FC<{ time: "morning" | "afternoon" | "evening" }> = ({ time }) => {
  const capitalizedTime = time.charAt(0).toUpperCase() + time.slice(1);
  
  // Map time to corresponding icon
  const timeIcons = {
    morning: MorningIcon,
    afternoon: AfternoonIcon,
    evening: EveningIcon,
  };
  
  const SelectedIcon = timeIcons[time];

  return (
    <div>
      <div className="flex items-center gap-[var(--sm)] self-stretch py-[var(--md)]">
        <img src={SelectedIcon} alt={`${capitalizedTime} Icon`} className="w-[24px] h-[24px] block" />
        <span className="wkf font-medium py-[3px]">{capitalizedTime}</span>
      </div>
    </div>
  );
};

export default TimeLineTime;
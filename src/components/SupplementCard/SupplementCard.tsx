import React from "react";
import Bell from "../../assets/icons/bell-on.svg";
import BellOff from "../../assets/icons/bell-off.svg";
import type { SupplementCardProps } from "../../types/Supplement";
import ButtonChecklist from "../UI/BtnChecklist";
import SuppIcon from "../UI/SuppIcon";
import SuppTime from "../UI/SuppTime";

const SupplementCard: React.FC<SupplementCardProps> = ({
  supplements,
  onToggleMute,
  onToggleCompleted,
}) => {
  const currentTime = new Date();

  const getDisplayStatus = (time: string, completed: boolean): "completed" | "missed" | "current" | "default" => {
    if (completed) return "completed";

    const [hours, minutes] = time.split(":").map(Number);
    const supplementTime = new Date(currentTime);
    supplementTime.setHours(hours, minutes, 0, 0);

    const diff = (supplementTime.getTime() - currentTime.getTime()) / 60000; // Difference in minutes
    if (diff >= -30 && diff <= 30) return "current";
    if (diff < -30) return "missed";
    return "default";
  };

  return (
    <div className="space-y-4">
      {supplements.map((supp) => {
        const displayStatus = getDisplayStatus(supp.time, supp.completed);
        console.log(`🔍 Supplement ${supp.name} at ${supp.time} - completed: ${supp.completed}, status: ${displayStatus}`);

        // Determine background color based on status
        const bgColor = (() => {
          if (displayStatus === "completed") return "bg-[var(--primary-dark)]";
          if (displayStatus === "current") return "bg-[var(--primary-color)]";
          if (displayStatus === "missed") return "bg-[#CCCCCC]";
          return "bg-white";
        })();

        // Determine text color based on status
        const textColor = (() => {
          if (displayStatus === "missed") return "text-[var(--text-light)]";
          if (displayStatus === "completed" || displayStatus === "current") return "text-white";
          return "text-[var(--text-primary)]";
        })();

        return (
          <div
            key={supp.id}
            className="flex items-center justify-center gap-2 text-center"
          >
            <SuppTime time={supp.time} />

            <div
              className={`flex-1 rounded-xl shadow-sm relative transition-all duration-300 ${bgColor} overflow-hidden`}
            >
              <div className="p-3">
                <div className="flex items-start gap-2">
                  <SuppIcon status={displayStatus} iconType={supp.type} />
                  <h3 className={`font-semibold text-base ${textColor} transition-colors duration-300`}>
                    {supp.name}
                  </h3>
                  <button
                    className="ml-auto cursor-pointer transition-opacity duration-300"
                    onClick={() => onToggleMute(supp.id)}
                    disabled={displayStatus === "completed" || displayStatus === "missed"}
                  >
                    <img
                      src={supp.muted ? BellOff : Bell}
                      alt="SafeDoser Bell"
                      className={displayStatus === "completed" || displayStatus === "missed" ? "opacity-50" : ""}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="mt-2 flex flex-wrap gap-2">
                    {supp.tags.map((tag, j) => (
                      <span
                        key={j}
                        className={`text-xs rounded-full px-[0.625rem] py-[0.25rem] transition-all duration-300 ${
                          displayStatus === "missed"
                            ? "line-through bg-black/20 text-[var(--Secondary-text-primary)]"
                            : displayStatus === "completed"
                            ? "bg-white/20 text-white"
                            : displayStatus === "current"
                            ? "bg-white/20 text-white"
                            : "bg-[var(--primary-light)] text-[var(--primary-color)]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ButtonChecklist
                    checked={supp.completed}
                    onToggle={() => onToggleCompleted(supp.id)}
                  />
                </div>
              </div>

              <div className="">
                {supp.alerts?.map((alert, j) => {
                  const isInteraction = alert.type === "interaction";
                  const alertBgColor = isInteraction
                    ? "bg-[#FFECCE]"
                    : "bg-[#FCD6D4]";
                  const alertTextColor = isInteraction
                    ? "text-[#C46A00]"
                    : "text-[#B3261E]";

                  return (
                    <div
                      key={j}
                      className={`flex items-start gap-2 px-2 py-1 text-sm w-full ${alertBgColor} ${alertTextColor} transition-all duration-300`}
                    >
                      <span className="mt-[2px]">⚠️ {alert.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SupplementCard;
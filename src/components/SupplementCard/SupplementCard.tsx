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

        const bgColor =
          displayStatus === "completed"
            ? "bg-[var(--primary-dark)]"
            : displayStatus === "current"
            ? "bg-[var(--primary-dark)]"
            : displayStatus === "missed"
            ? "bg-[#CCCCCC]"
            : "bg-white";

        const textColor =
          displayStatus === "missed"
            ? "text-[var(--text-light)]"
            : displayStatus === "completed" || displayStatus === "current"
            ? "text-white"
            : "text-[var(--text-primary)]";

        return (
          <div
            key={supp.id}
            className="flex items-center justify-center gap-2 text-center"
          >
            <SuppTime time={supp.time} />

            <div
              className={`flex-1 rounded-xl shadow-sm relative transition ${bgColor} overflow-hidden`}
            >
              <div className="p-3">
                <div className="flex items-start gap-2">
                  <SuppIcon status={displayStatus} iconType={supp.type} />
                  <h3 className={`font-semibold text-base ${textColor}`}>
                    {supp.name}
                  </h3>
                  <button
                    className="ml-auto cursor-pointer"
                    onClick={() => onToggleMute(supp.id)}
                    disabled={displayStatus === "completed" || displayStatus === "missed"}
                  >
                    <img
                      src={supp.muted ? BellOff : Bell}
                      alt="SafeDoser Bell"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="mt-2 flex flex-wrap gap-2">
                    {supp.tags.map((tag, j) => (
                      <span
                        key={j}
                        className={`text-xs rounded-full px-[0.625rem] py-[0.25rem] ${
                          displayStatus === "missed"
                            ? "line-through bg-black/20 text-[var(--Secondary-text-primary)]"
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
                  const bgColor = isInteraction
                    ? "bg-[#FFECCE]"
                    : "bg-[#FCD6D4]";
                  const textColor = isInteraction
                    ? "text-[#C46A00]"
                    : "text-[#B3261E]";

                  return (
                    <div
                      key={j}
                      className={`flex items-start gap-2 px-2 py-1 text-sm w-full ${bgColor} ${textColor}`}
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
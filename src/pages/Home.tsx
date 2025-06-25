import React, { useEffect, useState } from "react";
import GreetingCard from "../components/GreetingCard/GreetingCard";
import NoticeCard from "../components/NoticeCard/NoticeCard";
import TimeLineTime from "../components/UI/TimeLineTime";
import SupplementCard from "../components/SupplementCard/SupplementCard";
import type { SupplementItem } from "../types/Supplement";
import supplementsToday from "../Data/Supplement";
import AddButton from "../components/NewSupp";

const getTimeSlot = (hour: number): "morning" | "afternoon" | "evening" => {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

const Home: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [supplements, setSupplements] = useState<SupplementItem[]>([]);

  useEffect(() => {
    setSupplements(supplementsToday);
  }, []);

  const handleToggleMute = (id: number) => {
    setSupplements((prev) =>
      prev.map((item) =>
        item.id === id && !item.completed
          ? { ...item, muted: !item.muted }
          : item
      )
    );
  };

  const handleToggleCompleted = (id: number) => {
    setSupplements((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              muted: !item.completed ? true : item.muted,
            }
          : item
      )
    );
  };

  const getSupplementsBySlot = (slot: "morning" | "afternoon" | "evening") =>
    supplements.filter((supp) => {
      const hour = parseInt(supp.time.split(":")[0], 10);
      return getTimeSlot(hour) === slot;
    });

  const morningSupplements = getSupplementsBySlot("morning");
  const afternoonSupplements = getSupplementsBySlot("afternoon");
  const eveningSupplements = getSupplementsBySlot("evening");

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)]">
      <h1 className="flex justify-center px-[16px] pt-[var(--lg)] pb-[var(--md)] text-[28px] font-bold text-[var(--text-primary)] bg-white">
        SafeDoser
      </h1>

      <div className="p-4">
        <GreetingCard />
        <NoticeCard />

        <div className="px-[var(--lg)] py-[var(--slg)] text-center">
          <h1 className="text-[28px] font-bold text-[var(--text-primary)] tracking-[-0.5px] flex justify-center items-end">
            Today,
            <span className="block text-[12px] font-medium">{formattedDate}</span>
          </h1>
        </div>

        {morningSupplements.length > 0 && (
          <>
            <TimeLineTime time="morning" />
            <SupplementCard
              supplements={morningSupplements}
              onToggleMute={handleToggleMute}
              onToggleCompleted={handleToggleCompleted}
            />
          </>
        )}

        {afternoonSupplements.length > 0 && (
          <>
            <TimeLineTime time="afternoon" />
            <SupplementCard
              supplements={afternoonSupplements}
              onToggleMute={handleToggleMute}
              onToggleCompleted={handleToggleCompleted}
            />
          </>
        )}

        {eveningSupplements.length > 0 && (
          <>
            <TimeLineTime time="evening" />
            <SupplementCard
              supplements={eveningSupplements}
              onToggleMute={handleToggleMute}
              onToggleCompleted={handleToggleCompleted}
            />
          </>
        )}

        {morningSupplements.length === 0 &&
          afternoonSupplements.length === 0 &&
          eveningSupplements.length === 0 && (
            <div className="text-center mt-8 text-[var(--text-light)] text-base">
              No supplements scheduled for today. You're all set!
            </div>
          )}
      </div>

      <AddButton></AddButton>
    </div>
  );
};

export default Home;
import { useState, useEffect } from "react";
import { type SupplementItem } from "../types/Supplement";
import supplementsToday from "../Data/Supplement";

export function useSupplements() {
  const [supplements, setSupplements] = useState<SupplementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSupplements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, this would be an API call
        setSupplements(supplementsToday);
      } catch (err) {
        setError("Failed to load supplements");
        console.error("Error loading supplements:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupplements();
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

  return {
    supplements,
    isLoading,
    error,
    handleToggleMute,
    handleToggleCompleted,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => {
        setSupplements(supplementsToday);
        setIsLoading(false);
      }, 1000);
    }
  };
}
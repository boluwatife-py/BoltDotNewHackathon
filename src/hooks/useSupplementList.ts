import { useState, useEffect } from "react";
import { type SupplementData } from "../types/FormData";
import { supplements } from "../Data/Supplement";

export function useSupplementList() {
  const [supplementList, setSupplementList] = useState<SupplementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSupplementList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // In a real app, this would be an API call
        setSupplementList(supplements);
      } catch (err) {
        setError("Failed to load supplement list");
        console.error("Error loading supplement list:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSupplementList();
  }, []);

  return {
    supplementList,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => {
        setSupplementList(supplements);
        setIsLoading(false);
      }, 800);
    }
  };
}
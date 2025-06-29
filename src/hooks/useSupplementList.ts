import { useState, useEffect, useRef } from "react";
import { type SupplementData } from "../types/FormData";
import { supplementsAPI } from "../config/api";
import { useAuth } from "../context/AuthContext";

export function useSupplementList() {
  const { user } = useAuth();
  const [supplementList, setSupplementList] = useState<SupplementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Track if we're already loading data to prevent duplicate requests
  const isLoadingRef = useRef(false);
  // Track last load time to prevent too frequent refreshes
  const lastLoadTimeRef = useRef(0);
  // Track if component is mounted
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (user && !isLoadingRef.current) {
      loadSupplementList();
    } else if (!user) {
      setSupplementList([]);
      setIsLoading(false);
    }
  }, [user, refreshTrigger]);

  const loadSupplementList = async () => {
    // Prevent duplicate requests
    if (isLoadingRef.current) return;
    
    // Prevent too frequent refreshes (minimum 2 seconds between loads)
    const now = Date.now();
    if (now - lastLoadTimeRef.current < 2000) return;
    
    isLoadingRef.current = true;
    lastLoadTimeRef.current = now;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token");
      }

      const { data } = await supplementsAPI.getAll(token);
      
      // Transform backend data to frontend format
      const transformedSupplements: SupplementData[] = data.map((supplement: any) => {
        // Parse times_of_day if it's a string
        let timesOfDay = supplement.times_of_day;
        if (typeof timesOfDay === 'string') {
          try {
            timesOfDay = JSON.parse(timesOfDay);
          } catch {
            timesOfDay = { Morning: [], Afternoon: [], Evening: [] };
          }
        }

        // Convert time strings to Date objects
        const convertedTimesOfDay: { Morning: Date[]; Afternoon: Date[]; Evening: Date[] } = {
          Morning: [],
          Afternoon: [],
          Evening: []
        };

        for (const [period, times] of Object.entries(timesOfDay)) {
          if (Array.isArray(times) && (period === 'Morning' || period === 'Afternoon' || period === 'Evening')) {
            convertedTimesOfDay[period] = times.map((timeStr: string) => {
              try {
                return new Date(timeStr);
              } catch {
                // If parsing fails, create a default time
                const now = new Date();
                const [hours, minutes] = timeStr.split(':').map(Number);
                now.setHours(hours || 8, minutes || 0, 0, 0);
                return now;
              }
            });
          }
        }

        // Parse interactions if it's a string
        let interactions = supplement.interactions;
        if (typeof interactions === 'string') {
          try {
            interactions = JSON.parse(interactions);
          } catch {
            interactions = [];
          }
        }

        return {
          id: supplement.id,
          name: supplement.name,
          brand: supplement.brand,
          dosageForm: supplement.dosage_form,
          dose: {
            quantity: supplement.dose_quantity,
            unit: supplement.dose_unit
          },
          frequency: supplement.frequency,
          timesOfDay: convertedTimesOfDay,
          interactions: Array.isArray(interactions) ? interactions : [],
          remindMe: supplement.remind_me,
          expirationDate: supplement.expiration_date,
          quantity: supplement.quantity,
          image: supplement.image_url
        };
      });
      
      if (isMountedRef.current) {
        setSupplementList(transformedSupplements);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || "Failed to load supplement list");
        setSupplementList([]);
        setIsLoading(false);
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  const refetch = async () => {
    // Only trigger a refresh if we're not already loading and it's been at least 2 seconds
    const now = Date.now();
    if (!isLoadingRef.current && now - lastLoadTimeRef.current >= 2000) {
      setRefreshTrigger(prev => prev + 1);
      // Also immediately reload to ensure fresh data
      await loadSupplementList();
    }
  };

  const deleteSupplementFromList = (supplementId: number) => {
    setSupplementList(prev => prev.filter(supp => supp.id !== supplementId));
  };

  return {
    supplementList,
    isLoading,
    error,
    refetch,
    deleteSupplementFromList
  };
}
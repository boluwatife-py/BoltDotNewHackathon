import { useState, useEffect, useRef } from "react";
import { type SupplementItem, type SupplementLog } from "../types/Supplement";
import { supplementsAPI, supplementLogsAPI } from "../config/api";
import { useAuth } from "../context/AuthContext";

export function useSupplements() {
  const { user } = useAuth();
  const [supplements, setSupplements] = useState<SupplementItem[]>([]);
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
      loadSupplements();
    } else if (!user) {
      setSupplements([]);
      setIsLoading(false);
    }
  }, [user, refreshTrigger]);

  const loadSupplements = async () => {
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
      
      // Load both supplements and today's logs
      const [supplementsResponse, logsResponse] = await Promise.all([
        supplementsAPI.getAll(token),
        supplementLogsAPI.getTodayLogs(token)
      ]);

      const supplementsData = supplementsResponse.data;
      const logsData = logsResponse.data || [];
      
      // Create a map of logs by supplement_id and scheduled_time for quick lookup
      const logsMap = new Map<string, SupplementLog>();
      logsData.forEach((log: SupplementLog) => {
        // The key format should match what we'll use when looking up logs
        // Format: "supplement_id-scheduled_time"
        // Make sure the time format is exactly the same (HH:MM)
        const timeStr = log.scheduled_time.substring(0, 5); // Ensure HH:MM format
        const key = `${log.supplement_id}-${timeStr}`;
        logsMap.set(key, log);
      });
      
      // Transform backend data to frontend format
      const transformedSupplements: SupplementItem[] = [];
      
      supplementsData.forEach((supplement: any) => {
        // Parse times_of_day if it's a string
        let timesOfDay = supplement.times_of_day;
        if (typeof timesOfDay === 'string') {
          try {
            timesOfDay = JSON.parse(timesOfDay);
          } catch {
            timesOfDay = {};
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

        // Generate tags from supplement data
        const tags = [];
        
        // Add frequency as a tag
        if (supplement.frequency) {
          tags.push(`#${supplement.frequency.replace(/\s+/g, '')}`);
        }
        
        // Add interactions as tags (these are user instructions)
        if (interactions && interactions.length > 0) {
          interactions.forEach((interaction: string) => {
            // Format interaction as a tag
            const tagName = interaction.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
            if (tagName) {
              tags.push(`#${tagName}`);
            }
          });
        }

        // Create a supplement item for each scheduled time
        for (const [period, times] of Object.entries(timesOfDay)) {
          if (Array.isArray(times) && times.length > 0 && 
              (period === 'Morning' || period === 'Afternoon' || period === 'Evening')) {
            
            times.forEach((timeStr: string, index: number) => {
              let displayTime = "08:00"; // default
              
              try {
                // Handle different time formats
                if (timeStr.includes('T')) {
                  // ISO format: "2025-06-28T07:00:00.000Z"
                  const timePart = timeStr.split('T')[1];
                  if (timePart) {
                    displayTime = timePart.split('.')[0].substring(0, 5); // Get HH:MM
                  }
                } else if (timeStr.includes(':')) {
                  // Already in HH:MM format
                  displayTime = timeStr.substring(0, 5);
                } else {
                  // Try to parse as Date
                  const date = new Date(timeStr);
                  if (!isNaN(date.getTime())) {
                    displayTime = date.toTimeString().slice(0, 5);
                  }
                }
              } catch (error) {
                // Use default time if parsing fails
              }

              // Check if there's a log for this supplement and time
              // Important: Make sure the key format matches what we used when creating the map
              const logKey = `${supplement.id}-${displayTime}`;
              const log = logsMap.get(logKey);
              
              const isCompleted = log?.status === 'taken';

              // Create unique supplement item with unique ID
              const uniqueId = parseInt(`${supplement.id}${period.charCodeAt(0)}${index}`);
              
              transformedSupplements.push({
                id: uniqueId, // Unique ID for each time slot
                time: displayTime,
                name: supplement.name,
                muted: !supplement.remind_me,
                completed: isCompleted,
                type: mapDosageFormToType(supplement.dosage_form),
                tags, // Now includes frequency and interactions as tags
                alerts: undefined, // No alerts - interactions are now tags
                period: period as 'Morning' | 'Afternoon' | 'Evening', // Add period for filtering
                supplementId: supplement.id, // Store original supplement ID
                logId: log?.id // Store log ID if exists
              });
            });
          }
        }
      });
      
      if (isMountedRef.current) {
        setSupplements(transformedSupplements);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || "Failed to load supplements");
        setSupplements([]);
        setIsLoading(false);
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  const mapDosageFormToType = (dosageForm: string): SupplementItem['type'] => {
    const form = dosageForm?.toLowerCase() || '';
    if (form.includes('gummy')) return 'gummy';
    if (form.includes('liquid')) return 'liquid';
    if (form.includes('powder')) return 'powder';
    if (form.includes('softgel')) return 'softgel';
    if (form.includes('tablet') || form.includes('pill')) return 'tablet';
    return 'default';
  };

  const handleToggleMute = async (id: number) => {
    try {
      // Find the supplement item
      const supplementItem = supplements.find(s => s.id === id);
      if (!supplementItem) return;

      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Update local state immediately for better UX
      setSupplements((prev) =>
        prev.map((item) =>
          item.name === supplementItem.name && !item.completed
            ? { ...item, muted: !item.muted }
            : item
        )
      );

      // Update in backend using the original supplement ID
      await supplementsAPI.update(token, supplementItem.supplementId, {
        remind_me: !supplementItem.muted // If currently muted, enable reminders
      });

    } catch (error) {
      // Revert the optimistic update on error
      loadSupplements();
    }
  };

  const handleToggleCompleted = async (id: number) => {
    try {
      const supplementItem = supplements.find(s => s.id === id);
      if (!supplementItem) {
        return;
      }

      const token = localStorage.getItem('access_token');
      if (!token) {
        return;
      }

      const newCompletedStatus = !supplementItem.completed;
      const newStatus = newCompletedStatus ? 'taken' : 'pending';

      // Update local state immediately for instant UI feedback
      setSupplements((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                completed: newCompletedStatus,
                muted: newCompletedStatus ? true : item.muted, // Mute when completed
              }
            : item
        )
      );

      // Update or create log entry in background
      try {
        let responseData;
        
        if (supplementItem.logId) {
          const response = await supplementLogsAPI.updateLog(token, supplementItem.logId, {
            status: newStatus,
            taken_at: newCompletedStatus ? new Date().toISOString() : undefined
          });
          responseData = response.data;
        } else {
          const response = await supplementLogsAPI.markCompleted(token, {
            supplement_id: supplementItem.supplementId,
            scheduled_time: supplementItem.time,
            status: newStatus
          });
          
          responseData = response.data;
        }
        
        // Update the local state with the log ID
        if (responseData && responseData.id) {
          setSupplements((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    logId: responseData.id
                  }
                : item
            )
          );
        }
        
      } catch (apiError) {
        // Revert the optimistic update on API error
        setSupplements((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  completed: !newCompletedStatus,
                  muted: supplementItem.muted,
                }
              : item
          )
        );
        alert("Failed to update completion status. Please try again.");
      }
      
    } catch (error) {
      alert("Failed to update completion status. Please try again.");
    }
  };

  const refetch = () => {
    // Only trigger a refresh if we're not already loading and it's been at least 2 seconds
    const now = Date.now();
    if (!isLoadingRef.current && now - lastLoadTimeRef.current >= 2000) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return {
    supplements,
    isLoading,
    error,
    handleToggleMute,
    handleToggleCompleted,
    refetch,
  };
}
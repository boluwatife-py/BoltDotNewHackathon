import { useState, useEffect } from "react";
import { type SupplementItem, type SupplementLog } from "../types/Supplement";
import { supplementsAPI, supplementLogsAPI } from "../config/api";
import { useAuth } from "../context/AuthContext";

export function useSupplements() {
  const { user } = useAuth();
  const [supplements, setSupplements] = useState<SupplementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSupplements();
    } else {
      setSupplements([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadSupplements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token");
      }

      console.log('🔄 Loading supplements and logs...');
      
      // Load both supplements and today's logs
      const [supplementsResponse, logsResponse] = await Promise.all([
        supplementsAPI.getAll(token),
        supplementLogsAPI.getTodayLogs(token)
      ]);

      const supplementsData = supplementsResponse.data;
      const logsData = logsResponse.data || [];
      
      console.log("📦 Raw supplement data from API:", supplementsData);
      console.log("📝 Today's logs data:", logsData);
      
      // Create a map of logs by supplement_id and scheduled_time for quick lookup
      const logsMap = new Map<string, SupplementLog>();
      logsData.forEach((log: SupplementLog) => {
        const key = `${log.supplement_id}-${log.scheduled_time}`;
        console.log(`🔑 Creating log map key: ${key}, status: ${log.status}`);
        logsMap.set(key, log);
      });
      
      // Transform backend data to frontend format
      const transformedSupplements: SupplementItem[] = [];
      
      supplementsData.forEach((supplement: any) => {
        console.log(`🔍 Processing supplement: ${supplement.name} (ID: ${supplement.id})`);
        
        // Parse times_of_day if it's a string
        let timesOfDay = supplement.times_of_day;
        if (typeof timesOfDay === 'string') {
          try {
            timesOfDay = JSON.parse(timesOfDay);
            console.log(`⏰ Parsed times_of_day for ${supplement.name}:`, timesOfDay);
          } catch {
            console.warn(`⚠️ Failed to parse times_of_day for ${supplement.name}`);
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
                console.log(`⏱️ Processing time for ${supplement.name} ${period}:`, timeStr);
                
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
                
                console.log(`⏱️ Extracted time for ${supplement.name} ${period}:`, displayTime);
              } catch (error) {
                console.warn(`⚠️ Failed to parse time for ${supplement.name}:`, timeStr, error);
              }

              // Check if there's a log for this supplement and time
              const logKey = `${supplement.id}-${displayTime}`;
              console.log(`🔍 Looking for log with key: ${logKey}`);
              const log = logsMap.get(logKey);
              
              if (log) {
                console.log(`✅ Found log for ${supplement.name} at ${displayTime}, status: ${log.status}`);
              } else {
                console.log(`❌ No log found for ${supplement.name} at ${displayTime}`);
              }
              
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
      
      console.log("🔄 Final transformed supplements:", transformedSupplements);
      setSupplements(transformedSupplements);
      setIsLoading(false);
    } catch (err: any) {
      console.error("❌ Error loading supplements:", err);
      setError(err.message || "Failed to load supplements");
      setSupplements([]);
      setIsLoading(false);
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
      console.log(`🔄 Toggling mute for supplement ID ${supplementItem.supplementId} to ${!supplementItem.muted}`);
      await supplementsAPI.update(token, supplementItem.supplementId, {
        remind_me: !supplementItem.muted // If currently muted, enable reminders
      });
      console.log(`✅ Successfully updated mute status for ${supplementItem.name}`);

    } catch (error) {
      console.error("❌ Error toggling mute:", error);
      // Revert the optimistic update on error
      loadSupplements();
    }
  };

  const handleToggleCompleted = async (id: number) => {
    try {
      const supplementItem = supplements.find(s => s.id === id);
      if (!supplementItem) {
        console.error(`❌ Supplement with ID ${id} not found`);
        return;
      }

      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("❌ No authentication token found");
        return;
      }

      const newCompletedStatus = !supplementItem.completed;
      const newStatus = newCompletedStatus ? 'taken' : 'pending';

      console.log(`🔄 Toggling completion for supplement ${supplementItem.name} (ID: ${supplementItem.supplementId}) at ${supplementItem.time} to ${newStatus}`);
      console.log(`📝 Current log ID: ${supplementItem.logId || 'none'}`);

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
        if (supplementItem.logId) {
          console.log(`🔄 Updating existing log ${supplementItem.logId}`);
          const response = await supplementLogsAPI.updateLog(token, supplementItem.logId, {
            status: newStatus,
            taken_at: newCompletedStatus ? new Date().toISOString() : undefined
          });
          console.log(`✅ Log updated successfully:`, response.data);
        } else {
          console.log(`🔄 Creating new log for supplement ${supplementItem.supplementId} at ${supplementItem.time}`);
          const response = await supplementLogsAPI.markCompleted(token, {
            supplement_id: supplementItem.supplementId,
            scheduled_time: supplementItem.time,
            status: newStatus
          });
          
          console.log(`✅ New log created:`, response.data);
          
          // Update the local state with the new log ID
          if (response.data && response.data.id) {
            console.log(`📝 Storing new log ID: ${response.data.id}`);
            setSupplements((prev) =>
              prev.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      logId: response.data.id
                    }
                  : item
              )
            );
          }
        }

        console.log(`✅ Successfully updated completion status for ${supplementItem.name}`);
        
        // Refresh data in background to sync with server
        setTimeout(() => {
          console.log(`🔄 Refreshing data after completion toggle`);
          loadSupplements();
        }, 1000);
        
      } catch (apiError) {
        console.error("❌ Error updating completion status:", apiError);
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
      console.error("❌ Error toggling completion:", error);
      alert("Failed to update completion status. Please try again.");
    }
  };

  const refetch = () => {
    console.log(`🔄 Manual refetch triggered`);
    loadSupplements();
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
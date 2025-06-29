import { useState, useEffect } from "react";
import { type SupplementItem } from "../types/Supplement";
import { supplementsAPI } from "../config/api";
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

      const { data } = await supplementsAPI.getAll(token);
      console.log("Raw supplement data from API:", data);
      
      // Transform backend data to frontend format
      const transformedSupplements: SupplementItem[] = [];
      
      data.forEach((supplement: any) => {
        console.log(`Processing supplement: ${supplement.name}`);
        
        // Parse times_of_day if it's a string
        let timesOfDay = supplement.times_of_day;
        if (typeof timesOfDay === 'string') {
          try {
            timesOfDay = JSON.parse(timesOfDay);
            console.log(`Parsed times_of_day for ${supplement.name}:`, timesOfDay);
          } catch {
            console.warn(`Failed to parse times_of_day for ${supplement.name}`);
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
                console.log(`Processing time for ${supplement.name} ${period}:`, timeStr);
                
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
                
                console.log(`Extracted time for ${supplement.name} ${period}:`, displayTime);
              } catch (error) {
                console.warn(`Failed to parse time for ${supplement.name}:`, timeStr, error);
              }

              // Create unique supplement item with unique ID
              const uniqueId = parseInt(`${supplement.id}${period.charCodeAt(0)}${index}`);
              
              transformedSupplements.push({
                id: uniqueId, // Unique ID for each time slot
                time: displayTime,
                name: supplement.name,
                muted: !supplement.remind_me,
                completed: false, // Each time slot has its own completion state
                type: mapDosageFormToType(supplement.dosage_form),
                tags, // Now includes frequency and interactions as tags
                alerts: undefined, // No alerts - interactions are now tags
                period: period as 'Morning' | 'Afternoon' | 'Evening' // Add period for filtering
              });
            });
          }
        }
      });
      
      console.log("Final transformed supplements:", transformedSupplements);
      setSupplements(transformedSupplements);
    } catch (err: any) {
      console.error("Error loading supplements:", err);
      setError(err.message || "Failed to load supplements");
      setSupplements([]);
    } finally {
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

      // Extract original supplement ID from the unique ID
      const originalSupplementId = Math.floor(id / 1000); // Rough extraction
      
      // Find the original supplement ID more accurately
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const { data } = await supplementsAPI.getAll(token);
      const originalSupplement = data.find((s: any) => supplementItem.name === s.name);
      
      if (!originalSupplement) return;

      // Update in backend
      await supplementsAPI.update(token, originalSupplement.id, {
        remind_me: supplementItem.muted // If currently muted, enable reminders
      });

      // Update local state for all instances of this supplement
      setSupplements((prev) =>
        prev.map((item) =>
          item.name === supplementItem.name && !item.completed
            ? { ...item, muted: !item.muted }
            : item
        )
      );
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  const handleToggleCompleted = async (id: number) => {
    // Update only the specific supplement item (unique time slot)
    setSupplements((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
              muted: !item.completed ? true : item.muted, // Mute when completed
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
    refetch: loadSupplements,
  };
}
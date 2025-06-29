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
      
      // Transform backend data to frontend format
      const transformedSupplements: SupplementItem[] = data.map((supplement: any) => {
        console.log("Processing supplement:", supplement.name);
        console.log("Raw times_of_day:", supplement.times_of_day);
        
        // Parse times_of_day if it's a string
        let timesOfDay = supplement.times_of_day;
        if (typeof timesOfDay === 'string') {
          try {
            timesOfDay = JSON.parse(timesOfDay);
            console.log("Parsed times_of_day:", timesOfDay);
          } catch {
            console.warn("Failed to parse times_of_day, using empty object");
            timesOfDay = {};
          }
        }

        // Extract the first available time for display
        let displayTime = "08:00"; // default
        
        // Check each period for available times
        for (const period of ['Morning', 'Afternoon', 'Evening']) {
          const times = timesOfDay[period];
          if (times && Array.isArray(times) && times.length > 0) {
            try {
              // Handle ISO string format: "2025-06-28T07:00:00.000Z"
              const timeString = times[0];
              console.log(`Processing ${period} time:`, timeString);
              
              if (typeof timeString === 'string') {
                // If it's an ISO string, extract the time part
                if (timeString.includes('T')) {
                  const timePart = timeString.split('T')[1]; // Get "07:00:00.000Z"
                  const timeOnly = timePart.split('.')[0]; // Get "07:00:00"
                  displayTime = timeOnly.substring(0, 5); // Get "07:00"
                  console.log(`Extracted time for ${period}:`, displayTime);
                  break;
                } else {
                  // If it's already in HH:MM format
                  displayTime = timeString.substring(0, 5);
                  console.log(`Using direct time for ${period}:`, displayTime);
                  break;
                }
              } else if (timeString instanceof Date) {
                // If it's a Date object
                displayTime = timeString.toTimeString().slice(0, 5);
                console.log(`Converted Date to time for ${period}:`, displayTime);
                break;
              }
            } catch (error) {
              console.warn(`Error processing time for ${period}:`, error);
              // Continue to next period
            }
          }
        }

        console.log(`Final display time for ${supplement.name}:`, displayTime);

        // Parse interactions if it's a string
        let interactions = supplement.interactions;
        if (typeof interactions === 'string') {
          try {
            interactions = JSON.parse(interactions);
            console.log("Parsed interactions:", interactions);
          } catch {
            console.warn("Failed to parse interactions, using empty array");
            interactions = [];
          }
        }

        // Ensure interactions is an array
        if (!Array.isArray(interactions)) {
          console.warn("Interactions is not an array, using empty array");
          interactions = [];
        }

        // Generate tags from supplement data
        const tags = [];
        
        // Add frequency as a tag
        if (supplement.frequency) {
          tags.push(`#${supplement.frequency.replace(/\s+/g, '')}`);
        }
        
        // Add dosage form as a tag
        if (supplement.dosage_form) {
          tags.push(`#${supplement.dosage_form}`);
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

        console.log(`Generated tags for ${supplement.name}:`, tags);

        return {
          id: supplement.id,
          time: displayTime,
          name: supplement.name,
          muted: !supplement.remind_me,
          completed: false, // This would come from supplement logs in a real implementation
          type: mapDosageFormToType(supplement.dosage_form),
          tags, // Now includes frequency, dosage form, and interactions as tags
          alerts: undefined // No alerts - interactions are now tags
        };
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
      const supplement = supplements.find(s => s.id === id);
      if (!supplement) return;

      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Update in backend
      await supplementsAPI.update(token, id, {
        remind_me: supplement.muted // If currently muted, enable reminders
      });

      // Update local state
      setSupplements((prev) =>
        prev.map((item) =>
          item.id === id && !item.completed
            ? { ...item, muted: !item.muted }
            : item
        )
      );
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  const handleToggleCompleted = async (id: number) => {
    // For now, just update local state
    // In a full implementation, this would create/update supplement logs
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
    refetch: loadSupplements,
  };
}
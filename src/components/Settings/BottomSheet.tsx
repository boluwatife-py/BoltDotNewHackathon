import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";
import { type SupplementData } from "../../types/FormData";
import { supplementsAPI } from "../../config/api";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  supplement: SupplementData | null;
  onSupplementDeleted?: () => void; // Add callback for deletion
}

export default function BottomSheet({ isOpen, onClose, supplement, onSupplementDeleted }: BottomSheetProps) {
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseEnd);
      };
    }
  }, [isDragging, startY, translateY]);

  // Reset states when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setShowDeleteConfirm(false);
      setIsDeleting(false);
      setIsLoading(false);
      setIsDragging(false);
      setTranslateY(0);
      setStartY(0);
    }
  }, [isOpen]);

  // Move the early return after all hooks are declared
  if (!isOpen || !supplement) return null;

  // Calculate background opacity based on drag position
  const getBackgroundOpacity = () => {
    if (!isDragging || translateY <= 0) return 0.5;
    
    // Fade out as the sheet is dragged down
    // At 0px drag = 0.5 opacity, at 200px drag = 0 opacity
    const maxDrag = 200;
    const minOpacity = 0;
    const maxOpacity = 0.5;
    
    const progress = Math.min(translateY / maxDrag, 1);
    return maxOpacity - (progress * (maxOpacity - minOpacity));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // If dragged down more than 100px, close the sheet
    if (translateY > 100) {
      onClose();
    }
    
    // Reset position
    setTranslateY(0);
    setStartY(0);
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const mouseY = e.clientY;
    const deltaY = mouseY - startY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleMouseEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // If dragged down more than 100px, close the sheet
    if (translateY > 100) {
      onClose();
    }
    
    // Reset position
    setTranslateY(0);
    setStartY(0);
  };

  const handleDeleteSupplement = async () => {
    if (!supplement || isDeleting) return;

    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token");
      }

      console.log(`Deleting supplement with ID: ${supplement.id}`);
      await supplementsAPI.delete(token, supplement.id);
      console.log('Supplement deleted successfully from backend');
      
      // Close the bottom sheet immediately
      onClose();
      
      // Small delay to ensure UI updates smoothly
      setTimeout(() => {
        if (onSupplementDeleted) {
          console.log('Calling onSupplementDeleted callback');
          onSupplementDeleted();
        }
      }, 100);
      
    } catch (error: any) {
      console.error("Error deleting supplement:", error);
      alert(`Failed to delete supplement: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditDetails = async () => {
    setIsLoading(true);
    
    // Simulate loading time for data preparation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Define the fixed interaction categories
    const fixedCategories = [
      { key: "food", text: "With food" },
      { key: "empty", text: "On empty stomach" },
      { key: "alcohol", text: "Avoid alcohol" },
      { key: "dairy", text: "Avoid dairy" }
    ];

    // Check which fixed interactions are present
    const fixedInteractions = [
      { text: "With food", checked: supplement.interactions.some(i => 
        i.toLowerCase().includes('food') && !i.toLowerCase().includes('empty')
      )},
      { text: "On empty stomach", checked: supplement.interactions.some(i => 
        i.toLowerCase().includes('empty')
      )},
      { text: "Avoid alcohol", checked: supplement.interactions.some(i => 
        i.toLowerCase().includes('alcohol')
      )},
      { text: "Avoid dairy", checked: supplement.interactions.some(i => 
        i.toLowerCase().includes('dairy')
      )},
    ];

    // Find custom interactions (those that don't match fixed categories)
    const customInteractions = supplement.interactions
      .filter(interaction => {
        const lowerInteraction = interaction.toLowerCase();
        return !fixedCategories.some(category => {
          switch(category.key) {
            case "food":
              return lowerInteraction.includes('food') && !lowerInteraction.includes('empty');
            case "empty":
              return lowerInteraction.includes('empty');
            case "alcohol":
              return lowerInteraction.includes('alcohol');
            case "dairy":
              return lowerInteraction.includes('dairy');
            default:
              return false;
          }
        });
      })
      .map(i => ({ text: i, checked: true }));

    // Set "Other" to checked if there are custom interactions
    const hasCustomInteractions = customInteractions.length > 0;
    fixedInteractions.push({ text: "Other", checked: hasCustomInteractions });

    const interactions = {
      fixedInteractions,
      customInteractions
    };

    // Create the form data object that matches FormData type
    const formData = {
      supplementName: supplement.name,
      dosageForm: supplement.dosageForm,
      brandName: supplement.brand,
      dose: supplement.dose,
      frequency: supplement.frequency,
      timesOfDay: supplement.timesOfDay,
      interactions,
      remindMe: supplement.remindMe
    };

    setIsLoading(false);

    // Navigate to manual entry with state
    navigate('/scan/manual', { 
      state: { 
        editMode: true, 
        supplementData: formData,
        supplementId: supplement.id
      } 
    });
  };

  // Helper function to format times of day for display
  const formatTimesOfDay = () => {
    const periods = [];
    
    if (supplement.timesOfDay.Morning.length > 0) {
      periods.push("Morning");
    }
    if (supplement.timesOfDay.Afternoon.length > 0) {
      periods.push("Afternoon");
    }
    if (supplement.timesOfDay.Evening.length > 0) {
      periods.push("Evening");
    }
    
    return periods.join(", ");
  };

  return (
    <>
      {/* Background overlay with dynamic opacity */}
      <div
        className="fixed inset-0 bg-black z-40 transition-opacity"
        style={{
          opacity: isDragging ? getBackgroundOpacity() : 0.5,
          transition: isDragging ? 'none' : 'opacity 0.3s ease-out'
        }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-[3.5rem] left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          transform: `translateY(${isDragging ? translateY : 0}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Drag handle */}
        <div 
          className="w-[2.375rem] h-[5px] bg-[#CCC] rounded mx-auto mb-4 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseStart}
        />

        {isLoading ? (
          <div className="py-8">
            <LoadingSpinner text="Preparing supplement details..." />
          </div>
        ) : showDeleteConfirm ? (
          /* Delete Confirmation */
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Delete Supplement?
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Are you sure you want to delete <strong>{supplement.name}</strong>? 
                This action cannot be undone and will remove all associated data.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDeleteSupplement}
                disabled={isDeleting}
                className={`w-full py-3 px-4 rounded-xl font-medium text-center transition-colors ${
                  isDeleting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  "Yes, Delete Supplement"
                )}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="w-full py-3 px-4 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center hover:bg-[var(--primary-light)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Supplement Details */}
            <div className="space-y-4">
              {/* Supplement Image and Name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-lg bg-orange-200 bg-center bg-cover flex-shrink-0"
                  style={{ backgroundImage: supplement.image ? `url(${supplement.image})` : 'none' }}
                >
                  {!supplement.image && (
                    <div className="w-full h-full bg-orange-200 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 text-2xl">💊</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-[var(--text-primary)] font-medium text-[1.25rem]">{supplement.name}</h2>
                  <p className="text-sm text-gray-500">{supplement.quantity}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-4">
                {/* Dosage Form */}
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-semibold text-[1.0625rem]">Dosage Form</span>
                  <span className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-3 py-1">
                    {supplement.dosageForm}
                  </span>
                </div>

                {/* Brand */}
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-semibold text-[1.0625rem]">Brand</span>
                  <span className="text-gray-900">{supplement.brand}</span>
                </div>

                {/* Dose */}
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-semibold text-[1.0625rem]">Dose</span>
                  <span className="text-gray-900">{supplement.dose.quantity} {supplement.dose.unit}</span>
                </div>

                {/* Frequency */}
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-semibold text-[1.0625rem]">Frequency</span>
                  <span className="text-gray-900">{supplement.frequency}</span>
                </div>

                {/* Time of the day */}
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-primary)] font-semibold text-[1.0625rem]">Time of the day</span>
                  <div className="flex gap-2">
                    {formatTimesOfDay().split(', ').map((time, index) => (
                      <span
                        key={index}
                        className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-3 py-1"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactions */}
                {supplement.interactions.length > 0 && (
                  <div className="flex justify-between items-start">
                    <span className="text-[var(--text-primary)] font-semibold text-[1.0625rem]">Interactions</span>
                    <div className="flex gap-2 flex-wrap max-w-[60%]">
                      {supplement.interactions.map((interaction, index) => (
                        <span
                          key={index}
                          className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-3 py-1"
                        >
                          {interaction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {supplement.interactions.length === 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-primary)] font-semibold text-[1.0625rem]">Interactions</span>
                    <span className="text-gray-500 text-sm">None</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <button
                  className="w-full border border-[var(--primary-color)] rounded-[0.75rem] py-[1rem] px-[1.25rem] text-center font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={handleEditDetails}
                  disabled={isLoading}
                >
                  Edit Details
                </button>

                <button
                  className="w-full border border-red-500 rounded-[0.75rem] py-[1rem] px-[1.25rem] text-center font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  Delete Supplement
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
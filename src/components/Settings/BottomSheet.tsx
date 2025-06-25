import { useRef, useEffect, useState } from "react";
import { type Supplement } from "../../types/Supplement";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  supplement: Supplement | null;
}

export default function BottomSheet({ isOpen, onClose, supplement }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [translateY, setTranslateY] = useState(0);

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
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setCurrentY(touchY);
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
    setCurrentY(0);
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const mouseY = e.clientY;
    const deltaY = mouseY - startY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setCurrentY(mouseY);
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
    setCurrentY(0);
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
              <h2 className="text-xl font-semibold text-gray-900">{supplement.name}</h2>
              <p className="text-sm text-gray-500">{supplement.qty}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            {/* Dosage Form */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Dosage Form</span>
              <span className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-3 py-1">
                {supplement.type}
              </span>
            </div>

            {/* Brand */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Brand</span>
              <span className="text-gray-900">{supplement.brand}</span>
            </div>

            {/* Dose */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Dose</span>
              <span className="text-gray-900">{supplement.dose}</span>
            </div>

            {/* Frequency */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Frequency</span>
              <span className="text-gray-900">{supplement.freqency}</span>
            </div>

            {/* Time of the day */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Time of the day</span>
              <div className="flex gap-2">
                {supplement.tod.split(', ').map((time, index) => (
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
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Interactions</span>
              <div className="flex gap-2">
                {supplement.iteractions === "None" ? (
                  <span className="text-gray-500 text-sm">None</span>
                ) : (
                  supplement.iteractions.split(', ').map((interaction, index) => (
                    <span
                      key={index}
                      className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-3 py-1"
                    >
                      {interaction}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            className="w-full mt-6 border border-[var(--text-primary)] rounded-lg py-3 text-center font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Edit Details
          </button>
        </div>
      </div>
    </>
  );
}
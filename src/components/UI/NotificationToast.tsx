import React, { useEffect, useState } from 'react';
import { X, Clock, AlertTriangle, Pill } from 'lucide-react';
import { type SupplementItem } from '../../types/Supplement';

interface NotificationToastProps {
  isVisible: boolean;
  onClose: () => void;
  supplement: SupplementItem;
  type: 'due' | 'missed';
  onMarkCompleted?: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  isVisible,
  onClose,
  supplement,
  type,
  onMarkCompleted,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-dismiss after 10 seconds for due notifications, 15 seconds for missed
      const timeout = setTimeout(() => {
        handleClose();
      }, type === 'due' ? 10000 : 15000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, type]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleMarkCompleted = () => {
    onMarkCompleted?.();
    handleClose();
  };

  if (!isVisible) return null;

  const isDue = type === 'due';
  const bgColor = isDue ? 'bg-[var(--primary-color)]' : 'bg-orange-500';
  const icon = isDue ? <Clock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />;
  const title = isDue ? 'Time for your supplement!' : 'Supplement missed';
  const message = isDue 
    ? `It's time to take your ${supplement.name}`
    : `You missed your ${supplement.name} at ${supplement.time}`;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div
        className={`${bgColor} text-white rounded-xl shadow-lg p-4 transform transition-all duration-300 ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm">{title}</h4>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-white/90 text-sm mb-3">{message}</p>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-white/20 px-2 py-1 rounded-full">
                {supplement.time}
              </span>
              {supplement.tags.map((tag, index) => (
                <span key={index} className="bg-white/20 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            {isDue && onMarkCompleted && (
              <button
                onClick={handleMarkCompleted}
                className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Pill className="w-4 h-4" />
                Mark as Taken
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
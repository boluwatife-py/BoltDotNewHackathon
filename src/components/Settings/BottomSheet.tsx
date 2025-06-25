import { X } from "lucide-react";
import { type Supplement } from "../../types/Supplement";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  supplement: Supplement | null;
}

export default function BottomSheet({ isOpen, onClose, supplement }: BottomSheetProps) {
  if (!isOpen || !supplement) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="w-16 h-1 bg-gray-300 rounded mx-auto mb-4" />

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

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
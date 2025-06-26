import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";

export default function ScanFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { image, attempts = 1 } = location.state || {};

  const handleScanAgain = () => {
    navigate("/scan/byscan");
  };

  const handleEnterManually = () => {
    navigate("/scan/manual");
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[var(--border-dark)] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-[var(--border-grey)]">
        <div className="flex items-center justify-between">
          <h1 className="text-[1.5rem] font-bold text-[var(--text-primary)]">Add Supplement</h1>
          <button
            onClick={handleClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-center text-orange-600 font-medium mt-2">Scan Failed</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Scanned Image */}
        {image && (
          <div className="border-2 border-[var(--primary-color)] rounded-lg overflow-hidden mb-6 max-w-sm">
            <img 
              src={image} 
              alt="Scanned supplement" 
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Error Message */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            We couldn't find a match for this supplement.
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Please try again or enter the details manually.
          </p>
          {attempts > 1 && (
            <p className="text-orange-600 text-xs mt-2">
              Attempt {attempts} - Try different lighting or angle
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleScanAgain}
            className="w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors"
          >
            Scan Again
          </button>
          
          <button
            onClick={handleEnterManually}
            className="w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium hover:bg-[var(--primary-light)] transition-colors"
          >
            Enter Supplement Manually
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
          <h3 className="font-medium text-blue-800 mb-2">📸 Scanning Tips:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Ensure good lighting</li>
            <li>• Hold camera steady</li>
            <li>• Keep label flat and visible</li>
            <li>• Avoid shadows and glare</li>
            <li>• Try different angles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
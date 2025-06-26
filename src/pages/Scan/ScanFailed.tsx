import { useNavigate, useLocation } from "react-router-dom";
import { X, Camera, Zap } from "lucide-react";

export default function ScanFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { comingSoon = false } = location.state || {};

  const handleScanAgain = () => {
    navigate("/scan/byscan");
  };

  const handleEnterManually = () => {
    navigate("/scan/manual");
  };

  const handleClose = () => {
    navigate("/");
  };

  if (comingSoon) {
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
        </div>

        {/* Coming Soon Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-[var(--primary-light)] rounded-full flex items-center justify-center mb-6">
            <div className="relative">
              <Camera className="w-10 h-10 text-[var(--primary-color)]" />
              <div className="absolute -top-1 -right-1">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
              AI Scanning Coming Soon! 🚀
            </h2>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-sm">
              We're working on advanced AI technology to automatically scan and identify your supplements. 
              This feature will be available in a future update!
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 max-w-sm">
            <h3 className="font-semibold text-blue-800 mb-3 text-center">🔮 What's Coming:</h3>
            <ul className="text-blue-700 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Instant supplement recognition
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Automatic dosage detection
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Brand and strength identification
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Smart scheduling suggestions
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={handleEnterManually}
              className="w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors"
            >
              Enter Supplement Manually
            </button>
            
            <button
              onClick={handleClose}
              className="w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium hover:bg-[var(--primary-light)] transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              For now, you can manually enter your supplement details.<br />
              We'll notify you when AI scanning is available! 📱
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Original scan failed content (kept for potential future use)
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
        {/* Error Message */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            We couldn't find a match for this supplement.
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Please try again or enter the details manually.
          </p>
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
      </div>
    </div>
  );
}
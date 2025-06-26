import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Database, Shield, Eye, EyeOff, Info } from "lucide-react";
import Toggle from "../../components/UI/Toggle";

const DataPrivacy: React.FC = () => {
  const [aiDataSharing, setAiDataSharing] = useState(true);
  const [analyticsSharing, setAnalyticsSharing] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const handleAiDataSharingChange = (enabled: boolean) => {
    setAiDataSharing(enabled);
    // In a real app, this would update the user's preferences in the backend
    console.log("AI data sharing:", enabled);
  };

  const handleAnalyticsSharingChange = (enabled: boolean) => {
    setAnalyticsSharing(enabled);
    // In a real app, this would update the user's preferences in the backend
    console.log("Analytics sharing:", enabled);
  };

  return (
    <div className="min-h-screen bg-[var(--border-dark)]">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-[var(--border-grey)]">
        <div className="flex items-center">
          <Link
            to="/settings"
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-[1.5rem] font-bold text-[var(--text-primary)]">Privacy & Data Settings</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Privacy Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--primary-color)]" />
              Your Privacy Matters
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We believe you should have control over your personal data. Use these settings to manage 
              how your information is used to improve your SafeDoser experience while maintaining your privacy.
            </p>
          </div>

          {/* AI Data Sharing */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[var(--primary-color)]" />
                  AI Assistant Data Sharing
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Allow SafeDoser to share your health information with our AI service to provide 
                  personalized medication guidance and recommendations.
                </p>
              </div>
              <div className="ml-4">
                <Toggle
                  checked={aiDataSharing}
                  onChange={handleAiDataSharingChange}
                />
              </div>
            </div>

            {/* AI Data Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">What data is shared with AI:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Your name and age (for personalized recommendations)</li>
                <li>• Your supplement and medication list</li>
                <li>• Your questions and chat messages</li>
                <li>• Medication timing and adherence patterns</li>
              </ul>
              <p className="text-blue-700 text-xs mt-3">
                <strong>Note:</strong> Disabling this will limit the AI's ability to provide personalized guidance 
                but you can still use basic app features.
              </p>
            </div>
          </div>

          {/* Analytics and Usage Data */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5 text-[var(--primary-color)]" />
                  Usage Analytics
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Help us improve SafeDoser by sharing anonymous usage data and app performance metrics.
                </p>
              </div>
              <div className="ml-4">
                <Toggle
                  checked={analyticsSharing}
                  onChange={handleAnalyticsSharingChange}
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Analytics data includes:</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• App usage patterns and feature interactions</li>
                <li>• Performance metrics and error reports</li>
                <li>• Device information (anonymized)</li>
                <li>• General usage statistics</li>
              </ul>
              <p className="text-green-700 text-xs mt-3">
                <strong>Privacy:</strong> All analytics data is anonymized and cannot be traced back to you personally.
              </p>
            </div>
          </div>

          {/* Data Details Toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Info className="w-5 h-5 text-[var(--primary-color)]" />
                Data Collection Details
              </h3>
              {showDetails ? (
                <EyeOff className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Eye className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>

            {showDetails && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Account Information</h4>
                  <ul className="text-[var(--text-secondary)] text-sm space-y-1">
                    <li>• Name, email address, and age</li>
                    <li>• Profile picture (optional)</li>
                    <li>• Account preferences and settings</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Health Information</h4>
                  <ul className="text-[var(--text-secondary)] text-sm space-y-1">
                    <li>• Supplement and medication details</li>
                    <li>• Dosage schedules and adherence data</li>
                    <li>• Health-related questions and AI interactions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Technical Information</h4>
                  <ul className="text-[var(--text-secondary)] text-sm space-y-1">
                    <li>• Device type and operating system</li>
                    <li>• App version and performance data</li>
                    <li>• Error logs and crash reports</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Data Rights */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Your Data Rights</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border-dark)] transition-colors">
                <span className="text-[var(--text-primary)]">Download My Data</span>
                <button className="text-[var(--primary-color)] text-sm font-medium">Request</button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border-dark)] transition-colors">
                <span className="text-[var(--text-primary)]">Delete My Account</span>
                <button className="text-red-500 text-sm font-medium">Delete</button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border-dark)] transition-colors">
                <span className="text-[var(--text-primary)]">Clear Chat History</span>
                <button className="text-[var(--primary-color)] text-sm font-medium">Clear</button>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Privacy Information</h3>
            <div className="space-y-3">
              <Link
                to="/privacy"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border-dark)] transition-colors"
              >
                <span className="text-[var(--text-primary)]">Privacy Policy</span>
                <span className="text-[var(--text-secondary)] text-sm">View Details</span>
              </Link>
              
              <Link
                to="/terms"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border-dark)] transition-colors"
              >
                <span className="text-[var(--text-primary)]">Terms and Conditions</span>
                <span className="text-[var(--text-secondary)] text-sm">View Details</span>
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 text-sm leading-relaxed">
              <strong>Important:</strong> Changes to these settings may affect the quality of personalized 
              recommendations and app functionality. You can always update these preferences later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
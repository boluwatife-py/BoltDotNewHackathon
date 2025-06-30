import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";
import { authAPI } from "../../config/api";

const VerificationSent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Get email and status from location state
  const email = location.state?.email;
  const emailSent = location.state?.emailSent;
  const emailMessage = location.state?.emailMessage;

  // If no email in state, redirect to signup
  if (!email) {
    navigate("/auth/signup", { replace: true });
    return null;
  }

  const handleResendVerification = async () => {
    if (isResending) return;
    
    setIsResending(true);
    setResendStatus(null);
    
    try {
      const { data } = await authAPI.resendVerification(email);
      
      if (data.email_sent) {
        setResendStatus({
          success: true,
          message: "Verification email sent successfully! Please check your inbox."
        });
      } else {
        setResendStatus({
          success: false,
          message: `Failed to send verification email: ${data.reason || "Unknown error"}`
        });
      }
    } catch (error: any) {
      console.error("Resend verification error:", error);
      
      setResendStatus({
        success: false,
        message: error.message || "Failed to send verification email"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--border-dark)] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-6 text-center border-b border-[var(--border-grey)]">
        <h1 className="text-[2rem] font-bold text-[var(--primary-color)]">SafeDoser</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-4">Verify Your Email</h2>
          
          <p className="text-[var(--text-secondary)] mb-2">
            We've sent a verification email to:
          </p>
          <p className="text-[var(--text-primary)] font-medium mb-6">{email}</p>
          
          {/* Email Status */}
          {emailSent === false && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <p className="text-yellow-800 text-sm font-medium">Email Delivery Issue</p>
              </div>
              <p className="text-yellow-700 text-sm">
                {emailMessage || "There was an issue sending the verification email. Please try resending."}
              </p>
            </div>
          )}
          
          {/* Resend Status */}
          {resendStatus && (
            <div className={`${
              resendStatus.success 
                ? "bg-green-50 border-green-200 text-green-700" 
                : "bg-red-50 border-red-200 text-red-700"
              } border rounded-lg p-4 mb-6 text-left`}
            >
              <div className="flex items-center gap-2 mb-2">
                {resendStatus.success 
                  ? <CheckCircle className="w-4 h-4 text-green-600" />
                  : <AlertCircle className="w-4 h-4 text-red-600" />
                }
                <p className={`${
                  resendStatus.success ? "text-green-800" : "text-red-800"
                } text-sm font-medium`}>
                  {resendStatus.success ? "Email Sent!" : "Email Delivery Issue"}
                </p>
              </div>
              <p className="text-sm">
                {resendStatus.message}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-800">What to do next:</h3>
            </div>
            <ul className="text-blue-700 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">1.</span>
                <span>Check your email inbox for a message from SafeDoser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">2.</span>
                <span>Click the "Verify Email" button in the email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">3.</span>
                <span>Once verified, you can sign in to your account</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className={`w-full px-6 py-3 rounded-xl font-medium text-center transition-colors ${
                isResending
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)]"
              }`}
            >
              {isResending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  <span>Resend Verification Email</span>
                </div>
              )}
            </button>
            
            <Link
              to="/auth/login"
              className="block w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center hover:bg-[var(--primary-light)] transition-colors"
            >
              Back to Sign In
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Didn't receive the email?</h4>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Try clicking the resend button above</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSent;
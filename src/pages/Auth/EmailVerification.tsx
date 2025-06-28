import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, RefreshCcw, Mail } from "lucide-react";
import { authAPI } from "../../config/api";

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "expired">("verifying");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const hasVerified = useRef(false); // Prevent duplicate verification attempts

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    // Only verify if we haven't already attempted verification
    if (token && email && !hasVerified.current) {
      hasVerified.current = true; // Mark as attempted
      verifyEmail();
    } else if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token, email]); // Remove verifyEmail from dependencies to prevent re-runs

  const verifyEmail = async () => {
    try {
      await authAPI.verifyEmail(email!, token!);
      
      setStatus("success");
      setMessage("Your email has been verified successfully!");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth/login", { 
          state: { message: "Email verified! You can now sign in." }
        });
      }, 3000);
    } catch (error: any) {
      console.error("Verification error:", error);
      
      if (error.message?.includes("expired")) {
        setStatus("expired");
        setMessage("This verification link has expired. Please request a new one.");
      } else if (error.message?.includes("Invalid") || error.message?.includes("already")) {
        setStatus("error");
        setMessage("This verification link is invalid or has already been used.");
      } else {
        setStatus("error");
        setMessage(error.message || "Verification failed");
      }
    }
  };

  const resendVerification = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    try {
      await authAPI.resendVerification(email);
      
      setMessage("A new verification email has been sent to your inbox.");
      setStatus("success");
    } catch (error: any) {
      console.error("Resend error:", error);
      setMessage(error.message || "Failed to resend verification email");
      setStatus("error");
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "verifying":
        return (
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      case "success":
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        );
      case "error":
      case "expired":
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "verifying":
        return "Verifying Your Email...";
      case "success":
        return "Email Verified!";
      case "error":
        return "Verification Failed";
      case "expired":
        return "Link Expired";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verifying":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "error":
      case "expired":
        return "text-red-600";
      default:
        return "text-gray-600";
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
          {getStatusIcon()}
          
          <h2 className={`text-[1.75rem] font-bold mb-4 ${getStatusColor()}`}>
            {getStatusTitle()}
          </h2>
          
          <p className="text-[var(--text-secondary)] mb-6">
            {message}
          </p>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm">
                🎉 Welcome to SafeDoser! You'll be redirected to the login page in a few seconds.
              </p>
            </div>
          )}

          {status === "expired" && email && (
            <div className="space-y-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-yellow-600" />
                  <p className="text-yellow-700 text-sm font-medium">Need a new verification link?</p>
                </div>
                <p className="text-yellow-700 text-sm">
                  We can send a fresh verification email to <strong>{email}</strong>
                </p>
              </div>
              
              <button
                onClick={resendVerification}
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
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Resend Verification Email
                  </div>
                )}
              </button>
            </div>
          )}

          <div className="space-y-4">
            <Link
              to="/auth/login"
              className="block w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium text-center hover:bg-[var(--primary-dark)] transition-colors"
            >
              Go to Sign In
            </Link>
            
            {status === "error" && (
              <button
                onClick={() => {
                  // Reset state and try again
                  hasVerified.current = false;
                  setStatus("verifying");
                  setMessage("");
                  verifyEmail();
                }}
                className="block w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center hover:bg-[var(--primary-light)] transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
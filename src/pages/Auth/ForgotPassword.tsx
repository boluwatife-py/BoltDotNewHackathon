import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { ArrowLeft, CheckCircle, Mail, Clock, Shield } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Always show success for security (don't reveal if email exists)
      setIsSuccess(true);
      
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError("");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--border-dark)] flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-6 text-center border-b border-[var(--border-grey)]">
          <h1 className="text-[2rem] font-bold text-[var(--primary-color)]">SafeDoser</h1>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="max-w-sm mx-auto w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-4">Check Your Email</h2>
            
            <p className="text-[var(--text-secondary)] mb-2">
              If an account with that email exists, we've sent a password reset link to:
            </p>
            <p className="text-[var(--text-primary)] font-medium mb-6">{email}</p>
            
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
                  <span>Click the "Reset Password" button in the email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">3.</span>
                  <span>Create your new password on the secure page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">4.</span>
                  <span>Sign in with your new password</span>
                </li>
              </ul>
            </div>

            {/* Security & Timing Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock className="w-4 h-4" />
                <span>Reset link expires in 1 hour</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
                <Shield className="w-4 h-4" />
                <span>Check your spam folder if you don't see the email</span>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to="/auth/login"
                className="block w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium text-center hover:bg-[var(--primary-dark)] transition-colors"
              >
                Back to Sign In
              </Link>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                className="block w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center hover:bg-[var(--primary-light)] transition-colors"
              >
                Try Different Email
              </button>
            </div>

            {/* Didn't receive email section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-[var(--text-primary)] mb-2">Didn't receive the email?</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                It may take a few minutes to arrive. If you still don't see it:
              </p>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1 text-left">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Try requesting another reset link</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--border-dark)] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-[var(--border-grey)]">
        <div className="flex items-center">
          <Link
            to="/auth/login"
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-[1.5rem] font-bold text-[var(--primary-color)]">SafeDoser</h1>
          </div>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-2">Reset Password</h2>
            <p className="text-[var(--text-secondary)]">
              Enter your email address and we'll send you a secure link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Email Address
              </label>
              <InputField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                state={error ? "error" : "default"}
              />
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm font-medium">Security Notice</p>
                  <p className="text-blue-700 text-xs mt-1">
                    For your security, we'll only send reset instructions if this email is associated with a SafeDoser account.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              text="Send Reset Link"
              handleClick={() => {}}
              loading={isLoading}
            />
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              to="/auth/login"
              className="text-[var(--primary-color)] text-sm font-medium hover:underline"
            >
              Back to Sign In
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Need help? Contact our support team for assistance with your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
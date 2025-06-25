import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

    const result = await resetPassword(email);
    
    if (result.success) {
      setIsSuccess(true);
      setError("");
    } else {
      setError(result.error || "Failed to send reset email");
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
              We've sent a password reset link to:
            </p>
            <p className="text-[var(--text-primary)] font-medium mb-6">{email}</p>
            
            <p className="text-[var(--text-secondary)] text-sm mb-8">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>

            <div className="space-y-4">
              <Link
                to="/auth/login"
                className="block w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium text-center"
              >
                Back to Sign In
              </Link>
              
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                className="block w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center"
              >
                Try Different Email
              </button>
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
              Enter your email address and we'll send you a link to reset your password
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
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
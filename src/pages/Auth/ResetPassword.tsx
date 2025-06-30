import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { authAPI } from "../../config/api";
import InputField from "../../components/UI/Input";
import Button from "../../components/UI/Button";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    // Validate token and email parameters
    if (!token || !email) {
      setTokenValid(false);
      setErrors(prev => ({ ...prev, general: "Invalid reset link" }));
    } else {
      setTokenValid(true);
    }
  }, [token, email]);

  const validateForm = () => {
    const newErrors = { password: "", confirmPassword: "", general: "" };
    let isValid = true;

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !token || !email) return;

    setIsLoading(true);
    
    try {
      await authAPI.resetPassword(email, token, formData.password);
      
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth/login", { 
          state: { message: "Password reset successfully! You can now sign in with your new password." }
        });
      }, 3000);
    } catch (error: any) {
      
      if (error.message?.includes("expired") || error.message?.includes("invalid")) {
        setTokenValid(false);
        setErrors(prev => ({ 
          ...prev, 
          general: "This reset link has expired or is invalid. Please request a new password reset." 
        }));
      } else {
        setErrors(prev => ({ ...prev, general: error.message || "Password reset failed" }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-[var(--border-dark)] flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-6 border-b border-[var(--border-grey)]">
          <div className="flex items-center">
            <Link
              to="/auth/forgot-password"
              className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-[1.5rem] font-bold text-[var(--primary-color)]">SafeDoser</h1>
            </div>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="max-w-sm mx-auto w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-[1.75rem] font-bold text-red-600 mb-4">Invalid Reset Link</h2>
            
            <p className="text-[var(--text-secondary)] mb-6">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>

            <div className="space-y-4">
              <Link
                to="/auth/forgot-password"
                className="block w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium text-center hover:bg-[var(--primary-dark)] transition-colors"
              >
                Request New Reset Link
              </Link>
              
              <Link
                to="/auth/login"
                className="block w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center hover:bg-[var(--primary-light)] transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            
            <h2 className="text-[1.75rem] font-bold text-green-600 mb-4">Password Reset Successfully!</h2>
            
            <p className="text-[var(--text-secondary)] mb-6">
              Your password has been updated. You can now sign in with your new password.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm">
                🎉 You'll be redirected to the login page in a few seconds.
              </p>
            </div>

            <Link
              to="/auth/login"
              className="block w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium text-center hover:bg-[var(--primary-dark)] transition-colors"
            >
              Go to Sign In
            </Link>
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
            to="/auth/forgot-password"
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-[1.5rem] font-bold text-[var(--primary-color)]">SafeDoser</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-2">Reset Your Password</h2>
            <p className="text-[var(--text-secondary)]">
              Enter your new password below
            </p>
            {email && (
              <p className="text-[var(--text-secondary)] text-sm mt-2">
                for <strong>{email}</strong>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                New Password
              </label>
              <div className="relative">
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  state={errors.password ? "error" : "default"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <InputField
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  state={errors.confirmPassword ? "error" : "default"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm font-medium mb-1">Password Requirements:</p>
              <ul className="text-blue-600 text-xs space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Must match the confirmation password</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              text="Reset Password"
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

export default ResetPassword;
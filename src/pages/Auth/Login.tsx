import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL, authAPI } from "../../config/api";
import InputField from "../../components/UI/Input";
import { Eye, EyeOff, CheckCircle, AlertCircle, X, Mail, RefreshCcw } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
    visible: boolean;
  }>({ type: "info", message: "", visible: false });
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [showEmailVerificationPrompt, setShowEmailVerificationPrompt] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Show notification function
  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message, visible: true });
    // Don't auto-hide error notifications
    if (type !== "error") {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
      }, 5000);
    }
  };

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isProcessingOAuth) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, isProcessingOAuth]);

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      showNotification("success", location.state.message);
      
      // If there's verification info from signup, show it
      if (location.state?.showVerificationInfo && location.state?.userEmail) {
        const emailStatus = location.state.emailSent;
        
        if (emailStatus) {
          showNotification("info", "Verification email sent! Please check your inbox and click the verification link.");
        } else {
          showNotification("error", `Failed to send verification email: ${location.state.emailMessage || "Unknown error"}`);
        }
        
        // Pre-fill email if provided
        setFormData(prev => ({ ...prev, email: location.state.userEmail || "" }));
      }
      
      // Clear the message from navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Check for OAuth tokens in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken && refreshToken) {
      setIsProcessingOAuth(true);
      
      // Store tokens
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Clean URL
      window.history.replaceState({}, document.title, location.pathname);

      // Show success notification
      showNotification("success", "Successfully signed in with Google!");

      // Force a page reload to trigger auth context update
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
      return;
    }

    // Check for OAuth errors
    const error = urlParams.get("error");
    const errorMessage = urlParams.get("message");

    if (error && errorMessage) {
      showNotification("error", `Google Sign-in failed: ${errorMessage}`);
      setErrors((prev) => ({
        ...prev,
        general: `Google Sign-in failed: ${errorMessage}`,
      }));
      // Clean URL
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search, navigate]);

  const validateForm = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      showNotification("success", "Successfully signed in!");
      // Navigation will be handled by the useEffect above
    } else {
      // Check if it's an email verification error
      if (result.error?.includes("verify your email") || result.error?.includes("Email not verified")) {
        // Redirect to verification sent page instead of showing modal
        navigate("/auth/verification-sent", {
          state: {
            email: formData.email
          }
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.error || "Login failed",
        }));
        showNotification("error", result.error || "Login failed");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }

    // Also hide any error notifications when user starts typing
    if (notification.type === "error" && notification.visible) {
      setNotification((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    try {
      // Redirect to backend OAuth endpoint
      const backendUrl = API_BASE_URL;
      if (!backendUrl) {
        throw new Error("API_BASE_URL is not defined");
      }
      window.location.href = `${backendUrl}/auth/${provider}`;
    } catch (error: any) {
      const errorMessage = `Failed to initiate ${provider} login: ${error.message}`;
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
      showNotification("error", errorMessage);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail || isResendingVerification) return;

    setIsResendingVerification(true);
    
    try {
      const { data } = await authAPI.resendVerification(verificationEmail);
      
      if (data.email_sent) {
        showNotification("success", "Verification email sent successfully! Please check your inbox.");
        setShowEmailVerificationPrompt(false);
        
        // Navigate to verification sent page
        navigate("/auth/verification-sent", {
          state: {
            email: verificationEmail,
            emailSent: true
          }
        });
      } else {
        showNotification("error", `Failed to send verification email: ${data.reason || "Unknown error"}`);
      }
    } catch (error: any) {
      let errorMessage = "Failed to send verification email";
      if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please check your internet connection and try again.";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification("error", errorMessage);
    } finally {
      setIsResendingVerification(false);
    }
  };

  // Show loading state while processing OAuth
  if (isProcessingOAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">Completing Google sign-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Notification */}
      {notification.visible && (
        <div
          className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notification.type === "success" && (
                <CheckCircle className="w-5 h-5" />
              )}
              {notification.type === "error" && (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {notification.message}
              </span>
            </div>
            <button
              onClick={() =>
                setNotification((prev) => ({ ...prev, visible: false }))
              }
              className="text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Email Verification Prompt */}
      {showEmailVerificationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Email Verification Required
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Please verify your email address to continue. We'll send a new verification link to:
              </p>
              <p className="text-[var(--text-primary)] font-medium mt-2">{verificationEmail}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isResendingVerification}
                className={`w-full px-4 py-3 rounded-xl font-medium text-center transition-colors ${
                  isResendingVerification
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)]"
                }`}
              >
                {isResendingVerification ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Send Verification Email
                  </div>
                )}
              </button>
              
              <button
                onClick={() => setShowEmailVerificationPrompt(false)}
                className="w-full px-4 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center hover:bg-[var(--primary-light)] transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-[var(--text-secondary)]">
                Check your spam folder if you don't see the email
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/src/assets/images/logo2 1.svg"
            alt="SafeDoser Logo"
            className="w-40 h-auto"
          />
        </div>
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <InputField
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                state={errors.email ? "error" : "default"}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  state={errors.password ? "error" : "default"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-[var(--primary-color)] hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 rounded-xl font-medium text-center transition-colors ${
                  isLoading
                    ? "bg-[var(--primary-color)] opacity-70 text-white cursor-not-allowed"
                    : "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)]"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue With Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              You don't have an account?{" "}
              <Link
                to="/auth/signup"
                className="text-[var(--primary-color)] font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
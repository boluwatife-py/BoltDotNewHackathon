import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/UI/Input";
import Checkbox from "../../components/UI/Checkbox";
import { Eye, EyeOff, Camera, Mail, CheckCircle, AlertCircle, X } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    avatar: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    agreeToTerms: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    sent: boolean;
    message?: string;
  } | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    visible: boolean;
  }>({ type: 'info', message: '', visible: false });

  // Show notification function
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, visible: true });
    // Don't auto-hide error notifications
    if (type !== 'error') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 5000);
    }
  };

  const validateForm = () => {
    const newErrors = { 
      name: "", 
      email: "", 
      password: "", 
      confirmPassword: "", 
      age: "", 
      agreeToTerms: "",
      general: "" 
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

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

    if (!formData.age) {
      newErrors.age = "Age is required";
      isValid = false;
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 13 || age > 120) {
        newErrors.age = "Age must be between 13 and 120";
        isValid = false;
      }
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms and Conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await signup(
      formData.email, 
      formData.password, 
      formData.name, 
      parseInt(formData.age),
      formData.avatar || undefined
    );
    
    if (result.success) {
      // Show email verification notice instead of navigating directly
      setShowEmailVerification(true);
      setEmailStatus({
        sent: result.emailSent || false,
        message: result.emailMessage
      });
      showNotification('success', 'Account created successfully!');
    } else {
      setErrors(prev => ({ ...prev, general: result.error || "Signup failed" }));
      showNotification('error', result.error || "Signup failed");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
    
    // Also hide any error notifications when user starts typing
    if (notification.type === 'error' && notification.visible) {
      setNotification(prev => ({ ...prev, visible: false }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, general: "Avatar image must be less than 5MB" }));
        showNotification('error', "Avatar image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, general: "Please select a valid image file" }));
        showNotification('error', "Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    try {
      // Redirect to backend OAuth endpoint
      if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined");
      }
      window.location.href = `${API_BASE_URL}/auth/${provider}`;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      const errorMessage = `Failed to initiate ${provider} login: ${error.message}`;
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
      showNotification('error', errorMessage);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (!API_BASE_URL) {
        throw new Error("API_BASE_URL is not defined");
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setEmailStatus(prev => ({
          ...prev!,
          sent: true,
          message: "Verification email resent successfully!"
        }));
        showNotification('success', "Verification email resent successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resend verification email");
      }
    } catch (error: any) {
      console.error("Failed to resend verification email:", error);
      showNotification('error', error.message || "Failed to resend verification email");
    }
  };

  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Notification */}
        {notification.visible && (
          <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                <span className="text-sm font-medium">{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
                className="text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Email Verification Notice */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="max-w-sm mx-auto w-full text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-[1.75rem] font-bold text-gray-900 mb-4">Check Your Email</h2>
            
            <p className="text-gray-600 mb-2">
              Welcome to SafeDoser, {formData.name}! We've sent a verification email to:
            </p>
            <p className="text-gray-900 font-medium mb-6">{formData.email}</p>
            
            {/* Email Status */}
            {emailStatus?.sent ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-green-800 text-sm font-medium">Email Sent Successfully!</p>
                </div>
                <p className="text-green-700 text-sm">
                  Click the verification link in your email to activate your account and start using SafeDoser.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-yellow-800 text-sm font-medium">Email Delivery Issue</p>
                </div>
                <p className="text-yellow-700 text-sm">
                  {emailStatus?.message || "There was an issue sending the verification email. You can try resending it below."}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => navigate("/")}
                className="block w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium text-center hover:bg-[var(--primary-dark)] transition-colors"
              >
                Continue to App
              </button>
              
              <button
                onClick={resendVerificationEmail}
                className="block w-full px-6 py-3 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium text-center hover:bg-[var(--primary-light)] transition-colors"
              >
                Resend Verification Email
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try resending.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Notification */}
      {notification.visible && (
        <div className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
              className="text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
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
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-[var(--primary-color)] flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[var(--primary-color)] text-white rounded-full p-1 cursor-pointer hover:bg-[var(--primary-dark)] transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Optional profile picture</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <InputField
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                state={errors.name ? "error" : "default"}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

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

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <InputField
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                state={errors.age ? "error" : "default"}
                min="13"
                max="120"
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
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
                  onChange={(e) => handleInputChange("password", e.target.value)}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <InputField
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  state={errors.confirmPassword ? "error" : "default"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={(checked) => handleInputChange("agreeToTerms", checked)}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-[var(--primary-color)] hover:underline font-medium"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>
                    {" "}and{" "}
                    <Link
                      to="/privacy"
                      className="text-[var(--primary-color)] hover:underline font-medium"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs ml-8">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* Email Verification Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm font-medium">Email Verification Required</p>
                  <p className="text-blue-700 text-xs mt-1">
                    We'll send a verification email to activate your account after signup.
                  </p>
                </div>
              </div>
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
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
              onClick={() => handleSocialLogin('google')}
              className="w-full px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue With Google
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-[var(--primary-color)] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
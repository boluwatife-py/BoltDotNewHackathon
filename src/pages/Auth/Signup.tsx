import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/UI/Input";
import Checkbox from "../../components/UI/Checkbox";
import { Eye, EyeOff, Camera, Mail, CheckCircle, AlertCircle } from "lucide-react";
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
    } else {
      setErrors(prev => ({ ...prev, general: result.error || "Signup failed" }));
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
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, general: "Avatar image must be less than 5MB" }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, general: "Please select a valid image file" }));
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
      window.location.href = `${API_BASE_URL}/auth/${provider}`;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setErrors(prev => ({ 
        ...prev, 
        general: `Failed to initiate ${provider} login. Please try again.` 
      }));
    }
  };

  const resendVerificationEmail = async () => {
    try {
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
      }
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }
  };

  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
        {/* Logo */}
        <div className="mb-8">
          <svg width="160" height="203" viewBox="0 0 160 203" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-auto">
            <path d="M109.5 93C86.7 98.2 60.6667 91.8333 50.5 88L80 49.5L108 36C108 36 111.5 43 120 45.5C130.159 48.4879 147 49.5 147 49.5C147 49.5 143.5 55.7086 146 64C148.5 72.2914 156 76 156 76L109.5 93Z" fill="#066B65" stroke="#066B65" strokeWidth="5" strokeLinejoin="round"/>
            <path d="M92.5 32H6.5V88H92.5V32Z" fill="white"/>
            <path d="M92.5 10H6.5V32H92.5V10Z" fill="#08B5A6"/>
            <path d="M85 0C86.3807 1.6407e-07 87.5 1.11929 87.5 2.5V7H94C95.3807 7 96.5 8.11929 96.5 9.5V88.5C96.5 89.8807 95.3807 91 94 91H6C4.61929 91 3.5 89.8807 3.5 88.5V9.5C3.5 8.11929 4.61929 7 6 7H10.5V2.5C10.5 1.11929 11.6193 6.03529e-08 13 0C14.3807 1.6407e-07 15.5 1.11929 15.5 2.5V7H34.5V2.5C34.5 1.11929 35.6193 6.03529e-08 37 0C38.3807 1.6407e-07 39.5 1.11929 39.5 2.5V7H58.5V2.5C58.5 1.11929 59.6193 6.03529e-08 61 0C62.3807 1.6407e-07 63.5 1.11929 63.5 2.5V7H82.5V2.5C82.5 1.11929 83.6193 6.03529e-08 85 0ZM8.5 86H91.5V34.5H8.5V86ZM8.5 29.5H91.5V12H8.5V29.5Z" fill="#08B5A6"/>
            <path d="M54.3946 61.6744L68.6052 47.4639L88.4999 67.3586L80.4473 76.8323L67.6578 82.9902L58.6578 80.6218L53.4473 72.5691L54.3946 61.6744Z" fill="#08B5A6"/>
            <path d="M104.658 51.8526L90.3947 66.0102L70.574 46.0418L78.6617 36.5981L88.0264 29.937L100.465 32.8895L105.646 40.9614L104.658 51.8526Z" fill="white"/>
            <path d="M68.941 45.9039L90.059 67.0218M56.8737 57.9713L81.0084 33.8366C83.8088 31.0361 87.607 29.4629 91.5674 29.4629C95.5278 29.4629 99.3259 31.0361 102.126 33.8366C104.927 36.637 106.5 40.4351 106.5 44.3955C106.5 48.3559 104.927 52.1541 102.126 54.9545L77.9916 79.0892C75.1912 81.8896 71.393 83.4629 67.4326 83.4629C63.4722 83.4629 59.6741 81.8896 56.8737 79.0892C54.0733 76.2888 52.5 72.4906 52.5 68.5303C52.5 64.5699 54.0733 60.7717 56.8737 57.9713Z" stroke="#08B5A6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M45.7354 118.946C45.5763 117.342 44.8935 116.095 43.6871 115.207C42.4807 114.319 40.8434 113.875 38.7752 113.875C37.3699 113.875 36.1833 114.074 35.2155 114.471C34.2477 114.856 33.5053 115.393 32.9882 116.082C32.4845 116.772 32.2326 117.554 32.2326 118.429C32.206 119.158 32.3585 119.794 32.6899 120.338C33.0346 120.881 33.5053 121.352 34.1019 121.75C34.6985 122.134 35.3879 122.472 36.1701 122.764C36.9523 123.042 37.7875 123.281 38.6757 123.48L42.3348 124.355C44.1113 124.753 45.742 125.283 47.2269 125.946C48.7117 126.609 49.9977 127.424 51.0848 128.392C52.172 129.36 53.0138 130.5 53.6104 131.812C54.2202 133.125 54.5318 134.629 54.5451 136.326C54.5318 138.819 53.8954 140.98 52.636 142.809C51.3898 144.626 49.5867 146.038 47.2269 147.045C44.8803 148.04 42.0498 148.537 38.7354 148.537C35.4475 148.537 32.5839 148.033 30.1445 147.025C27.7184 146.018 25.8225 144.526 24.457 142.551C23.1047 140.562 22.3954 138.103 22.3291 135.173H30.6615C30.7543 136.539 31.1454 137.679 31.8348 138.593C32.5375 139.495 33.4721 140.178 34.6388 140.642C35.8187 141.093 37.1511 141.318 38.636 141.318C40.0943 141.318 41.3604 141.106 42.4343 140.682C43.5214 140.257 44.3632 139.667 44.9598 138.912C45.5564 138.156 45.8547 137.288 45.8547 136.307C45.8547 135.392 45.5829 134.623 45.0394 134C44.5091 133.377 43.7269 132.846 42.6928 132.409C41.672 131.971 40.4191 131.574 38.9343 131.216L34.4996 130.102C31.0659 129.267 28.3547 127.961 26.3661 126.184C24.3774 124.408 23.3898 122.015 23.403 119.005C23.3898 116.54 24.046 114.385 25.3718 112.542C26.7108 110.7 28.547 109.261 30.8803 108.227C33.2136 107.193 35.8651 106.676 38.8348 106.676C41.8576 106.676 44.4958 107.193 46.7496 108.227C49.0166 109.261 50.7799 110.7 52.0394 112.542C53.2988 114.385 53.9485 116.52 53.9882 118.946H45.7354ZM67.7681 148.537C65.8192 148.537 64.0825 148.199 62.5579 147.522C61.0332 146.833 59.8268 145.819 58.9386 144.48C58.0636 143.128 57.6261 141.444 57.6261 139.429C57.6261 137.732 57.9376 136.307 58.5607 135.153C59.1838 134 60.0323 133.072 61.1062 132.369C62.18 131.666 63.3997 131.136 64.7653 130.778C66.144 130.42 67.5891 130.168 69.1005 130.022C70.877 129.837 72.3088 129.665 73.3959 129.505C74.4831 129.333 75.2719 129.081 75.7624 128.75C76.2529 128.418 76.4982 127.928 76.4982 127.278V127.159C76.4982 125.899 76.1005 124.925 75.305 124.236C74.5228 123.546 73.4092 123.201 71.9641 123.201C70.4395 123.201 69.2264 123.54 68.3249 124.216C67.4234 124.879 66.8268 125.714 66.5351 126.721L58.6999 126.085C59.0976 124.229 59.8798 122.625 61.0465 121.272C62.2132 119.907 63.7179 118.86 65.5607 118.13C67.4168 117.388 69.5645 117.017 72.0039 117.017C73.7009 117.017 75.3249 117.216 76.8761 117.613C78.4404 118.011 79.8259 118.628 81.0323 119.463C82.252 120.298 83.2132 121.372 83.9158 122.684C84.6185 123.984 84.9698 125.541 84.9698 127.358V147.96H76.9357V143.724H76.6971C76.2065 144.679 75.5503 145.521 74.7283 146.25C73.9064 146.966 72.9187 147.529 71.7653 147.94C70.6118 148.338 69.2795 148.537 67.7681 148.537ZM70.1942 142.69C71.4404 142.69 72.5408 142.445 73.4954 141.954C74.4499 141.45 75.199 140.774 75.7425 139.926C76.2861 139.077 76.5579 138.116 76.5579 137.042V133.801C76.2927 133.973 75.9281 134.132 75.4641 134.278C75.0134 134.411 74.5029 134.537 73.9329 134.656C73.3628 134.762 72.7927 134.861 72.2226 134.954C71.6526 135.034 71.1355 135.107 70.6715 135.173C69.6772 135.319 68.8088 135.551 68.0664 135.869C67.324 136.187 66.7473 136.618 66.3363 137.162C65.9253 137.692 65.7198 138.355 65.7198 139.15C65.7198 140.304 66.1374 141.185 66.9726 141.795C67.8211 142.392 68.895 142.69 70.1942 142.69ZM106.848 117.415V123.778H87.9961V117.415H106.848ZM92.3115 147.96V115.207C92.3115 112.993 92.7423 111.157 93.6041 109.699C94.4791 108.24 95.6722 107.147 97.1836 106.417C98.695 105.688 100.412 105.324 102.334 105.324C103.633 105.324 104.82 105.423 105.894 105.622C106.981 105.821 107.79 106 108.32 106.159L106.809 112.522C106.477 112.416 106.066 112.317 105.576 112.224C105.098 112.131 104.608 112.085 104.104 112.085C102.858 112.085 101.989 112.377 101.499 112.96C101.008 113.53 100.763 114.332 100.763 115.366V147.96H92.3115ZM123.731 148.557C120.588 148.557 117.884 147.92 115.617 146.647C113.363 145.361 111.626 143.545 110.407 141.199C109.187 138.839 108.577 136.048 108.577 132.826C108.577 129.684 109.187 126.927 110.407 124.554C111.626 122.181 113.343 120.331 115.557 119.005C117.784 117.68 120.396 117.017 123.392 117.017C125.408 117.017 127.284 117.342 129.02 117.991C130.77 118.628 132.295 119.589 133.594 120.875C134.907 122.161 135.927 123.778 136.657 125.727C137.386 127.663 137.75 129.93 137.75 132.528V134.855H111.958V129.605H129.776C129.776 128.385 129.511 127.305 128.981 126.363C128.45 125.422 127.714 124.686 126.773 124.156C125.845 123.612 124.765 123.341 123.532 123.341C122.246 123.341 121.106 123.639 120.111 124.236C119.13 124.819 118.361 125.608 117.804 126.602C117.248 127.583 116.963 128.677 116.949 129.883V134.875C116.949 136.386 117.228 137.692 117.784 138.792C118.355 139.893 119.157 140.741 120.191 141.338C121.225 141.934 122.451 142.233 123.87 142.233C124.811 142.233 125.673 142.1 126.455 141.835C127.237 141.57 127.907 141.172 128.463 140.642C129.02 140.111 129.445 139.462 129.736 138.693L137.571 139.21C137.174 141.093 136.358 142.736 135.125 144.142C133.906 145.534 132.328 146.621 130.392 147.403C128.47 148.172 126.249 148.557 123.731 148.557ZM18.7602 197.96H4.32275V157.233H18.8796C22.9761 157.233 26.5027 158.048 29.4591 159.679C32.4155 161.296 34.6892 163.623 36.2801 166.659C37.8843 169.695 38.6864 173.327 38.6864 177.557C38.6864 181.799 37.8843 185.445 36.2801 188.494C34.6892 191.543 32.4023 193.883 29.4193 195.514C26.4496 197.145 22.8966 197.96 18.7602 197.96ZM12.9335 190.582H18.4023C20.9477 190.582 23.0888 190.131 24.8256 189.23C26.5756 188.315 27.8881 186.903 28.7631 184.994C29.6513 183.072 30.0955 180.593 30.0955 177.557C30.0955 174.547 29.6513 172.088 28.7631 170.179C27.8881 168.27 26.5822 166.864 24.8455 165.963C23.1087 165.061 20.9676 164.611 18.4222 164.611H12.9335V190.582ZM57.587 198.557C54.498 198.557 51.8266 197.9 49.5728 196.588C47.3322 195.262 45.6021 193.419 44.3824 191.059C43.1627 188.686 42.5529 185.935 42.5529 182.807C42.5529 179.651 43.1627 176.894 44.3824 174.534C45.6021 172.161 47.3322 170.318 49.5728 169.005C51.8266 167.68 54.498 167.017 57.587 167.017C60.676 167.017 63.3408 167.68 65.5813 169.005C67.8351 170.318 69.5718 172.161 70.7915 174.534C72.0112 176.894 72.6211 179.651 72.6211 182.807C72.6211 185.935 72.0112 188.686 70.7915 191.059C69.5718 193.419 67.8351 195.262 65.5813 196.588C63.3408 197.9 60.676 198.557 57.587 198.557ZM57.6267 191.994C59.032 191.994 60.2053 191.596 61.1466 190.801C62.0879 189.992 62.7972 188.892 63.2745 187.5C63.765 186.108 64.0103 184.523 64.0103 182.747C64.0103 180.97 63.765 179.386 63.2745 177.994C62.7972 176.602 62.0879 175.502 61.1466 174.693C60.2053 173.884 59.032 173.48 57.6267 173.48C56.2082 173.48 55.015 173.884 54.0472 174.693C53.0927 175.502 52.3701 176.602 51.8796 177.994C51.4023 179.386 51.1637 180.97 51.1637 182.747C51.1637 184.523 51.4023 186.108 51.8796 187.5C52.3701 188.892 53.0927 189.992 54.0472 190.801C55.015 191.596 56.2082 191.994 57.6267 191.994ZM102.424 176.125L94.6687 176.602C94.5361 175.939 94.2511 175.343 93.8136 174.812C93.3761 174.269 92.7994 173.838 92.0835 173.52C91.3808 173.188 90.5389 173.022 89.5579 173.022C88.2454 173.022 87.1384 173.301 86.2369 173.858C85.3353 174.401 84.8846 175.13 84.8846 176.045C84.8846 176.774 85.1763 177.391 85.7596 177.895C86.3429 178.398 87.3439 178.803 88.7624 179.108L94.2908 180.221C97.2605 180.831 99.4746 181.812 100.933 183.165C102.391 184.517 103.12 186.293 103.12 188.494C103.12 190.496 102.53 192.253 101.35 193.764C100.184 195.275 98.5797 196.455 96.538 197.304C94.5096 198.139 92.1696 198.557 89.5181 198.557C85.4746 198.557 82.253 197.715 79.8533 196.031C77.467 194.334 76.0683 192.027 75.6573 189.111L83.9897 188.673C84.2416 189.906 84.8514 190.847 85.8192 191.497C86.7871 192.133 88.0266 192.451 89.538 192.451C91.0228 192.451 92.216 192.166 93.1175 191.596C94.0323 191.013 94.4963 190.264 94.5096 189.349C94.4963 188.58 94.1715 187.95 93.5352 187.46C92.8988 186.956 91.9177 186.572 90.592 186.307L85.3022 185.253C82.3192 184.656 80.0986 183.622 78.6403 182.15C77.1952 180.679 76.4727 178.803 76.4727 176.522C76.4727 174.56 77.003 172.87 78.0636 171.451C79.1374 170.033 80.6422 168.939 82.5778 168.17C84.5266 167.401 86.8069 167.017 89.4187 167.017C93.2766 167.017 96.3126 167.832 98.5266 169.463C100.754 171.093 102.053 173.314 102.424 176.125ZM121.255 198.557C118.113 198.557 115.409 197.92 113.142 196.647C110.888 195.361 109.151 193.545 107.931 191.199C106.712 188.839 106.102 186.048 106.102 182.826C106.102 179.684 106.712 176.927 107.931 174.554C109.151 172.181 110.868 170.331 113.082 169.005C115.309 167.68 117.921 167.017 120.917 167.017C122.932 167.017 124.808 167.342 126.545 167.991C128.295 168.628 129.82 169.589 131.119 170.875C132.431 172.161 133.452 173.778 134.181 175.727C134.911 177.663 135.275 179.93 135.275 182.528V184.855H109.483V179.605H127.301C127.301 178.385 127.036 177.305 126.505 176.363C125.975 175.422 125.239 174.686 124.298 174.156C123.37 173.612 122.289 173.341 121.056 173.341C119.771 173.341 118.63 173.639 117.636 174.236C116.655 174.819 115.886 175.608 115.329 176.602C114.772 177.583 114.487 178.677 114.474 179.883V184.875C114.474 186.386 114.753 187.692 115.309 188.792C115.879 189.893 116.681 190.741 117.716 191.338C118.75 191.934 119.976 192.233 121.395 192.233C122.336 192.233 123.198 192.1 123.98 191.835C124.762 191.57 125.431 191.172 125.988 190.642C126.545 190.111 126.969 189.462 127.261 188.693L135.096 189.21C134.699 191.093 133.883 192.736 132.65 194.142C131.431 195.534 129.853 196.621 127.917 197.403C125.995 198.172 123.774 198.557 121.255 198.557ZM139.684 197.96V167.415H147.897V172.744H148.215C148.772 170.848 149.706 169.416 151.019 168.449C152.331 167.468 153.843 166.977 155.553 166.977C155.977 166.977 156.435 167.004 156.925 167.057C157.416 167.11 157.847 167.182 158.218 167.275V174.792C157.82 174.673 157.27 174.567 156.567 174.474C155.865 174.381 155.222 174.335 154.638 174.335C153.392 174.335 152.278 174.607 151.297 175.15C150.329 175.681 149.561 176.423 148.99 177.378C148.434 178.332 148.155 179.432 148.155 180.679V197.96H139.684Z" fill="#08B5A6"/>
          </svg>
        </div>

        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

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
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)]"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
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
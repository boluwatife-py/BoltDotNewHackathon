import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authAPI, userAPI } from "../config/api";

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  avatarUrl?: string;
  email_verified?: boolean;
  created_at?: string; // Add created_at field to track signup date
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  connectionError: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string,
    age: number,
    avatar?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    emailSent?: boolean;
    emailMessage?: string;
  }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error?: string;
    emailSent?: boolean;
    reason?: string;
  }>;
  updateProfile: (data: {
    name?: string;
    age?: number;
    avatar?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  retryConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  connectionError: false,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  resetPassword: async () => ({ success: false }),
  updateProfile: async () => ({ success: false }),
  isAuthenticated: false,
  retryConnection: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Key for storing chat history in localStorage
const CHAT_HISTORY_STORAGE_KEY = "safedoser_chat_history";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Check for existing session on app load
  const checkAuthStatus = async () => {
    try {
      setConnectionError(false);
      
      const token = localStorage.getItem("access_token");

      if (token) {
        // Validate token by fetching user profile
        const { data } = await userAPI.getProfile(token);

        // Check if email is verified
        if (!data.user.email_verified && data.user.email !== "demo@safedoser.com") {
          // Clear tokens for unverified users
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
          throw new Error("Email not verified. Please check your email and verify your account.");
        }

        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          age: data.user.age,
          avatarUrl: data.user.avatar_url,
          email_verified: data.user.email_verified,
          created_at: data.user.created_at, // Store the created_at date
        });
      } else {
        setUser(null);
      }
    } catch (error: any) {
      // Check if it's an email verification error
      if (
        error.message.includes("Email not verified") ||
        error.message.includes("verify your email")
      ) {
        // Clear tokens and show verification message
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        return;
      }

      // Check if it's a network/connection error
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("timeout")
      ) {
        setConnectionError(true);
        // Don't clear tokens on connection errors - user might have valid session
        return;
      }

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  };

  useEffect(() => {
    // Only run auth check once on mount
    if (!hasInitialized) {
      checkAuthStatus();
    }
  }, [hasInitialized]);

  // Listen for storage changes (for OAuth token updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" && e.newValue && hasInitialized) {
        // Token was added, re-check auth status
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [hasInitialized]);

  const retryConnection = async () => {
    setIsLoading(true);
    await checkAuthStatus();
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      setConnectionError(false);

      const { data } = await authAPI.login({ email, password });

      // Check if email is verified
      if (!data.user.email_verified && email !== "demo@safedoser.com") {
        return {
          success: false,
          error: "Email not verified. Please check your email and verify your account."
        };
      }

      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Set user data
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        age: data.user.age,
        avatarUrl: data.user.avatar_url,
        email_verified: data.user.email_verified,
        created_at: data.user.created_at, // Store the created_at date
      });

      return { success: true };
    } catch (error: any) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        setConnectionError(true);
        return {
          success: false,
          error:
            "Unable to connect to server. Please check your internet connection and try again.",
        };
      }

      if (
        error.message.includes("Email not verified")
      ) {
        return {
          success: false,
          error: "Please verify your email address before signing in. Check your inbox for the verification link.",
        };
      }

      // Handle specific error cases
      if (
        error.message.includes("401") ||
        error.message.includes("Invalid email or password")
      ) {
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        };
      }

      if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        return {
          success: false,
          error:
            "Account not found. Please check your email or create a new account.",
        };
      }

      if (
        error.message.includes("too many") ||
        error.message.includes("rate limit")
      ) {
        return {
          success: false,
          error: "Too many login attempts. Please try again later.",
        };
      }

      return {
        success: false,
        error: error.message || "Login failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    age: number,
    avatar?: string
  ): Promise<{
    success: boolean;
    error?: string;
    emailSent?: boolean;
    emailMessage?: string;
  }> => {
    try {
      setIsLoading(true);
      setConnectionError(false);

      const userData: any = { email, password, name, age };
      if (avatar) {
        userData.avatar = avatar;
      }

      const { data } = await authAPI.signup(userData);

      // For signup, we don't store tokens or set user data anymore
      // since we want the user to verify their email first
      
      return {
        success: true,
        emailSent: data.email_sent,
        emailMessage: data.email_message,
      };
    } catch (error: any) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        setConnectionError(true);
        return {
          success: false,
          error:
            "Unable to connect to server. Please check your internet connection and try again.",
        };
      }

      // Handle specific error cases
      if (
        error.message.includes("already registered") ||
        error.message.includes("already exists")
      ) {
        return {
          success: false,
          error:
            "This email is already registered. Please use a different email or try logging in.",
        };
      }

      if (
        error.message.includes("password") &&
        error.message.includes("weak")
      ) {
        return {
          success: false,
          error:
            "Password is too weak. Please use a stronger password with at least 6 characters.",
        };
      }

      if (error.message.includes("invalid email")) {
        return { success: false, error: "Please enter a valid email address." };
      }

      return {
        success: false,
        error: error.message || "Signup failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear chat history from localStorage when logging out
    if (user) {
      const storageKey = `${CHAT_HISTORY_STORAGE_KEY}_${user.id}`;
      localStorage.removeItem(storageKey);
    }
    
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setConnectionError(false);
  };

  const resetPassword = async (
    email: string
  ): Promise<{
    success: boolean;
    error?: string;
    emailSent?: boolean;
    reason?: string;
  }> => {
    try {
      setIsLoading(true);
      setConnectionError(false);

      const { data } = await authAPI.forgotPassword(email);

      return {
        success: true,
        emailSent: data.email_sent,
        reason: data.reason,
      };
    } catch (error: any) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        setConnectionError(true);
        return {
          success: false,
          error:
            "Unable to connect to server. Please check your internet connection and try again.",
          emailSent: false,
        };
      }

      return {
        success: false,
        error: error.message || "Password reset failed",
        emailSent: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    age?: number;
    avatar?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setConnectionError(false);
      const token = localStorage.getItem("access_token");

      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      await userAPI.updateProfile(token, data);

      // Refresh user data
      const { data: profileData } = await userAPI.getProfile(token);
      setUser({
        id: profileData.user.id,
        email: profileData.user.email,
        name: profileData.user.name,
        age: profileData.user.age,
        avatarUrl: profileData.user.avatar_url,
        email_verified: profileData.user.email_verified,
        created_at: profileData.user.created_at, // Preserve the created_at date
      });

      return { success: true };
    } catch (error: any) {
      if (
        error.message === "Failed to fetch" ||
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        setConnectionError(true);
        return {
          success: false,
          error:
            "Unable to connect to server. Please check your internet connection and try again.",
        };
      }

      return {
        success: false,
        error: error.message || "Profile update failed",
      };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    connectionError,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    retryConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
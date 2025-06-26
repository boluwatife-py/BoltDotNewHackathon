import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authAPI, userAPI } from "../config/api";

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  avatarUrl?: string;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, age: number, avatar?: string) => Promise<{ 
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
  updateProfile: (data: { name?: string; age?: number; avatar?: string }) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  resetPassword: async () => ({ success: false }),
  updateProfile: async () => ({ success: false }),
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (token) {
          // Validate token by fetching user profile
          const { data } = await userAPI.getProfile(token);
          
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            age: data.user.age,
            avatarUrl: data.user.avatar_url,
            email_verified: data.user.email_verified
          });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Token is invalid, clear it
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data } = await authAPI.login({ email, password });
      
      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      // Set user data
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        age: data.user.age,
        avatarUrl: data.user.avatar_url,
        email_verified: data.user.email_verified
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || "Login failed" };
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
      
      const userData: any = { email, password, name, age };
      if (avatar) {
        userData.avatar = avatar;
      }
      
      const { data } = await authAPI.signup(userData);
      
      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      // Set user data
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        age: data.user.age,
        avatarUrl: data.user.avatar_url,
        email_verified: data.user.email_verified
      });
      
      return { 
        success: true, 
        emailSent: data.email_sent,
        emailMessage: data.email_message 
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ 
    success: boolean; 
    error?: string; 
    emailSent?: boolean; 
    reason?: string; 
  }> => {
    try {
      setIsLoading(true);
      
      const { data } = await authAPI.forgotPassword(email);
      
      return { 
        success: true, 
        emailSent: data.email_sent,
        reason: data.reason 
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: error.message || "Password reset failed",
        emailSent: false 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; age?: number; avatar?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('access_token');
      
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
        email_verified: profileData.user.email_verified
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message || "Profile update failed" };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
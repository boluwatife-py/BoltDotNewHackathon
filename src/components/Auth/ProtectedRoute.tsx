import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and email is verified
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        navigate("/auth/login", { replace: true });
      } else if (user && !user.email_verified && user.email !== "demo@safedoser.com") {
        // Redirect to verification page if email is not verified
        navigate("/auth/verification-sent", { 
          replace: true,
          state: { email: user.email }
        });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Don't render anything while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--border-dark)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">Loading SafeDoser...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or email not verified
  if (!isAuthenticated || (user && !user.email_verified && user.email !== "demo@safedoser.com")) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
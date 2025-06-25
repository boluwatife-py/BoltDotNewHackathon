import React from "react";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

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

  if (!isAuthenticated) {
    return null; // This will be handled by App.tsx routing
  }

  return <>{children}</>;
};

export default ProtectedRoute;
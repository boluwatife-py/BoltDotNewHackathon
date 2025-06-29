import React from "react";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't render anything while loading - let App.tsx handle the loading state
  if (isLoading) {
    return null;
  }

  // Don't render anything if not authenticated - let App.tsx handle the redirect
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
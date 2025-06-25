import React, { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface User {
  name: string;
  completedDoses: number;
  totalDoses: number;
  avatarUrl?: string;
}

const defaultUser: User = {
  name: "User",
  completedDoses: 3,
  totalDoses: 4,
  avatarUrl: "/defaultUser.png",
};

const UserContext = createContext<User>(defaultUser);

export const useUser = () => {
  const { user } = useAuth();
  const contextUser = useContext(UserContext);
  
  // If authenticated, use auth user data, otherwise use default
  if (user) {
    return {
      name: user.name,
      completedDoses: 3, // This would come from your supplement data
      totalDoses: 4,     // This would come from your supplement data
      avatarUrl: user.avatarUrl || "/defaultUser.png",
    };
  }
  
  return contextUser;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  return (
    <UserContext.Provider value={defaultUser}>
      {children}
    </UserContext.Provider>
  );
};
import React, { createContext, useContext, type ReactNode } from "react";

interface User {
  name: string;
  completedDoses: number;
  totalDoses: number;
  avatarUrl?: string;
}

const defaultUser: User = {
  name: "Jodie",
  completedDoses: 3,
  totalDoses: 4,
  avatarUrl: "/defaultUser.png",
};

const UserContext = createContext<User>(defaultUser);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // In a real app, you'd fetch this from localStorage or an API
  const user: User = defaultUser;

  return (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  );
};

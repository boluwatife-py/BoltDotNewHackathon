import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supplementsAPI } from "../config/api";

interface User {
  name: string;
  completedDoses: number;
  totalDoses: number;
  avatarUrl?: string;
}

const UserContext = createContext<User>({
  name: "User",
  completedDoses: 0,
  totalDoses: 0,
  avatarUrl: "/defaultUser.png",
});

export const useUser = () => {
  const { user } = useAuth();
  const contextUser = useContext(UserContext);
  
  // If authenticated, use auth user data, otherwise use default
  if (user) {
    return {
      name: user.name,
      completedDoses: contextUser.completedDoses,
      totalDoses: contextUser.totalDoses,
      avatarUrl: user.avatarUrl || "/defaultUser.png",
    };
  }
  
  return contextUser;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [supplementStats, setSupplementStats] = useState({
    completedDoses: 0,
    totalDoses: 0,
  });

  // Load supplement statistics when user changes
  useEffect(() => {
    if (user) {
      loadSupplementStats();
    } else {
      setSupplementStats({ completedDoses: 0, totalDoses: 0 });
    }
  }, [user]);

  const loadSupplementStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const { data } = await supplementsAPI.getAll(token);
      
      // Calculate today's supplement statistics
      let totalDoses = 0;
      let completedDoses = 0;

      data.forEach((supplement: any) => {
        // Parse times_of_day to count total doses for today
        let timesOfDay = supplement.times_of_day;
        if (typeof timesOfDay === 'string') {
          try {
            timesOfDay = JSON.parse(timesOfDay);
          } catch {
            timesOfDay = {};
          }
        }

        // Count total doses scheduled for today
        for (const period of ['Morning', 'Afternoon', 'Evening']) {
          const times = timesOfDay[period];
          if (Array.isArray(times)) {
            totalDoses += times.length;
          }
        }

        // In a real implementation, you would check supplement logs
        // For now, we'll simulate some completed doses
        if (supplement.remind_me) {
          // Simulate that some supplements have been taken
          const random = Math.random();
          if (random > 0.3) { // 70% chance of being taken
            completedDoses += Math.floor(totalDoses * 0.7);
          }
        }
      });

      setSupplementStats({
        completedDoses: Math.min(completedDoses, totalDoses),
        totalDoses
      });
    } catch (error) {
      console.error("Error loading supplement stats:", error);
      setSupplementStats({ completedDoses: 0, totalDoses: 0 });
    }
  };

  const contextValue: User = {
    name: user?.name || "User",
    completedDoses: supplementStats.completedDoses,
    totalDoses: supplementStats.totalDoses,
    avatarUrl: user?.avatarUrl || "/defaultUser.png",
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
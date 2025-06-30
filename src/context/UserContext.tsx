import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supplementsAPI, supplementLogsAPI } from "../config/api";

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
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  // Load supplement statistics when user changes or when explicitly refreshed
  useEffect(() => {
    if (user) {
      loadSupplementStats();
    } else {
      setSupplementStats({ completedDoses: 0, totalDoses: 0 });
    }
  }, [user]);

  // Function to load supplement statistics
  const loadSupplementStats = async () => {
    try {
      // Prevent too frequent refreshes (minimum 2 seconds between loads)
      const now = Date.now();
      if (now - lastRefreshTime < 2000) return;
      
      setLastRefreshTime(now);
      
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Get both supplements and today's logs
      const [supplementsResponse, logsResponse] = await Promise.all([
        supplementsAPI.getAll(token),
        supplementLogsAPI.getTodayLogs(token)
      ]);
      
      const supplements = supplementsResponse.data;
      const logs = logsResponse.data || [];
      
      // Calculate total doses from supplements
      let totalDoses = 0;
      
      supplements.forEach((supplement: any) => {
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
      });
      
      // Count completed doses from logs
      const completedDoses = logs.filter((log: any) => log.status === 'taken').length;

      setSupplementStats({
        completedDoses: Math.min(completedDoses, totalDoses),
        totalDoses
      });
    } catch (error) {
    }
  };

  // Set up a refresh interval to update stats periodically
  useEffect(() => {
    if (!user) return;
    
    // Refresh stats every 60 seconds
    const intervalId = setInterval(() => {
      loadSupplementStats();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  // Add a method to the context to allow manual refresh
  const refreshStats = () => {
    if (user) {
      loadSupplementStats();
    }
  };

  const contextValue: User & { refreshStats?: () => void } = {
    name: user?.name || "User",
    completedDoses: supplementStats.completedDoses,
    totalDoses: supplementStats.totalDoses,
    avatarUrl: user?.avatarUrl || "/defaultUser.png",
    refreshStats
  };

  return (
    <UserContext.Provider value={contextValue as User}>
      {children}
    </UserContext.Provider>
  );
};
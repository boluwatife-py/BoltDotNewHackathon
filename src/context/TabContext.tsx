// src/context/TabContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Tab = "Home" | "Scan" | "Scheduler" | "Chatbot" | "Settings";

const TabContext = createContext<{
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}>({ activeTab: "Home", setActiveTab: () => {} });

export const useTab = () => useContext(TabContext);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const location = useLocation();

  useEffect(() => {
    // Auto-update tab from route
    if (location.pathname.startsWith("/scan")) setActiveTab("Scan");
    else if (location.pathname.startsWith("/scheduler")) setActiveTab("Scheduler");
    else if (location.pathname.startsWith("/chatbot")) setActiveTab("Chatbot");
    else if (location.pathname.startsWith("/settings")) setActiveTab("Settings");
    else setActiveTab("Home");
  }, [location.pathname]);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

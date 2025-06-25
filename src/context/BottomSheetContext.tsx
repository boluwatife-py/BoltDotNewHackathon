import React, { createContext, useContext, useState, type ReactNode } from "react";

interface BottomSheetContextType {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (open: boolean) => void;
}

const BottomSheetContext = createContext<BottomSheetContextType>({
  isBottomSheetOpen: false,
  setIsBottomSheetOpen: () => {},
});

export const useBottomSheet = () => useContext(BottomSheetContext);

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <BottomSheetContext.Provider value={{ isBottomSheetOpen, setIsBottomSheetOpen }}>
      {children}
    </BottomSheetContext.Provider>
  );
};
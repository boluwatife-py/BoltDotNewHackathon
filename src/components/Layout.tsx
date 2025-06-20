import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="pb-[60px]">
      {children}
    </div>
  );
};

export default Layout;
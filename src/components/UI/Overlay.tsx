import React from "react";

interface OverlayProps {
  isVisible: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  backgroundColor?: string;
  opacity?: number;
}

const Overlay: React.FC<OverlayProps> = ({
  isVisible,
  onClick,
  children,
  backgroundColor = "black",
  opacity = 0.9,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-90">
      {/* Background layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor,
          opacity,
        }}
        onClick={onClick}
      />

      {/* Foreground content */}
      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Overlay;

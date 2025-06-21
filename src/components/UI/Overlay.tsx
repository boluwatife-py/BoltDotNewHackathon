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
    <div
      onClick={onClick}
      className="fixed inset-0 flex items-center justify-center z-90"
      style={{ backgroundColor, opacity }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default Overlay;

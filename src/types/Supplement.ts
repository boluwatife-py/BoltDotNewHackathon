type SupplementAlert = {
  message: string;
  type: "interaction" | "recall";
};

type SupplementItem = {
  id: number;
  time: string;
  name: string;
  muted: boolean;
  tags: string[];
  alerts?: SupplementAlert[];
  type: "default" | "gummy" | "liquid" | "powder" | "softgel" | "tablet";
  completed: boolean;
};

interface SupplementCardProps {
  supplements: SupplementItem[];
  onToggleMute: (id: number) => void;
  onToggleCompleted: (id: number) => void;
}

// Legacy supplement type for backward compatibility
export interface Supplement {
  id: number;
  name: string;
  exp: string;
  qty: string;
  image: string;
  brand: string;
  freqency: string;
  dose: string;
  tod: string;
  iteractions: string;
  muted: boolean;
  type: string;
}

export type { SupplementItem, SupplementAlert, SupplementCardProps };
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

export type { SupplementItem, SupplementAlert, SupplementCardProps };
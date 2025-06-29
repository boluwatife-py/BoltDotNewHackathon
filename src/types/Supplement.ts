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
  period: "Morning" | "Afternoon" | "Evening";
  supplementId: number; // Original supplement ID from database
  logId?: string; // Log ID if completion status is tracked
};

interface SupplementCardProps {
  supplements: SupplementItem[];
  onToggleMute: (id: number) => void;
  onToggleCompleted: (id: number) => void;
}

// Supplement log type for tracking completion
export interface SupplementLog {
  id: string;
  user_id: string;
  supplement_id: number;
  scheduled_time: string; // HH:MM format
  taken_at?: string; // ISO timestamp when marked as taken
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  notes?: string;
  created_at: string;
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
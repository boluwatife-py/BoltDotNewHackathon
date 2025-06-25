// Form data types that match the manual entry form
export type DosageFormType = 
  | "Tablet" 
  | "Chewable" 
  | "Softgel" 
  | "Liquid" 
  | "Powder" 
  | "Gummy" 
  | "Pill" 
  | "Other";

export type FrequencyType = 
  | "Once daily"
  | "Twice daily" 
  | "Three times daily"
  | "Every other day"
  | "Weekly"
  | "As needed (PRN)"
  | "Custom";

export type TimeOfDayPeriod = "Morning" | "Afternoon" | "Evening";

export interface DoseData {
  quantity: string;
  unit: string | null;
}

export interface InteractionData {
  fixedInteractions: Array<{
    text: string;
    checked: boolean;
  }>;
  customInteractions: Array<{
    text: string;
    checked: boolean;
  }>;
}

export interface TimesOfDayData {
  Morning: Date[];
  Afternoon: Date[];
  Evening: Date[];
}

export interface FormData {
  supplementName: string;
  dosageForm: DosageFormType | null;
  brandName: string;
  dose: DoseData;
  frequency: FrequencyType | null;
  timesOfDay: TimesOfDayData;
  interactions: InteractionData;
  remindMe: boolean;
}

// Updated supplement type that matches the form structure
export interface SupplementData {
  id: number;
  name: string;
  brand: string;
  dosageForm: DosageFormType;
  dose: DoseData;
  frequency: FrequencyType;
  timesOfDay: TimesOfDayData;
  interactions: string[]; // Array of interaction strings
  remindMe: boolean;
  expirationDate: string;
  quantity: string; // e.g., "60 tablets", "120 capsules"
  image?: string;
}
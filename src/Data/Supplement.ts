import { type SupplementItem } from "../types/Supplement";
import { type SupplementData } from "../types/FormData";

const supplementsToday: SupplementItem[] = [
  {
    id: 1,
    time: "14:00",
    name: "Vitamin C",
    muted: false,
    completed: false,
    type: "tablet",
    tags: ["#Immunity", "#Daily"],
  },
  {
    id: 2,
    time: "07:00",
    name: "Omega-3",
    muted: false,
    completed: false,
    type: "gummy",
    tags: ["#Heart", "#withFood"],
    alerts: [
      { message: "Take with food for better absorption", type: "interaction" },
    ],
  },
  {
    id: 3,
    time: "18:00",
    name: "Magnesium",
    muted: true,
    completed: false,
    type: "default",
    tags: ["#Sleep", "#Evening"],
  },
  {
    id: 4,
    time: "08:00",
    name: "Vitamin D3",
    muted: false,
    completed: false,
    type: "gummy",
    tags: ["#Bone", "#Morning"],
    alerts: [
      { message: "Best absorbed with fat-containing meal", type: "interaction" },
    ],
  },
  {
    id: 5,
    time: "16:00",
    name: "Probiotics",
    muted: false,
    completed: false,
    type: "default",
    tags: ["#Gut", "#Afternoon"],
  },
  {
    id: 6,
    time: "20:00",
    name: "Melatonin",
    muted: false,
    completed: false,
    type: "tablet",
    tags: ["#Sleep", "#Bedtime"],
  },
];

export default supplementsToday;

// Updated supplements data with proper typing
export const supplements: SupplementData[] = [
  {
    id: 1,
    name: "Omega-3 Fish Oil",
    brand: "NutriHealth",
    dosageForm: "Softgel",
    dose: {
      quantity: "2",
      unit: "Capsule"
    },
    frequency: "Once daily",
    timesOfDay: {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [],
      Evening: []
    },
    interactions: [],
    remindMe: true,
    expirationDate: "2025-03-15",
    quantity: "120 softgels",
    image: ""
  },
  {
    id: 2,
    name: "Vitamin D3",
    brand: "Solaray",
    dosageForm: "Softgel",
    dose: {
      quantity: "1",
      unit: "Softgel"
    },
    frequency: "Once daily",
    timesOfDay: {
      Morning: [],
      Afternoon: [],
      Evening: [new Date(new Date().setHours(18, 0, 0, 0))]
    },
    interactions: ["Avoid with high calcium"],
    remindMe: true,
    expirationDate: "2026-08-10",
    quantity: "5000 IU",
    image: ""
  },
  {
    id: 3,
    name: "Magnesium Citrate",
    brand: "Nature's Best",
    dosageForm: "Tablet",
    dose: {
      quantity: "1",
      unit: "Tablet"
    },
    frequency: "Twice daily",
    timesOfDay: {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [],
      Evening: [new Date(new Date().setHours(20, 0, 0, 0))]
    },
    interactions: ["Mild laxative effect"],
    remindMe: true,
    expirationDate: "2025-12-01",
    quantity: "200mg",
    image: ""
  },
  {
    id: 4,
    name: "Multivitamin Plus",
    brand: "Centrum",
    dosageForm: "Tablet",
    dose: {
      quantity: "1",
      unit: "Tablet"
    },
    frequency: "Once daily",
    timesOfDay: {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [],
      Evening: []
    },
    interactions: ["Avoid with other vitamin A supplements"],
    remindMe: true,
    expirationDate: "2025-07-22",
    quantity: "1 tablet",
    image: ""
  },
  {
    id: 5,
    name: "Probiotic Blend",
    brand: "GutHealth",
    dosageForm: "Pill",
    dose: {
      quantity: "1",
      unit: "Capsule"
    },
    frequency: "Once daily",
    timesOfDay: {
      Morning: [],
      Afternoon: [],
      Evening: [new Date(new Date().setHours(21, 0, 0, 0))]
    },
    interactions: [],
    remindMe: true,
    expirationDate: "2025-09-10",
    quantity: "10 billion CFU",
    image: ""
  },
  {
    id: 6,
    name: "Collagen Peptides",
    brand: "BeautyPlus",
    dosageForm: "Powder",
    dose: {
      quantity: "2",
      unit: "scoop"
    },
    frequency: "Once daily",
    timesOfDay: {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [],
      Evening: []
    },
    interactions: ["Avoid with blood thinners"],
    remindMe: true,
    expirationDate: "2025-06-18",
    quantity: "5000mg",
    image: ""
  },
  {
    id: 7,
    name: "Turmeric Extract",
    brand: "HerbalLife",
    dosageForm: "Pill",
    dose: {
      quantity: "1",
      unit: "Capsule"
    },
    frequency: "Once daily",
    timesOfDay: {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [],
      Evening: []
    },
    interactions: ["Monitor with blood thinners"],
    remindMe: true,
    expirationDate: "2025-04-01",
    quantity: "1000mg",
    image: ""
  },
  {
    id: 8,
    name: "Calcium + Vitamin D",
    brand: "BoneSupport",
    dosageForm: "Tablet",
    dose: {
      quantity: "1",
      unit: "Tablet"
    },
    frequency: "Once daily",
    timesOfDay: {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [],
      Evening: []
    },
    interactions: ["Avoid excess iron supplements"],
    remindMe: true,
    expirationDate: "2025-08-30",
    quantity: "1000mg",
    image: ""
  },
];
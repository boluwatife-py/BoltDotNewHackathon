// import { X } from "lucide-react";
// import { supplements } from "../../Data/Supplement";

// interface BottomSheetProps {
//   isOpen: boolean;
//   onClose: () => void;
//   supplement: Supplements | null;
// }

// export default function BottomSheet({ isOpen, onClose, supplement }: BottomSheetProps) {
//   if (!isOpen || !supplement) return null;

//   return (
//     <>
//       {/* Background overlay */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50 z-40"
//         onClick={onClose}
//       />

//       {/* Bottom sheet */}
//       <div
//         className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 z-50 transform transition-transform duration-300 ${
//           isOpen ? "translate-y-0" : "translate-y-full"
//         }`}
//       >
//         {/* Drag handle */}
//         <div className="w-16 h-1 bg-gray-300 rounded mx-auto mb-4" />

//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">{supplement.name}</h2>
//           <button onClick={onClose}>
//             <X className="w-6 h-6 text-gray-500" />
//           </button>
//         </div>

//         {/* Details */}
//         <div className="space-y-2 text-sm text-gray-800">
//           <p><strong>Dosage:</strong> {supplement.dose || "N/A"}</p>
//           <p><strong>Frequency:</strong> {supplement.freqency || "N/A"}</p>
//           <p><strong>Time of day:</strong> {supplement.tod || "N/A"}</p>
//           <p><strong>Brand:</strong> {supplement.brand || "N/A"}</p>
//           <p><strong>Interactions:</strong> {supplement.iteractions || "None"}</p>
//         </div>

//         {/* Action */}
//         <button
//           className="w-full mt-6 border border-[var(--text-primary)] rounded py-2 text-center font-medium text-[var(--text-primary)]"
//           onClick={onClose}
//         >
//           Edit Details
//         </button>
//       </div>
//     </>
//   );
// }

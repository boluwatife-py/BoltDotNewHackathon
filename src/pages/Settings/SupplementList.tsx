import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeadInfo from "../../components/UI/HeadInfo";
import { Search } from "lucide-react";
import SuppList from "../../components/Settings/SupplementList";
import BottomSheet from "../../components/Settings/BottomSheet";
import AddButton from "../../components/NewSupp";
import { supplements } from "../../Data/Supplement";
import { type SupplementData } from "../../types/FormData";
import { useBottomSheet } from "../../context/BottomSheetContext";

export default function SupplementList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedSupp, setSelectedSupp] = useState<SupplementData | null>(null);
  const { setIsBottomSheetOpen: setGlobalBottomSheetOpen } = useBottomSheet();

  const handleOpen = (supplement: SupplementData) => {
    setSelectedSupp(supplement);
    setIsBottomSheetOpen(true);
    setGlobalBottomSheetOpen(true);
  };

  const handleClose = () => {
    setIsBottomSheetOpen(false);
    setSelectedSupp(null);
    setGlobalBottomSheetOpen(false);
  };

  const handleBackNavigation = () => {
    if (isBottomSheetOpen) {
      handleClose();
    } else {
      navigate("/settings");
    }
  };

  // Close bottom sheet when component unmounts (navigation away)
  useEffect(() => {
    return () => {
      setGlobalBottomSheetOpen(false);
    };
  }, [setGlobalBottomSheetOpen]);

  const filteredSupplements = supplements.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo 
        text="My Supplements" 
        prevType="Close" 
        onPrevClick={handleBackNavigation}
      />

      {/* Search */}
      <div className="px-[1rem] py-[0.75rem]">
        <div className="px-[1rem] py-[0.5rem] flex items-center rounded-[0.75rem] bg-[#EEE] gap-[.75rem] border border-[#EEE] has-focus-within:border-[var(--text-primary)] transition-all">
          <div className="h-[1.5rem] w-[1.5rem]">
            <Search className="text-[var(--text-placeholder)]" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="py-[.5rem] outline-0 placeholder:text-[var(--text-placeholder)] w-full"
            placeholder="Search supplements"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchInputRef.current?.blur();
              }
            }}
          />
        </div>
      </div>

      {/* Filtered list */}
      <div className="flex-1 overflow-y-auto">
        {filteredSupplements.length > 0 ? (
          filteredSupplements.map((s) => (
            <SupplementListItem
              key={s.id}
              supplement={s}
              onOptionsClick={() => handleOpen(s)}
            />
          ))
        ) : (
          <p className="text-center text-[var(--text-secondary)] mt-8">
            No supplements found.
          </p>
        )}
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleClose}
        supplement={selectedSupp}
      />

      <AddButton />
    </div>
  );
}

// Component to display supplement list items with proper typing
function SupplementListItem({ 
  supplement, 
  onOptionsClick 
}: { 
  supplement: SupplementData; 
  onOptionsClick: () => void; 
}) {
  return (
    <div className="py-[0.75rem] px-[1rem] flex items-center gap-[0.5rem] border-b border-[var(--border-grey)]">
      <div
        className="w-[4.375rem] h-[4.375rem] flex-shrink-0 rounded-[0.5rem] bg-center bg-cover"
        style={{ backgroundImage: supplement.image ? `url(${supplement.image})` : 'none' }}
      >
        {!supplement.image && (
          <div className="w-full h-full bg-orange-200 rounded-[0.5rem] flex items-center justify-center">
            <span className="text-orange-600 text-2xl">💊</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-medium truncate text-[1.25rem]">
          {supplement.name}
        </h3>
        <span className="text-[1.0625rem] text-[#61758A]">
          Expires: {supplement.expirationDate}
        </span>
        <span className="text-[0.75rem] font-medium text-[#61758A]">
          {supplement.quantity}
        </span>
      </div>
      <button
        className="flex-shrink-0 w-5 h-5 cursor-pointer"
        onClick={onOptionsClick}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6C10.5523 6 11 5.55228 11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5C9 5.55228 9.44772 6 10 6Z" fill="currentColor"/>
          <path d="M10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z" fill="currentColor"/>
          <path d="M10 16C10.5523 16 11 15.5523 11 15C11 14.4477 10.5523 14 10 14C9.44772 14 9 14.4477 9 15C9 15.5523 9.44772 16 10 16Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
}
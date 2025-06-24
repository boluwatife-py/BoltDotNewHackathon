import { useState, useRef } from "react";
import HeadInfo from "../../components/UI/HeadInfo";
import { Search } from "lucide-react";
import SuppList from "../../components/Settings/SupplementList";
import AddButton from "../../components/NewSupp";
import { supplements } from "../../Data/Supplement";

export default function SupplementList() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  // const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  // interface Supplement {
  //   id: number;
  //   name: string;
  //   exp: string;
  //   qty: string;
  //   image: string;
  //   brand: string;
  //   freqency: string;
  //   dose: string;
  //   tod: string;
  //   iteractions: string;
  //   muted: boolean;
  //   type: string;
  // }

  // const [selectedSupp, setSelectedSupp] = useState<Supplement | null>(null);

  // const handleOpen = (supplement: Supplement) => {
  //   setSelectedSupp(supplement);
  //   setIsBottomSheetOpen(true);
  // };

  const filteredSupplements = supplements.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="My Supplements" prevType="Close" />

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
                searchInputRef.current?.blur(); // <- lose focus on enter
              }
            }}
          />
        </div>
      </div>

      {/* Filtered list */}
      <div className="flex-1 overflow-y-auto">
        {filteredSupplements.length > 0 ? (
          filteredSupplements.map((s) => (
            <SuppList
              key={s.id}
              supplement={s}
              onOptionsClick={() => {
                // handleOpen(s);
              }}
            />
          ))
        ) : (
          <p className="text-center text-[var(--text-secondary)] mt-8">
            No supplements found.
          </p>
        )}
      </div>

      <AddButton />
    </div>
  );
}

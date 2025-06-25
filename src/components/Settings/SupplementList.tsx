import { Ellipsis } from "lucide-react";
import PillImage from "../../assets/images/Pill.jpg";
import { type Supplement } from "../../types/Supplement";

interface SuppListProps {
  supplement: Supplement;
  onOptionsClick: () => void;
} 

export default function SuppList({
  supplement,
  onOptionsClick,
}: SuppListProps) {
  return (
    <div className="py-[0.75rem] px-[1rem] flex items-center gap-[0.5rem] border-b border-[var(--border-grey)]">
      <div
        className="w-[4.375rem] h-[4.375rem] flex-shrink-0 rounded-[0.5rem] bg-center bg-cover"
        style={{ backgroundImage: `url(${supplement.image || PillImage})` }}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-medium truncate text-[1.25rem]">
          {supplement.name}
        </h3>
        <span className="text-[1.0625rem] text-[#61758A]">
          Expires: {supplement.exp}
        </span>
        <span className="text-[0.75rem] font-medium text-[#61758A]">
          {supplement.qty}
        </span>
      </div>
      <Ellipsis
        className="flex-shrink-0 w-5 h-5 cursor-pointer"
        onClick={onOptionsClick}
      />
    </div>
  );
}

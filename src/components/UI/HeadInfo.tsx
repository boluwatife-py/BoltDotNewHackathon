import { useNavigate } from "react-router-dom";

interface PageProps {
  text: string;
  prevType?: string;
  onPrevClick?: () => void;
}

export default function HeadInfo({ text, prevType, onPrevClick }: PageProps) {
  const navigate = useNavigate();

  const handlePrevClick = () => {
    if (onPrevClick) {
      onPrevClick();
    } else {
      navigate(-1); // go back if no handler is passed
    }
  };

  return (
    <div className="px-[1rem] pt-[1rem] pb-[0.5rem] flex items-center justify-center self-stretch gap-[-1.75rem] relative border-b-[#EEE] border-t border bg-white">
      {prevType && (
        <button
          onClick={handlePrevClick}
          className="absolute ml-[.5rem] text-[var(--text-cancel)] left-0 text-[0.75rem]"
        >
          <span>{prevType}</span>
        </button>
      )}
      <h2 className="text-[1.375rem] font-semibold text-center text-[var(--text-primary)]">
        {text}
      </h2>
    </div>
  );
}

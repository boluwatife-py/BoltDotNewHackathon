import Check from "../../assets/icons/check.svg";

interface BtnChecklistProps {
  onToggle: () => void;
  checked: boolean;
}

function ButtonChecklist({ onToggle, checked }: BtnChecklistProps) {
  console.log(`🔘 Rendering ButtonChecklist with checked=${checked}`);
  return (
    <button
      className={`mt-2 w-[36px] h-[36px] flex items-center justify-center p-[0.375rem] rounded-full border-2 cursor-pointer transition-all duration-300 ${
        checked ? "bg-[var(--primary-color)] border-[var(--primary-color)]" : "bg-white border-[#CCC]"
      }`}
      onClick={onToggle}
    >
      <img src={Check} alt="Checked" className="w-[1.5rem] h-[1.5rem]" />
    </button>
  );
}

export default ButtonChecklist;
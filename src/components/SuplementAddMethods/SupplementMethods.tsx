type MethodProps = {
  icon: string;
  onSelect: () => void;
  name: string;
  description: string;
  isSelected?: boolean;
};

export default function AddMethod({
  icon,
  onSelect,
  name,
  description,
  isSelected = false,
}: MethodProps) {
  return (
    <button
      className={`py-[0.5rem] px-[0.63rem] flex justify-start items-start gap-[0.5rem] self-stretch rounded-[0.75rem] border-[#EEE] bg-white w-full mr-[0.5rem] cursor-pointer transition-all border-2
        ${
          isSelected
            ? "bg-[var(--primary-light)] border-[var(--primary-color)]"
            : "hover:bg-[var(--primary-light)] hover:border-[var(--primary-color)]"
        }`}
      onClick={onSelect}
    >
      <div className="rounded-[0.5rem] px-[0.625rem] flex justify-center items-center w-[3rem] h-[3rem] bg-[var(--primary-color)]">
        <img src={icon} alt="" />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-semibold text-[1.0625rem] text-[var(--text-primary)]">
          {name}
        </span>
        <span className="text-[var(--text-light)] font-medium text-[0.75rem]">
          {description}
        </span>
      </div>
    </button>
  );
}

export type { MethodProps };

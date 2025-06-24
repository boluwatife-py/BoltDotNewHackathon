import Pill from "../../assets/images/scan-pill.png";

export default function SuppDetails({
  name,
  description,
}: {
  name: string;
  description?: string;
  imageSrc?: string;
}) {
  return (
    <div className="px-[1rem] py-[0.75rem] flex items-center self-stretch gap-[0.75rem]">
      <img
        src={Pill}
        alt="SafeDoser"
        className="w-[4.6875rem] h-[4.6875rem] rounded-[0.5rem] overflow-hidden"
      />
      <div className="flex flex-col items-start justify-center">
        <span className="text-[1.25rem] font-medium ">{name}</span>
        <span className="text-[0.75rem] text-[var(--text-placeholder)]">
          {description}
        </span>
      </div>
    </div>
  );
}

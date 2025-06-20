export default function Button({
  text,
  className,
  handleClick
}: {
  text: string;
  className?: string;
  handleClick: ()=> void
}) {
  return (
    <div
      className={`flex items-center justify-center px-[1rem] pt-[0.75rem] pb-[1rem] ${className}`}
    >
      <button
        className={`w-full flex px-[1.25rem] h-[3rem] justify-center items-center rounded-[1.5rem] bg-[var(--primary-color)] cursor-pointer`} onClick={handleClick}
      >
        <span className="text-white overflow-ellipsis font-bold text-[1.0625rem] text-center">
          {text}
        </span>
      </button>
    </div>
  );
}

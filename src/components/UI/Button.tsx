export default function Button({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <button
      className={`w-full flex px-[1.25rem] max-w-[30rem] min-5-[5.25rem] h-[3rem] justify-center items-center rounded-[1.5rem] bg-[var(--primary-color)] ${className}`}
    >
      <span className="text-white overflow-ellipsis font-bold text-[1.0625rem] text-center">
        {text}
      </span>
    </button>
  );
}

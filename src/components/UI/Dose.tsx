type InputState = "default" | "success" | "error";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState;
  handleClick: ()=> void
}

export default function Dose({ state, handleClick }: InputFieldProps) {
  return (
    <div
      className={`relative flex items-center justify-center w-full border rounded-[0.75rem] bg-[var(--border-dark) ${
        state === "error" ? "border-[var(--alarm-danger)]" : "border-[#CCC]"
      }`}
    >
      <input
        type="text"
        className="px-[1rem] border py-[0.75rem] w-25 text-end rounded-bl-[0.75rem] rounded-tl-[0.75rem] border-l-0 border-t-0 border-b-0 placeholder-[#6B7280] outline-none focus:outline-none focus:border-r-[#CCC] border-r-2 focus:border-[var(--primary-color)] border-r-[#CCC]"
        placeholder="Qty"
        name="dose"
        id="dose"
      />
      <button
        className="w-80 px-[1rem] py-[0.75rem] text-start rounded-br-[0.75rem] rounded-tr-[0.75rem] text-[#6B7280] border-none"
        type="button"
        onClick={handleClick}
      >
        Select Unit
      </button>
    </div>
  );
}

export default function UserChat({
  name,
  userAvatar,
  text,
  isLoading = false,
}: {
  name: string;
  userAvatar?: string;
  text?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="py-[1rem] flex items-end gap-2 self-end max-w-[22.5rem] min-h-[2.8125rem] animate-[popin_0.3s_ease-out]">
      <div className="flex gap-[0.75rem]">
        <div className="flex flex-col gap-[0.25rem]">
          <span className="font-medium text-[#6B7280] text-[0.875rem] self-end">
            {name}
          </span>
          <div className="bg-[var(--primary-color)] border border-[#CCC] pr-[1rem] pl-[0.75rem] py-[0.75rem] rounded-[1.25rem] rounded-tr text-white text-[1.0625rem] leading-snug w-fit max-w-[22.5rem] min-h-[2.5rem] flex items-center">
            {isLoading ? (
              <div className="flex flex-row gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
              </div>
            ) : (
              text
            )}
          </div>
        </div>
        <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] overflow-hidden rounded-full border border-[var(--primary-dark)] bg-[var(--border-dark)]">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[1rem] text-[var(--text-secondary)] font-bold">
              {name[0]?.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
interface Method {
  id: number;
  icon: string;
  text: string;
  title: string;
  subTitle: string
}

export default function MethodCard({id, icon, text, title, subTitle}:Method) {
  return (
    <div className="px-[1rem] py-[1.25rem] bg-white border border-[var(--border-grey)] rounded-[0.75rem] text-[var(--text-primary)]">
      <div>
        <h1 className="font-semibold">{id}. {title}</h1>
        <div className="pl-[1.12rem] pb-[0.5rem]">
          <span className="text-[1.0625rem] font-medium">
            {subTitle}
          </span>
        </div>
        <div className="flex items-center justify-center gap-[0.5rem]">
          <div className="w-[3rem] h-[3rem] rounded-[0.5rem] bg-[var(--primary-light)] flex-shrink-0 flex items-center justify-center">
            <img src={icon} alt="" />
          </div>
          <span className="text-[0.75rem] font-medium flex-1 min-w-0 whitespace-normal text-[var(--text-secondary)]">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}

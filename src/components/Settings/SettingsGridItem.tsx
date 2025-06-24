import Right from "../../assets/icons/arrow-right.svg";
import { Link } from "react-router-dom";

export default function SettingsGridItem({link, icon, text, subtext}:{link:string, icon:string, text:string, subtext:string}) {
  return (
    <Link className="group py-[0.5rem] flex items-center justify-between" to={link}>
      <div className="flex items-center gap-[1rem]">
        <div className="w-[3rem] h-[3rem] flex items-center justify-center bg-[var(--primary-light)] rounded-[0.5rem]">
          <img src={icon} alt="safeDose" className="w-[1.5rem] h-[1.5rem]" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[var(--text-primary)] text-[1.0625rem]">
            {text}
          </h3>
          <span className="text-[var(--text-secondary)] text-[0.75rem] font-medium">
            {subtext}
          </span>
        </div>
      </div>
      <div className="w-[1.5rem] h-[1.5rem] transition-transform duration-200 group-hover:translate-x-1">
        <img src={Right} alt="" />
      </div>
    </Link>
  );
}

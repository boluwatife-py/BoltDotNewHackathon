import Default from "../../assets/icons/SupplementIcons/defaultsupp.svg";
import Gummy from "../../assets/icons/SupplementIcons/gummysupp.svg";
import Liquid from "../../assets/icons/SupplementIcons/liquidsupp.svg";
import Powder from "../../assets/icons/SupplementIcons/powdersupp.svg";
import SoftGel from "../../assets/icons/SupplementIcons/softgelsupp.svg";
import Tablet from "../../assets/icons/SupplementIcons/tabletsupp.svg";

type IconType =
  | "default"
  | "gummy"
  | "liquid"
  | "powder"
  | "softgel"
  | "tablet";

interface SuppIconProps {
  iconType: IconType;
  status: "completed" | "missed" | "current" | "default";
}

const iconMap: Record<IconType, string> = {
  default: Default,
  gummy: Gummy,
  liquid: Liquid,
  powder: Powder,
  softgel: SoftGel,
  tablet: Tablet,
};

export default function SuppIcon({
  iconType = "default",
  status,
}: SuppIconProps) {
  console.log(`🔍 Rendering SuppIcon with status=${status}, iconType=${iconType}`);
  const selectedIcon = iconMap[iconType];
  const iconBgColor =
    status === "missed" ? "bg-black/20" : "bg-[var(--primary-color)]";

  return (
    <div
      className={`text-2xl p-[12px] rounded-[12px] w-[48px] h-[48px] flex items-center justify-center ${iconBgColor} transition-colors duration-300`}
    >
      <img src={selectedIcon} alt={`Supplement icon ${iconType}`} />
    </div>
  );
}
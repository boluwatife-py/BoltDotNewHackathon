import HeadInfo from "../components/UI/HeadInfo";
import SettingsGridItem from "../components/Settings/SettingsGridItem";
import User from "../assets/icons/Settings/user.svg";
import Reminder from "../assets/icons/Settings/reminder.svg"
import FamilyManagement from "../assets/icons/Settings/family-management.svg"
import SupplementLIst from "../assets/icons/Settings/supplists.svg"
import Display from "../assets/icons/Settings/DisplayPreference.svg"
import Privacy from "../assets/icons/Settings/privacy.svg"
import AppInfo from "../assets/icons/Settings/AppInfo.svg"

const settingsItems: {
  link: string;
  icon: string;
  text: string;
  subtext: string;
}[] = [
  {
    link: "",
    icon: User,
    subtext: "Manage your profile and preferences",
    text: "Account Settings",
  },
  {
    link: "",
    icon: Reminder,
    subtext: "Customize your reminder settings",
    text: "Reminder Settings",
  },
  {
    link: "",
    icon: FamilyManagement,
    subtext: "Manage your family members",
    text: "Family Management",
  },
  {
    link: "/settings/supplement-list",
    icon: SupplementLIst,
    subtext: "Manage your enrolled supplements",
    text: "My Supplement lists",
  },
  {
    link: "",
    icon: Display,
    subtext: "Adjust display settings",
    text: "Display Preferences",
  },
  {
    link: "",
    icon: Privacy,
    subtext: "Manage your privacy and data",
    text: "Privacy & Data Settings",
  },
  {
    link: "",
    icon: AppInfo,
    subtext: "View app information",
    text: "App Info",
  },
];

export default function Settings() {
  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Settings" />

      <div className="flex flex-col px-[1rem]">
        {settingsItems.map((item) => {
          return (
            <SettingsGridItem
              icon={item.icon}
              link={item.link}
              subtext={item.subtext}
              text={item.text}
            ></SettingsGridItem>
          );
        })}
      </div>
    </div>
  );
}

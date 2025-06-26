import HeadInfo from "../components/UI/HeadInfo";
import SettingsGridItem from "../components/Settings/SettingsGridItem";
import { useAuth } from "../context/AuthContext";
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
    link: "/settings/privacy-data",
    icon: Privacy,
    subtext: "Manage your privacy and data",
    text: "Privacy & Data Settings",
  },
  {
    link: "/settings/app-info",
    icon: AppInfo,
    subtext: "View app information",
    text: "App Info",
  },
];

export default function Settings() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Settings" />

      {/* User Info Section */}
      <div className="bg-white mx-4 mt-4 rounded-lg p-4 border border-[var(--border-grey)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--primary-light)]">
            <img
              src={user?.avatarUrl || "/defaultUser.png"}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">{user?.name}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-[1rem] mt-4">
        {settingsItems.map((item) => {
          return (
            <SettingsGridItem
              key={item.text}
              icon={item.icon}
              link={item.link}
              subtext={item.subtext}
              text={item.text}
            ></SettingsGridItem>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
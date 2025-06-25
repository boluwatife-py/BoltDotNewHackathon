import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, type ThemeMode, type FontSize } from "../../context/ThemeContext";
import HeadInfo from "../../components/UI/HeadInfo";
import { Sun, Moon, Monitor, Type, Check } from "lucide-react";

const DisplayPreferences: React.FC = () => {
  const navigate = useNavigate();
  const { themeMode, fontSize, setThemeMode, setFontSize } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      mode: "light",
      label: "Light",
      icon: <Sun className="w-5 h-5" />,
      description: "Always use light theme"
    },
    {
      mode: "dark", 
      label: "Dark",
      icon: <Moon className="w-5 h-5" />,
      description: "Always use dark theme"
    },
    {
      mode: "system",
      label: "System",
      icon: <Monitor className="w-5 h-5" />,
      description: "Follow system preference"
    }
  ];

  const fontSizeOptions: { size: FontSize; label: string; description: string; preview: string }[] = [
    {
      size: "small",
      label: "Small",
      description: "Compact text for more content",
      preview: "Aa"
    },
    {
      size: "medium",
      label: "Medium",
      description: "Default comfortable reading",
      preview: "Aa"
    },
    {
      size: "large",
      label: "Large", 
      description: "Larger text for better readability",
      preview: "Aa"
    }
  ];

  return (
    <div className="bg-[var(--bg-primary)] dark:bg-gray-900 min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo 
        text="Display Preferences" 
        prevType="Back"
        onPrevClick={() => navigate("/settings")}
      />

      <div className="flex-1 p-4 space-y-6">
        {/* Theme Selection */}
        <div className="bg-[var(--bg-secondary)] dark:bg-gray-800 rounded-lg p-4 border border-[var(--border-grey)] dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[var(--primary-light)] dark:bg-[var(--primary-color)]/20 rounded-lg flex items-center justify-center">
              <Sun className="w-4 h-4 text-[var(--primary-color)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-white">
              Theme
            </h3>
          </div>
          
          <div className="space-y-3">
            {themeOptions.map((option) => (
              <button
                key={option.mode}
                onClick={() => setThemeMode(option.mode)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  themeMode === option.mode
                    ? "border-[var(--primary-color)] bg-[var(--primary-light)] dark:bg-[var(--primary-color)]/10"
                    : "border-[var(--border-grey)] dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-[var(--primary-color)]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${themeMode === option.mode ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)] dark:text-gray-400"}`}>
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <div className={`font-medium ${themeMode === option.mode ? "text-[var(--primary-color)]" : "text-[var(--text-primary)] dark:text-white"}`}>
                      {option.label}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </div>
                {themeMode === option.mode && (
                  <Check className="w-5 h-5 text-[var(--primary-color)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Selection */}
        <div className="bg-[var(--bg-secondary)] dark:bg-gray-800 rounded-lg p-4 border border-[var(--border-grey)] dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[var(--primary-light)] dark:bg-[var(--primary-color)]/20 rounded-lg flex items-center justify-center">
              <Type className="w-4 h-4 text-[var(--primary-color)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-white">
              Font Size
            </h3>
          </div>
          
          <div className="space-y-3">
            {fontSizeOptions.map((option) => (
              <button
                key={option.size}
                onClick={() => setFontSize(option.size)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  fontSize === option.size
                    ? "border-[var(--primary-color)] bg-[var(--primary-light)] dark:bg-[var(--primary-color)]/10"
                    : "border-[var(--border-grey)] dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-[var(--primary-color)]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold ${
                    fontSize === option.size 
                      ? "border-[var(--primary-color)] text-[var(--primary-color)]" 
                      : "border-[var(--border-grey)] dark:border-gray-600 text-[var(--text-secondary)] dark:text-gray-400"
                  }`} style={{
                    fontSize: option.size === "small" ? "12px" : option.size === "large" ? "18px" : "14px"
                  }}>
                    {option.preview}
                  </div>
                  <div className="text-left">
                    <div className={`font-medium ${fontSize === option.size ? "text-[var(--primary-color)]" : "text-[var(--text-primary)] dark:text-white"}`}>
                      {option.label}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </div>
                {fontSize === option.size && (
                  <Check className="w-5 h-5 text-[var(--primary-color)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-[var(--bg-secondary)] dark:bg-gray-800 rounded-lg p-4 border border-[var(--border-grey)] dark:border-gray-700">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-white mb-4">
            Preview
          </h3>
          
          <div className="space-y-3 p-4 bg-[var(--border-dark)] dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-[var(--text-primary)] dark:text-white">
              SafeDoser
            </h4>
            <p className="text-[var(--text-secondary)] dark:text-gray-300">
              This is how your text will appear with the current settings. You can adjust the theme and font size to your preference.
            </p>
            <div className="flex gap-2">
              <span className="bg-[var(--primary-light)] dark:bg-[var(--primary-color)]/20 text-[var(--primary-color)] text-xs rounded-full px-3 py-1">
                #Sample
              </span>
              <span className="bg-[var(--primary-light)] dark:bg-[var(--primary-color)]/20 text-[var(--primary-color)] text-xs rounded-full px-3 py-1">
                #Tag
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPreferences;
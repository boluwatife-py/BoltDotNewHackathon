import { useState } from "react";
import TypeButton from "../../components/UI/TypeButton";
import HeadInfo from "../../components/UI/HeadInfo";
import Pill from "../../assets/icons/scan-pill.png";
import InputField from "../../components/UI/Input";
import Dose from "../../components/UI/Dose";
import Overlay from "../../components/UI/Overlay";
import Frequency from "../../components/UI/FrequencySelect";
import TimeOfDayPicker from "../../components/UI/TodPicker";

function AddManually() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDoseOverlayVisible, setIsDoseOverlayVisible] = useState(false);
  const [isFrequencyOverlayVisible, setIsFrequencyOverlayVisible] =
    useState(false);

  const solidOptions = ["Tablet", "Capsule", "Gummy", "Chewable"];
  const volumeOptions = [
    { label: "tsp", desc: "= 5mL" },
    { label: "tbsp", desc: "= 15mL" },
    { label: "fl oz", desc: "= 30mL" },
    { label: "scoop", desc: "= 30g" },
    { label: "mL" },
    { label: "mg" },
    { label: "g" },
  ];
  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Every other day",
    "Weekly",
    "As needed (PRN)",
    "Custom",
  ];

  const handleTypeSelect = (type: string) => setSelectedType(type);

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Supplement Details" prevType="Cancel" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Supp Details */}
          <div className="px-[1rem] py-[0.75rem] flex items-center self-stretch gap-[0.75rem]">
            <img
              src={Pill}
              alt="SafeDoser"
              className="w-[4.6875rem] h-[4.6875rem] rounded-[0.5rem] overflow-hidden"
            />
            <div className="flex flex-col items-start justify-center">
              <span className="text-[1.25rem] font-medium ">Vitamin D3</span>
              <span className="text-[0.75rem] text-[var(--text-placeholder)]">
                5000 (Strength)
              </span>
            </div>
          </div>

          {/* Dosage Form */}
          <div className="px-[1rem] pt-[0.75rem] flex items-end content-end self-stretch flex-wrap gap-[1rem]">
            <div className="pb-[0.5rem] self-stretch">
              <span className="text-[1.25rem] font-medium text-[var(--text-primary)]">
                Dosage Form
              </span>
            </div>
          </div>

          <form action="" onSubmit={(e) => e.preventDefault()}>
            {/* Dosage Tags */}
            <div className="grid grid-cols-3 gap-3 px-[1rem]">
              {[
                "Tablet",
                "Chewable",
                "Softgel",
                "Liquid",
                "Powder",
                "Gummy",
                "Pill",
                "Other",
              ].map((type) => (
                <TypeButton
                  key={type}
                  label={type}
                  selected={selectedType === type}
                  onClick={() => handleTypeSelect(type)}
                  type="button"
                />
              ))}
            </div>

            {/* Brand Name */}
            <div className="px-[1rem] py-[0.75rem] flex items-end content-end self-stretch flex-wrap">
              <div className="pb-[0.5rem] flex flex-col items-start">
                <label
                  htmlFor="brandname"
                  className="text-[1.25rem] font-medium "
                >
                  Brand
                </label>
              </div>
              <InputField
                placeholder="Brand Name"
                name="brandname"
              ></InputField>
            </div>

            {/* Dose */}
            <div className="px-[1rem] py-[0.75rem] flex items-end content-end self-stretch flex-wrap">
              <div className="pb-[0.5rem] flex flex-col items-start">
                <label htmlFor="dose" className="text-[1.25rem] font-medium ">
                  Dose
                </label>
              </div>
              <Dose handleClick={() => setIsDoseOverlayVisible(true)} />
            </div>

            {/* Overlay */}
            <Overlay
              isVisible={isDoseOverlayVisible}
              onClick={() => setIsDoseOverlayVisible(false)}
            >
              <div className="bg-white rounded-xl p-4 min-w-[15.625rem]">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#6B7280]">
                    SOLID
                  </span>
                  <ul className="mt-2 space-y-2">
                    {solidOptions.map((option) => (
                      <button
                        key={option}
                        className="text-base w-full text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#6B7280]">
                    VOLUME
                  </span>
                  <ul className="mt-2 space-y-2">
                    {volumeOptions.map((opt) => (
                      <button
                        key={opt.label}
                        className="text-base w-full text-left"
                      >
                        {opt.label}
                        {opt.desc && (
                          <span className="text-xs text-[#6B7280] ml-1">
                            {opt.desc}
                          </span>
                        )}
                      </button>
                    ))}
                  </ul>
                </div>
              </div>
            </Overlay>

            {/* Frequency */}
            <div className="px-[1rem] py-[0.75rem] flex items-end content-end self-stretch flex-wrap">
              <div className="pb-[0.5rem] flex flex-col items-start">
                <label
                  htmlFor="frequency"
                  className="text-[1.25rem] font-medium "
                >
                  Frequency
                </label>
              </div>
              <Frequency onClick={() => setIsFrequencyOverlayVisible(true)} />

              <Overlay
                isVisible={isFrequencyOverlayVisible}
                onClick={() => setIsFrequencyOverlayVisible(false)}
              >
                <div className="bg-white rounded-xl p-4 min-w-[22.375rem]">
                  <div className="mb-4">
                    <ul className="mt-2 space-y-2">
                      {frequencies.map((option) => (
                        <button
                          key={option}
                          className="text-base w-full text-left hover:text-[var(--primary-color)]"
                        >
                          {option}
                        </button>
                      ))}
                    </ul>
                  </div>
                </div>
              </Overlay>
            </div>

            {/* Time of Day */}

            <TimeOfDayPicker />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddManually;

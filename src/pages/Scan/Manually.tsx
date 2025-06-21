import { useState } from "react";
import TypeButton from "../../components/UI/TypeButton";
import HeadInfo from "../../components/UI/HeadInfo";
import Pill from "../../assets/icons/scan-pill.png";
import InputField from "../../components/UI/Input";
import Dose from "../../components/UI/Dose";
import Overlay from "../../components/UI/Overlay";
import Frequency from "../../components/UI/FrequencySelect";
import TimeOfDayPicker from "../../components/UI/TodPicker";
import InteractionsList from "../../components/IteractionList";
import Toggle from "../../components/UI/Toggle";
import Button from "../../components/UI/Button";

type FixedInteraction = { text: string; checked: boolean };
type CustomInteraction = { text: string; checked: boolean };
type InteractionsData = {
  fixedInteractions: FixedInteraction[];
  customInteractions: CustomInteraction[];
};

type FormData = {
  dosageForm: string | null;
  brandName: string;
  dose: { quantity: string; unit: string | null };
  frequency: string | null;
  timesOfDay: Record<string, Date[]>;
  interactions: InteractionsData;
  remindMe: boolean;
};

function AddManually() {
  const [formData, setFormData] = useState<FormData>({
    dosageForm: null,
    brandName: "",
    dose: { quantity: "", unit: null },
    frequency: null,
    timesOfDay: { Morning: [], Afternoon: [], Evening: [] },
    interactions: { fixedInteractions: [], customInteractions: [] },
    remindMe: false,
  });

  const [errors, setErrors] = useState({
    dosageForm: "",
    brandName: "",
    dose: "",
    frequency: "",
    timesOfDay: "",
  });

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

  const handleTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, dosageForm: type }));
    setErrors((prev) => ({ ...prev, dosageForm: "" }));
  };

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, brandName: e.target.value }));
    setErrors((prev) => ({ ...prev, brandName: "" }));
  };

  const handleFrequencySelect = (frequency: string) => {
    setFormData((prev) => ({ ...prev, frequency }));
    setErrors((prev) => ({ ...prev, frequency: "" }));
  };

  const handleInteractionsChange = (data: InteractionsData) => {
    setFormData((prev) => ({ ...prev, interactions: data }));
  };

  const handleToggleChange = (remindMe: boolean) => {
    setFormData((prev) => ({ ...prev, remindMe }));
  };

  const validateForm = () => {
    const newErrors = {
      dosageForm: "",
      brandName: "",
      dose: "",
      frequency: "",
      timesOfDay: "",
    };
    let isValid = true;

    if (!formData.dosageForm) {
      newErrors.dosageForm = "Please select a dosage form.";
      isValid = false;
    }
    if (!formData.brandName.trim()) {
      newErrors.brandName = "Please enter a brand name.";
      isValid = false;
    }
    if (!formData.dose.quantity || !formData.dose.unit) {
      newErrors.dose = "Please enter a dose quantity and select a unit.";
      isValid = false;
    }
    if (!formData.frequency) {
      newErrors.frequency = "Please select a frequency.";
      isValid = false;
    }
    if (
      !formData.timesOfDay.Morning.length &&
      !formData.timesOfDay.Afternoon.length &&
      !formData.timesOfDay.Evening.length
    ) {
      newErrors.timesOfDay = "Please set at least one time of day.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      supplement: "Vitamin D3",
      strength: "5000",
      dosageForm: formData.dosageForm,
      brandName: formData.brandName,
      dose: formData.dose,
      frequency: formData.frequency,
      timesOfDay: formData.timesOfDay,

      interactions: [
        ...formData.interactions.fixedInteractions
          .filter((i) => i.checked)
          .map((i) => i.text),
        ...formData.interactions.customInteractions
          .filter((i) => i.checked)
          .map((i) => i.text),
      ],

      remindMe: formData.remindMe,
    };

    console.log(payload);
  };

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

          <form action="" onSubmit={(e) => e.preventDefault()}>
            {/* Dosage Form */}
            <div className="px-[1rem] pt-[0.75rem] flex items-end content-end self-stretch flex-wrap gap-[1rem]">
              <div className="pb-[0.5rem] self-stretch">
                <span className="text-[1.25rem] font-medium text-[var(--text-primary)]">
                  Dosage Form
                </span>
                {errors.dosageForm && (
                  <p className="text-[var(--alarm-danger)] text-sm">
                    {errors.dosageForm}
                  </p>
                )}
              </div>
            </div>

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
                  selected={formData.dosageForm === type}
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
                state={errors.brandName ? "error" : "default"}
                onChange={handleBrandNameChange}
              ></InputField>
            </div>

            {/* Dose */}
            {/* Dose */}
            <div className="px-[1rem] py-[0.75rem] flex items-end content-end self-stretch flex-wrap">
              <div className="pb-[0.5rem] flex flex-col items-start">
                <label htmlFor="dose" className="text-[1.25rem] font-medium ">
                  Dose
                </label>
                {errors.dose && (
                  <p className="text-[var(--alarm-danger)] text-sm">
                    {errors.dose}
                  </p>
                )}
              </div>
              <Dose
                handleClick={() => setIsDoseOverlayVisible(true)}
                state={errors.dose ? "error" : "default"}
                value={formData.dose.quantity}
                unit={formData.dose.unit}
                onQuantityChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    dose: { ...prev.dose, quantity: e.target.value },
                  }));
                }}
              />
            </div>

            {/* Dose Overlay */}
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
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            dose: { ...prev.dose, unit: option },
                          }));
                          setIsDoseOverlayVisible(false);
                        }}
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
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            dose: { ...prev.dose, unit: opt.label },
                          }));
                          setIsDoseOverlayVisible(false);
                        }}
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
              <Frequency
                onClick={() => setIsFrequencyOverlayVisible(true)}
                value={formData.frequency || ""}
                state={errors.frequency ? "error" : "default"}
              />

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
                          onClick={() => {
                            handleFrequencySelect(option);
                            setIsFrequencyOverlayVisible(false);
                          }}
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
            <TimeOfDayPicker errors={errors.timesOfDay} />

            {/* Iteractions */}
            <InteractionsList
              onChange={handleInteractionsChange}
            ></InteractionsList>

            {/* Notification */}
            <div className="p-[1rem] flex items-center justify-between">
              <div className="py-[0.62rem] text-[1.0625rem] text-[var(--text-primary)]">
                <span>Remind me to take this medication</span>
              </div>
              <Toggle onChange={handleToggleChange}></Toggle>
            </div>
          </form>
        </div>

        <Button text="Save" handleClick={handleSubmit}></Button>
      </div>
    </div>
  );
}

export default AddManually;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TypeButton from "../../components/UI/TypeButton";
import HeadInfo from "../../components/UI/HeadInfo";
import InputField from "../../components/UI/Input";
import Dose from "../../components/UI/Dose";
import Overlay from "../../components/UI/Overlay";
import Frequency from "../../components/UI/FrequencySelect";
import TimeOfDayPicker from "../../components/UI/TodPicker";
import InteractionsList from "../../components/IteractionList";
import Toggle from "../../components/UI/Toggle";
import Button from "../../components/UI/Button";
import { supplementsAPI } from "../../config/api";
import { type FormData } from "../../types/FormData";

function AddManually() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in edit mode and have supplement data
  const editMode = location.state?.editMode || false;
  const supplementData = location.state?.supplementData as FormData | undefined;
  const scannedData = location.state?.scannedData;

  const [formData, setFormData] = useState<FormData>({
    supplementName: supplementData?.supplementName || scannedData?.name || "",
    supplementStrength: supplementData?.supplementStrength || scannedData?.strength || "",
    dosageForm: supplementData?.dosageForm || scannedData?.dosageForm || null,
    brandName: supplementData?.brandName || scannedData?.brand || "",
    dose: supplementData?.dose || scannedData?.dose || { quantity: "", unit: null },
    frequency: supplementData?.frequency || scannedData?.frequency || null,
    timesOfDay: supplementData?.timesOfDay || {
      Morning: [new Date(new Date().setHours(8, 0, 0, 0))],
      Afternoon: [],
      Evening: [],
    },
    interactions: supplementData?.interactions || { fixedInteractions: [], customInteractions: [] },
    remindMe: supplementData?.remindMe !== undefined ? supplementData.remindMe : false,
  });

  const [errors, setErrors] = useState({
    supplementName: "",
    dosageForm: "",
    brandName: "",
    dose: "",
    frequency: "",
    timesOfDay: "",
  });

  const [isLoading, setIsLoading] = useState(false);
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
    setFormData((prev) => ({ ...prev, dosageForm: type as FormData['dosageForm'] }));
  };

  const handleFrequencySelect = (frequency: string) => {
    setFormData((prev) => ({ ...prev, frequency: frequency as FormData['frequency'] }));
  };

  const handleQuantityChange = (quantity: string) => {
    setFormData((prev) => ({
      ...prev,
      dose: { ...prev.dose, quantity },
    }));
  };

  const handleDoseClick = () => {
    setIsDoseOverlayVisible(true);
  };

  const handleInteractionsChange = (interactions: FormData['interactions']) => {
    setFormData((prev) => ({ ...prev, interactions }));
  };

  const validateForm = () => {
    const newErrors = {
      supplementName: "",
      dosageForm: "",
      brandName: "",
      dose: "",
      frequency: "",
      timesOfDay: "",
    };
    let isValid = true;

    if (!formData.supplementName.trim()) {
      newErrors.supplementName = "Please enter a supplement name.";
      isValid = false;
    }
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
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No authentication token");
      }

      // Prepare supplement data for backend
      const supplementPayload = {
        name: formData.supplementName,
        brand: formData.brandName,
        dosage_form: formData.dosageForm,
        dose_quantity: formData.dose.quantity,
        dose_unit: formData.dose.unit,
        frequency: formData.frequency,
        times_of_day: formData.timesOfDay,
        interactions: [
          ...formData.interactions.fixedInteractions
            .filter((i) => i.checked)
            .map((i) => i.text),
          ...formData.interactions.customInteractions
            .filter((i) => i.checked)
            .map((i) => i.text),
        ],
        remind_me: formData.remindMe,
        expiration_date: "2025-12-31", // Default expiration date
        quantity: "30 tablets", // Default quantity
        image_url: null
      };

      if (editMode && location.state?.supplementId) {
        // Update existing supplement
        await supplementsAPI.update(token, location.state.supplementId, supplementPayload);
      } else {
        // Create new supplement
        await supplementsAPI.create(token, supplementPayload);
      }

      setIsLoading(false);
      
      if (editMode) {
        // If in edit mode, go back to supplement list
        navigate("/settings/supplement-list");
      } else {
        // If adding new, go to done page
        navigate("/scan/add/done");
      }
    } catch (error: any) {
      console.error("Error saving supplement:", error);
      setIsLoading(false);
      // You could show an error message here
    }
  };

  const handleTimesOfDayChange = (timesOfDay: FormData['timesOfDay']) => {
    setFormData((prev) => ({ ...prev, timesOfDay }));
  };

  const handleCancel = () => {
    if (editMode) {
      // If in edit mode, go back to supplement list
      navigate("/settings/supplement-list");
    } else {
      // If adding new, go back to scan page
      navigate(-1);
    }
  };

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo 
        text={editMode ? "Edit Supplement" : "Supplement Details"} 
        prevType="Cancel" 
        onPrevClick={handleCancel}
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Supplement Image and Editable Name/Strength */}
          <div className="px-[1rem] py-[0.75rem] flex items-center self-stretch gap-[0.75rem]">
            <div className="w-[4.6875rem] h-[4.6875rem] rounded-[0.5rem] overflow-hidden bg-orange-200 flex items-center justify-center">
              <span className="text-orange-600 text-2xl">💊</span>
            </div>
            <div className="flex flex-col items-start justify-center flex-1">
              <InputField
                placeholder="Supplement Name"
                value={formData.supplementName}
                onChange={(e) => setFormData(prev => ({ ...prev, supplementName: e.target.value }))}
                state={errors.supplementName ? "error" : "default"}
                className="text-[1.25rem] font-medium mb-2"
              />
              <InputField
                placeholder="Supplement Strength (e.g., 5000 IU)"
                value={formData.supplementStrength}
                onChange={(e) => setFormData(prev => ({ ...prev, supplementStrength: e.target.value }))}
                state="default"
                className="text-[0.75rem] text-[var(--text-placeholder)]"
              />
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
                value={formData.brandName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    brandName: e.target.value,
                  }))
                }
                state={errors.brandName ? "error" : "default"}
              />
            </div>

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
                state={errors.dose ? "error" : "default"}
                handleClick={handleDoseClick}
                value={formData.dose.quantity}
                unit={formData.dose.unit}
                onQuantityChange={handleQuantityChange}
              />
            </div>

            {/* Dose Overlay */}
            <Overlay
              isVisible={isDoseOverlayVisible}
              onClick={() => setIsDoseOverlayVisible(false)}
            >
              <div className="bg-white rounded-xl p-4 w-[15.625rem]">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#6B7280]">
                    SOLID
                  </span>
                  <ul className="mt-2 space-y-2">
                    {solidOptions.map((option) => (
                      <button
                        key={option}
                        className="text-base w-full text-left cursor-pointer hover:text-[var(--primary-color)]"
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
                        className="text-base w-full text-left cursor-pointer hover:text-[var(--primary-color)]"
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
                <div className="bg-white rounded-xl p-4 w-[22.375rem]">
                  <div className="mb-4">
                    <ul className="mt-2 space-y-2">
                      {frequencies.map((option) => (
                        <button
                          key={option}
                          className="text-base w-full text-left hover:text-[var(--primary-color)] cursor-pointer"
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
            <TimeOfDayPicker
              errors={errors.timesOfDay}
              timesOfDay={formData.timesOfDay}
              onChange={handleTimesOfDayChange}
            />

            {/* Interactions */}
            <InteractionsList 
              initialData={formData.interactions}
              onChange={handleInteractionsChange}
            />

            {/* Notification */}
            <div className="p-[1rem] flex items-center justify-between">
              <div className="py-[0.62rem] text-[1.0625rem] text-[var(--text-primary)]">
                <span>Remind me to take this medication</span>
              </div>
              <Toggle 
                checked={formData.remindMe}
                onChange={(checked) => setFormData(prev => ({ ...prev, remindMe: checked }))}
              />
            </div>
          </form>
        </div>

        <Button 
          text={editMode ? "Update" : "Save"} 
          handleClick={handleSubmit} 
          loading={isLoading} 
        />
      </div>
    </div>
  );
}

export default AddManually;
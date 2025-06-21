import { useState } from "react";
import Checkbox from "./UI/Checkbox";
import InputField from "./UI/Input";
import { Minus } from "lucide-react"; // <- Minus icon

const fixedInteractions = [
  "With food",
  "On empty stomach",
  "Avoid alcohol",
  "Avoid dairy",
  "Other",
];

// Define a type for custom interactions
type CustomInteraction = {
  text: string;
  checked: boolean;
};

export default function InteractionsList() {
  const [customInteractions, setCustomInteractions] = useState<CustomInteraction[]>([]);
  const [newInteraction, setNewInteraction] = useState("");
  const [inputState, setInputState] = useState<"default" | "error">("default");

  const handleAdd = () => {
    if (newInteraction.trim() === "") {
      setInputState("error");
      return;
    }
    // Add new custom interaction, checked by default
    setCustomInteractions((prev) => [...prev, { text: newInteraction.trim(), checked: true }]);
    setNewInteraction("");
    setInputState("default");
  };

  const handleRemove = (text: string) => {
    setCustomInteractions((prev) => prev.filter((item) => item.text !== text));
  };

  return (
    <div className="px-[1rem] py-[0.75rem]">
      <div className="pb-[0.5rem] flex flex-col items-start">
        <span className="text-[1.25rem] font-medium">Interactions:</span>
      </div>

      <div className="flex flex-col gap-[0.5rem]">
        {/* Fixed interactions */}
        {fixedInteractions.map((text) => (
          <label key={text} className="flex items-center gap-[0.5rem] cursor-pointer">
            <Checkbox />
            <span>{text}</span>
          </label>
        ))}

        {/* Custom interactions */}
        {customInteractions.map((interaction) => (
          <div key={interaction.text} className="flex items-center justify-between w-full">
            <label className="flex items-center gap-[0.5rem] cursor-pointer flex-1">
              <Checkbox
                checked={interaction.checked}
              />
              <span>{interaction.text}</span>
            </label>
            <button
              onClick={() => handleRemove(interaction.text)}
              className="text-[#6B7280] hover:text-red-500 p-1"
              title="Remove interaction"
              type="button"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        ))}

        {/* Input & Add button */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex-1">
            <InputField
              placeholder="Add other instructions"
              value={newInteraction}
              onChange={(e) => {
                setNewInteraction(e.target.value);
                if (e.target.value.trim() !== "") setInputState("default");
              }}
              state={inputState}
            />
          </div>
          <button
            className="text-[1.0625rem] text-[#08B5A6] flex items-center justify-center cursor-pointer"
            onClick={handleAdd}
            type="button"
          >
            +Add
          </button>
        </div>
      </div>
    </div>
  );
}

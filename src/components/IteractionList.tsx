import { useState } from "react";
import Checkbox from "./UI/Checkbox";
import InputField from "./UI/Input";
import { Minus } from "lucide-react";

type FixedInteraction = { text: string; checked: boolean };
type CustomInteraction = { text: string; checked: boolean };

const defaultFixedInteractions: FixedInteraction[] = [
  { text: "With food", checked: false },
  { text: "On empty stomach", checked: false },
  { text: "Avoid alcohol", checked: false },
  { text: "Avoid dairy", checked: false },
  { text: "Other", checked: false },
];

export default function InteractionsList() {
  const [fixedInteractions, setFixedInteractions] = useState<
    FixedInteraction[]
  >(defaultFixedInteractions);
  const [customInteractions, setCustomInteractions] = useState<
    CustomInteraction[]
  >([]);
  const [newInteraction, setNewInteraction] = useState("");
  const [inputState, setInputState] = useState<"default" | "error">("default");

  const handleToggleFixed = (text: string) => {
    setFixedInteractions((prev) =>
      prev.map((item) =>
        item.text === text ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAdd = () => {
    if (newInteraction.trim() === "") {
      setInputState("error");
      return;
    }
    setCustomInteractions((prev) => [
      ...prev,
      { text: newInteraction.trim(), checked: true },
    ]);
    setNewInteraction("");
    setInputState("default");
  };

  const handleRemove = (text: string) => {
    setCustomInteractions((prev) => prev.filter((item) => item.text !== text));
  };

  const otherChecked = fixedInteractions.find(
    (i) => i.text === "Other"
  )?.checked;

  return (
    <div className="px-[1rem] py-[0.75rem]">
      <div className="pb-[0.5rem] flex flex-col items-start">
        <span className="text-[1.25rem] font-medium">Interactions:</span>
      </div>

      <div className="flex flex-col gap-[0.5rem]">
        {/* Fixed interactions */}
        {fixedInteractions.map((item) => (
          <label
            key={item.text}
            className="flex items-center gap-[0.5rem] cursor-pointer"
          >
            <Checkbox
              checked={item.checked}
              onChange={() => handleToggleFixed(item.text)}
            />
            <span>{item.text}</span>
          </label>
        ))}

        {/* Show Input only if "Other" is checked */}
        {otherChecked && (
          <>
            {/* Custom interactions */}
            {customInteractions.map((interaction) => (
              <div
                key={interaction.text}
                className="flex items-center justify-between w-full"
              >
                <label className="flex items-center gap-[0.5rem] cursor-pointer flex-1">
                  <Checkbox
                    checked={interaction.checked}
                    onChange={() => {
                      setCustomInteractions((prev) =>
                        prev.map((i) =>
                          i.text === interaction.text
                            ? { ...i, checked: !i.checked }
                            : i
                        )
                      );
                    }}
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

            {/* Input & Add */}
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
          </>
        )}
      </div>
    </div>
  );
}

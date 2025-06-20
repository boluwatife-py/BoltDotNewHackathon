import { useState } from "react";
import HeadInfo from "../components/UI/HeadInfo";
import Button from "../components/UI/Button";
import AddMethod from "../components/SuplementAddMethods/SupplementMethods";
import ScanIcon from "../assets/icons/MethodIcons/scan.svg";
import ManualIcon from "../assets/icons/MethodIcons/manual.svg";
import AmazonCsv from "../assets/icons/MethodIcons/amazon-csv.svg";

const AddMethods = [
  {
    name: "Scan Medication",
    description: "Scan the barcode or label of your medication",
    icon: ScanIcon,
    onclick: () => {},
  },
  {
    name: "Enter Manually",
    description: "Manually enter the medication details",
    icon: ManualIcon,
    onclick: () => {},
  },
  {
    name: "Import from Amazon CVS File",
    description: "Import your medication list from a file",
    icon: AmazonCsv,
    onclick: () => {},
  },
];

export default function Scan() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-[var(--border-dark)]">
      <HeadInfo text="Add Supplement" prevType="Cancel" />
      <div className="min-h-[calc(100vh-60px)] p-4">
        <div className="px-[1rem] pt-[0.75rem] pb-[0.5rem] flex items-center justify-center">
          <span className="text-[var(--text-light)] font-medium text-center text-[0.875rem]">
            How would you like to add your medication?
          </span>
        </div>

        <div className="flex flex-col gap-[0.5rem]">
          {AddMethods.map(({ name, description, icon }) => (
            <AddMethod
              key={name}
              name={name}
              description={description}
              icon={icon}
              isSelected={selected === name}
              onSelect={() => setSelected(name)}
            />
          ))}
        </div>

        {/* <Button text="Continue"></Button> */}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import HeadInfo from "../components/UI/HeadInfo";
import AddMethod from "../components/SuplementAddMethods/SupplementMethods";
import ScanIcon from "../assets/icons/MethodIcons/scan.svg";
import ManualIcon from "../assets/icons/MethodIcons/manual.svg";
import AmazonCsv from "../assets/icons/MethodIcons/amazon-csv.svg";
import Button from "../components/UI/Button";

const AddMethods = [
  {
    id: "scan-medication",
    name: "Scan Medication",
    description: "Scan the barcode or label of your medication",
    icon: ScanIcon,
  },
  {
    id: "manual-entry",
    name: "Enter Manually",
    description: "Manually enter the medication details",
    icon: ManualIcon,
  },
  {
    id: "import-csv",
    name: "Import from Amazon CVS File",
    description: "Import your medication list from a file",
    icon: AmazonCsv,
  },
];

export default function Scan() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(
    "scan-medication"
  );

  // ✅ this is the click handler
  const handleClick = () => {
    switch (selectedId) {
      case "scan-medication":
        navigate("/scan/barcode");
        break;
      case "manual-entry":
        navigate("/scan/manual");
        break;
      case "import-csv":
        navigate("/scan/import");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Add Supplement" prevType="Cancel" />
      <div className="flex-1 flex flex-col justify-between">
        <div className="p-4">
          <div className="px-[1rem] pt-[0.75rem] pb-[0.5rem] flex items-center justify-center">
            <span className="text-[var(--text-light)] font-medium text-center text-[0.875rem]">
              How would you like to add your medication?
            </span>
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            {AddMethods.map(({ id, name, description, icon }) => (
              <AddMethod
                key={id}
                id={id}
                name={name}
                description={description}
                icon={icon}
                isSelected={selectedId === id}
                onSelect={() => setSelectedId(id)}
              />
            ))}
          </div>
        </div>
        <Button text="Continue" handleClick={handleClick} />
      </div>
    </div>
  );
}

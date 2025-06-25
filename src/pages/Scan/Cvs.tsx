import HeadInfo from "../../components/UI/HeadInfo";
import MethodCard from "../../components/UI/MethodCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import Scan from "../../assets/icons/amazon-csv.svg";
import Calender from "../../assets/icons/calender.svg";
import Download from "../../assets/icons/download.svg";
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const method = [
  {
    id: 1,
    icon: Scan,
    text: `Go to your account settings and request a "Request Your Data" report. This will allow you to download your supplement order history.`,
    title: "Request a Report",
    subTitle: "Request your purchase data",
  },
  {
    id: 2,
    icon: Calender,
    text: `Pick the date range that covers your supplement purchases. A wider range will give you a more complete record.`,
    title: "Select Data Range",
    subTitle: "Choose your timeframe",
  },
  {
    id: 3,
    icon: Download,
    text: `Once your report is ready, download it as a CSV file. This is the file you'll upload to SafeDoser.`,
    title: "Download the CSV",
    subTitle: "Save the CSV file",
  },
];

export default function Cvs() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [shakeButton, setShakeButton] = useState(false); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || isUploading) {
      if (!selectedFile) {
        setShakeButton(true); // trigger shake
        setTimeout(() => setShakeButton(false), 500);
      }
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        await fetch("/api/upload-csv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: reader.result }),
        });
      } catch (err) {
        console.error("Upload failed:", err);
      }

      setTimeout(() => {
        navigate("/");
      }, 2000);
    };
    reader.readAsText(selectedFile);
  };

  if (isUploading) {
    return (
      <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" text="Processing your CSV file..." />
      </div>
    );
  }

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Import from Amazon" prevType="Cancel" />
      <div className="px-[1rem] py-[0.75rem] text-[var(--text-secondary)] text-[0.75rem]">
        <span>
          To import your supplement data, download a CSV file from your online
          account.
        </span>
      </div>

      <div className="flex flex-col gap-[0.5rem] px-[1rem]">
        {method.map((methods) => (
          <MethodCard key={methods.id} {...methods} />
        ))}

        <div className="px-[1rem] py-[1.25rem] bg-white border border-[var(--border-grey)] rounded-[0.75rem] text-[var(--text-primary)]">
          <h1 className="font-semibold">4. Upload Your File</h1>
          <div className="pl-[1.12rem] pb-[0.75rem]">
            <span className="text-[1.0625rem] font-medium flex flex-col">
              Upload the CSV to SafeDoser
              {selectedFile && (
                <span className="text-[0.7rem] text-[var(--text-light)] mt-[0.25rem]">
                  {selectedFile.name}
                </span>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-[0.5rem] items-center">
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="csv-upload"
              className={`px-[1rem] py-[0.75rem] rounded-[0.75rem] font-bold text-[0.875rem] bg-[#CCC] text-white cursor-pointer ${shakeButton ? "animate-shake" : ""}`}
            >
              {selectedFile ? "Choose Another CSV" : "Upload CSV File"}
            </label>
          </div>
        </div>
      </div>

      <Button
        text="Continue"
        loading={isUploading}
        handleClick={handleUpload}
      />
    </div>
  );
}
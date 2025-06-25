import HeadInfo from "../../components/UI/HeadInfo";
import Plus from "../../assets/icons/plus.svg";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useRef, useState } from "react";

function ByScan() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);

  const videoConstraints = {
    facingMode: "environment" as const,
  };

  const handleScan = async () => {
    if (!webcamRef.current) return;
    const shot = webcamRef.current.getScreenshot();
    if (!shot) return;

    setIsScanning(true);

    try {
      await fetch("/otc/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: shot }),
      });

      setTimeout(() => navigate("/scan/result"), 2000);
    } catch (error) {
      console.error("Scan failed:", error);
      setIsScanning(false);
    }
  };

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--border-dark)]">
        <LoadingSpinner size="lg" text="Analyzing supplement..." />
      </div>
    );
  }

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Scan Supplement" prevType="Close" />

      <div className="px-[1rem] py-[0.75rem] flex flex-col items-center gap-[0.75rem]">
        <div className="text-center text-[var(--text-primary)] font-medium text-[1.0625rem] mb-[0.5rem]">
          Position the label clearly inside the frame.
        </div>

        <div className="border-2 border-[var(--primary-dark)] flex items-center justify-center w-full rounded-[1rem] overflow-hidden aspect-[4/2.5]">
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
            screenshotFormat="image/jpeg"
            mirrored={false}
          />
        </div>

        <div className="text-center text-[0.875rem] text-[var(--text-primary)] mt-[0.5rem]">
          Make sure the front of the bottle is facing you. Avoid glare or blur
          for better results.
        </div>

        <div className="flex gap-[.8rem]">
          <button
            className="mt-[1rem] px-[1rem] py-[0.5rem] border border-[var(--text-cancel)] flex items-center cursor-pointer justify-center rounded-[0.75rem] bg-white text-[var(--text-cancel)] gap-[0.25rem] min-w-[12rem] whitespace-nowrap text-[.75rem]"
            onClick={() => navigate("/scan/manual")}
            disabled={isScanning}
          >
            <img src={Plus} alt="safeDose" />
            <span>Enter supplement manually</span>
          </button>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`mt-[1rem] px-[1.5rem] py-[0.75rem] rounded-[0.75rem] font-medium transition-opacity min-w-[6rem] whitespace-nowrap text-[.75rem] ${
              isScanning
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[var(--primary-color)] text-white cursor-pointer"
            }`}
          >
            {isScanning ? "Scanning..." : "Scan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ByScan;
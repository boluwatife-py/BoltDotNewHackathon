import HeadInfo from "../../components/UI/HeadInfo";
import Plus from "../../assets/icons/plus.svg";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { API_BASE_URL } from "../../config/api";

function ByScan() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);

  const videoConstraints = {
    facingMode: "environment" as const,
  };

  const handleScan = async () => {
    if (!webcamRef.current) return;
    const shot = webcamRef.current.getScreenshot();
    if (!shot) return;

    setIsScanning(true);

    try {
      // Convert base64 to blob
      const base64Data = shot.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Create FormData
      const formData = new FormData();
      formData.append('file', blob, 'supplement.jpg');

      // Call AI service to extract supplement data from image
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        // AI successfully extracted data, navigate to manual entry with pre-filled data
        navigate("/scan/manual", {
          state: {
            scannedData: {
              name: result.data.name || "",
              strength: result.data.strength || "",
              brand: result.data.brand || "",
              dosageForm: result.data.dosageForm || null,
              dose: result.data.dose || { quantity: "", unit: null },
              frequency: result.data.frequency || null,
            }
          }
        });
      } else {
        // AI failed to extract data, show scan failed page
        setScanAttempts(prev => prev + 1);
        navigate("/scan/scan-failed", {
          state: {
            image: shot,
            attempts: scanAttempts + 1
          }
        });
      }
    } catch (error) {
      console.error("Scan failed:", error);
      // On error, show scan failed page
      setScanAttempts(prev => prev + 1);
      navigate("/scan/scan-failed", {
        state: {
          image: shot,
          attempts: scanAttempts + 1
        }
      });
    } finally {
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
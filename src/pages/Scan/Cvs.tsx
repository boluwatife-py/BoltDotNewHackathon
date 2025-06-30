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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setUploadError("Please select a CSV file");
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const parseCSVData = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const supplements = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < headers.length) continue;
      
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim().replace(/"/g, '');
      });
      
      // Try to identify supplement-related products
      const productName = row['product name'] || row['title'] || row['item'] || '';
      const category = row['category'] || row['department'] || '';
      
      // Simple heuristic to identify supplements
      const supplementKeywords = [
        'vitamin', 'supplement', 'mineral', 'omega', 'probiotic', 
        'protein', 'calcium', 'magnesium', 'zinc', 'iron', 'b12',
        'multivitamin', 'fish oil', 'coq10', 'turmeric', 'ginseng'
      ];
      
      const isLikelySupplement = supplementKeywords.some(keyword => 
        productName.toLowerCase().includes(keyword) || 
        category.toLowerCase().includes(keyword)
      );
      
      if (isLikelySupplement && productName) {
        // Extract basic information
        const supplement = {
          name: productName,
          brand: row['brand'] || 'Unknown',
          quantity: row['quantity'] || '1',
          price: row['price'] || row['cost'] || '',
          orderDate: row['order date'] || row['date'] || '',
        };
        
        supplements.push(supplement);
      }
    }
    
    return supplements;
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) {
      if (!selectedFile) {
        setShakeButton(true);
        setTimeout(() => setShakeButton(false), 500);
      }
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const csvText = await selectedFile.text();
      const supplements = parseCSVData(csvText);
      
      if (supplements.length === 0) {
        setUploadError("No supplements found in the CSV file. Please check the file format.");
        setIsUploading(false);
        return;
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to a results page or back to home with success message
      navigate("/", { 
        state: { 
          message: `Successfully imported ${supplements.length} supplements from CSV`,
          importedSupplements: supplements
        }
      });
      
    } catch (error) {
      setUploadError("Failed to process CSV file. Please check the file format and try again.");
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" text="Processing your CSV file..." />
        <p className="text-[var(--text-secondary)] text-sm mt-4 text-center max-w-sm">
          We're analyzing your purchase history and extracting supplement information...
        </p>
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
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </span>
          </div>

          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{uploadError}</p>
            </div>
          )}

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
              className={`px-[1rem] py-[0.75rem] rounded-[0.75rem] font-bold text-[0.875rem] bg-[#CCC] text-white cursor-pointer transition-all ${
                shakeButton ? "animate-shake" : ""
              } ${selectedFile ? "bg-[var(--primary-color)]" : ""}`}
            >
              {selectedFile ? "Choose Another CSV" : "Upload CSV File"}
            </label>
            
            {selectedFile && (
              <p className="text-xs text-[var(--text-secondary)] text-center">
                We'll automatically detect supplements from your purchase history
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        text={selectedFile ? "Process CSV File" : "Continue"}
        loading={isUploading}
        handleClick={handleUpload}
      />
    </div>
  );
}
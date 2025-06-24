import HeadInfo from "../../components/UI/HeadInfo";
import { useNavigate } from "react-router-dom";
import Pill from "../../assets/images/Pill.jpg";

export default function ScanResult() {
  const navigate = useNavigate();
  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo
        text="Scan Result"
        prevType="Close"
        onPrevClick={() => {
          navigate("/");
        }}
      />

      <div className="px-[1rem] py-[0.75rem] flex flex-col items-center gap-[0.75rem]">
        <div className="pt-[1rem] pb-[0.5rem] text-center font-medium text-[var(--BananiStyle)]">
          <span>We’ve found this product. Is it correct?</span>
        </div>
        <div className="py-[0.75rem] mt-[.5rem] flex items-center justify-center">
          <div className="w-[10rem] h-[10rem] border rounded-[0.75rem] border-[var(--primary-color)] bg-white flex items-center justify-center p-[1rem]">
            <img src={Pill} alt="safeDose" className="h-full w-fill" />
          </div>
        </div>
        <div className="my-[0.5rem] text-[var(--text-primary)] text-center flex flex-col items-center justify-center gap-[0.2rem]">
          <h3 className="text-[1.25rem] font-medium ">Vitamin D3 - 5000 IU</h3>
          <span className="text-[1.0625rem]">Brand: Nature Plus</span>
        </div>

        <div className="flex flex-col items-stretch w-full gap-[1rem]">
          <button
            className="flex items-center justify-center px-[1.5rem] py-[1rem] text-white bg-[var(--primary-color)] rounded-[0.75rem]"
            onClick={() => {
              navigate("/scan/manual");
            }}
          >
            <span>Yes, that’s correct</span>
          </button>

          <button
            className="flex items-center justify-center px-[1.5rem] py-[1rem] outline-0 border border-[var(--text-cancel)] text-[text-primary] rounded-[0.75rem]"
            onClick={() => {
              navigate("/scan/byscan");
            }}
          >
            <span>No, scan again</span>
          </button>
        </div>
      </div>
    </div>
  );
}

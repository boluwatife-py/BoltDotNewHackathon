import HeadInfo from "../../components/UI/HeadInfo";
import SupplementData from "../../components/Supplement/Supplement";
import { ButtonRe } from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { type SupplementProps } from "../../components/Supplement/Supplement";

const data: SupplementProps = {
  dosageForm: "Tablet",
  brand: "Nature’s Plus",
  dose: {
    unit: "Tablet",
    quantity: 3,
  },
  timesOfDay: {
    Morning: [new Date("2025-06-23T08:00:00")],
    Afternoon: [new Date("2025-06-23T08:00:00")],
    Evening: [],
  },
  iteractions: ["WithFood", "WithoutAlcohol"],
};

export default function SupplementDone() {
  const navigate = useNavigate();
  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="Supplement Details" prevType="Close" />
      <div>
        <SupplementData {...data}></SupplementData>
      </div>
      <div className="p-[1rem] flex items-center justify-center gap-[1.25rem]">
        <ButtonRe
          text="Add another item"
          variant="default"
          onClick={() => navigate("/scan")}
        />

        <ButtonRe
          text="Done"
          variant="comp"
          onClick={() => {
            navigate("/");
          }}
        ></ButtonRe>
      </div>
    </div>
  );
}

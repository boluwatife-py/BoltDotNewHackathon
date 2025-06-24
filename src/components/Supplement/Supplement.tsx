import SuppDetails from "../../components/UI/SuppDetails";

interface Dose {
  quantity: number;
  unit: string;
}

interface SupplementProps {
  dosageForm: string;
  brand: string;
  dose: Dose;
  timesOfDay: Record<string, Date[]>;
  iteractions?: string[];
}

export default function SupplementData({
  dosageForm,
  brand,
  dose,
  timesOfDay,
  iteractions,
}: SupplementProps) {
  return (
    <>
      <SuppDetails
        name="Vitamin D3"
        description="5000 (Strength)"
      ></SuppDetails>
      <div className="flex flex-col gap-[0.75rem] px-[1rem] py-[0.75rem]">
        {/* Dosage Form */}
        <div className="flex items-center justify-between">
          <span>Dosage Form</span>
          <div className="flex gap-[0.5rem]">
            <span className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-[0.625rem] py-[0.25rem]">
              {dosageForm}
            </span>
          </div>
        </div>

        {/* Brand */}
        <div className="flex items-center justify-between">
          <span>Brand</span>
          <span>{brand}</span>
        </div>

        {/* Dose */}
        <div className="flex items-center justify-between">
          <span>Dose</span>
          <span>
            {dose.quantity} {dose.unit}
          </span>
        </div>

        {/* Frequency */}
        <div className="flex items-center justify-between">
          <span>Frequency</span>
          <span>Once daily</span>
        </div>

        {/* Time of the day */}
        <div className="flex justify-between items-center flex-wrap">
          <span>Time of the day</span>
          <div className="flex flex-col gap-[0.5rem] mt-[0.25rem]">
            {Object.entries(timesOfDay).map(([period, dates]) =>
              dates.length > 0 ? (
                <div
                  key={period}
                  className="flex items-center gap-[0.5rem] flex-wrap"
                >
                  <span className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-[0.625rem] py-[0.25rem]">
                    {period}
                  </span>
                  {dates.map((date) => (
                    <span
                      key={date.toISOString()}
                      className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-[0.625rem] py-[0.25rem]"
                    >
                      {date.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  ))}
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Interactions */}
        <div className="flex items-center justify-between">
          <span>Interactions</span>
          <div className="flex gap-[0.5rem]">
            {iteractions &&
              iteractions.length > 0 &&
              iteractions.map((iteraction, index) => (
                <span
                  key={iteraction + index}
                  className="bg-[var(--primary-light)] text-[var(--primary-color)] text-xs rounded-full px-[0.625rem] py-[0.25rem]"
                >
                  {iteraction}
                </span>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export { type SupplementProps };

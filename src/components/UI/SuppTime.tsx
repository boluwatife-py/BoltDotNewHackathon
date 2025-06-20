export default function SuppTime({ time }: { time: string }) {
  const [hours, minutes] = time.split(':').map(Number);

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const formattedTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

  return (
    <div className="w-[48px] flex flex-col items-center justify-center self-stretch text-center text-[var(--text-light)] text-[14px] font-medium lh14">
      <span>{formattedTime}</span>
    </div>
  );
}
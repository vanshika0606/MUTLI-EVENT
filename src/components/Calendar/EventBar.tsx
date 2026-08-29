interface EventBarProps {
  label: string;
  className?: string;
  roundedLeft: boolean;
  roundedRight: boolean;
  onClick?: () => void;
}

export default function EventBar({
  label,
  className = "bg-blue-700 text-white",
  roundedLeft,
  roundedRight,
  onClick,
}: EventBarProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`h-5 w-full truncate px-1.5 text-left text-[11px] font-medium ${className} ${
        roundedLeft ? "rounded-l" : ""
      } ${roundedRight ? "rounded-r" : ""}`}
    >
      {label}
    </button>
  );
}

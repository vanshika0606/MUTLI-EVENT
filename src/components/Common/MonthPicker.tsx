import { useEffect, useRef, useState } from "react";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(value.getFullYear());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const label = value.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setPickerYear(value.getFullYear());
          setIsOpen((open) => !open);
        }}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400"
      >
        <CalendarIcon />
        <span>{label}</span>
        <span>▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-64 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPickerYear((y) => y - 1)}
              className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              aria-label="Previous year"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-gray-900">{pickerYear}</span>
            <button
              type="button"
              onClick={() => setPickerYear((y) => y + 1)}
              className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              aria-label="Next year"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {MONTH_LABELS.map((monthLabel, index) => {
              const isSelected = pickerYear === value.getFullYear() && index === value.getMonth();
              return (
                <button
                  key={monthLabel}
                  type="button"
                  onClick={() => {
                    onChange(new Date(pickerYear, index, 1));
                    setIsOpen(false);
                  }}
                  className={`rounded-md py-1.5 text-sm ${
                    isSelected ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {monthLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

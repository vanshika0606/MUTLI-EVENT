import Dropdown, { type DropdownOption } from "../Common/Dropdown";

interface HeaderProps {
  title: string;
  venueOptions: DropdownOption[];
  venueId: string;
  onVenueChange: (value: string) => void;
  hallOptions: DropdownOption[];
  hallId: string;
  onHallChange: (value: string) => void;
}

export default function Header({
  title,
  venueOptions,
  venueId,
  onVenueChange,
  hallOptions,
  hallId,
  onHallChange,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="flex gap-2">
        <div className="w-56">
          <Dropdown options={venueOptions} value={venueId} onChange={onVenueChange} />
        </div>
        <div className="w-56">
          <Dropdown options={hallOptions} value={hallId} onChange={onHallChange} />
        </div>
      </div>
    </div>
  );
}

import Dropdown, { type DropdownOption } from "../Common/Dropdown";

interface HeaderProps {
  title: string;
  venueOptions: DropdownOption[];
  venueId: string;
  onVenueChange: (value: string) => void;
}

export default function Header({ title, venueOptions, venueId, onVenueChange }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="w-64">
        <Dropdown options={venueOptions} value={venueId} onChange={onVenueChange} />
      </div>
    </div>
  );
}

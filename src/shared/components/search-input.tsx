import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
};

export function SearchInput({ value, onChange, placeholder, label = "Search" }: SearchInputProps) {
  return (
    <label className="relative block min-w-56 flex-1">
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9" />
    </label>
  );
}

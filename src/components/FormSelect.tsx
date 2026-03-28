import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export function FormSelect({
  label,
  placeholder = "Select",
  value,
  options,
  onChange,
  onBlur,
}: Props) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-64 cursor-pointer">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {/* <SelectContent position="popper">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent> */}
        <SelectContent position="popper" onBlur={onBlur}>
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

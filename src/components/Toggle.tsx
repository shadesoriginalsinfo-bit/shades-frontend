type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export const Toggle = ({
  checked,
  onChange,
  label,
  className = "",
  disabled = false,
}: ToggleProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-[#9A7A46]" : "bg-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      {label && (
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-600 font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  variant?: "default";
  restrictSpecialChars?: boolean;
};

function Input({
  className,
  type,
  variant = "default",
  required,
  placeholder,
  restrictSpecialChars = true,
  ...props
}: InputProps) {
  
  return (
    <input
      type={type}
      data-slot="input"
      placeholder={placeholder}
      required={required}
      onKeyDown={(e) => {
        if (!restrictSpecialChars) return;
        if (!/[a-zA-Z0-9._@]/.test(e.key) && e.key.length === 1) {
          e.preventDefault();
        }
      }}
      className={cn(
        // Layout & base
        "w-full bg-transparent text-sm text-gray-800 outline-none",
        "transition-all duration-300",
        // Bottom-border only — Art Deco underline style
        "border-0 border-b border-[#D4B896] rounded-none",
        "pb-1 pt-1.5",
        // Placeholder
        "placeholder:text-[#C6A46C]/70 placeholder:text-xs placeholder:tracking-wider",
        // Focus: gold underline glow
        "focus:border-[#C6A46C] focus:shadow-[0_1px_0_0_#C6A46C]",
        // Disabled
        "disabled:opacity-40 disabled:cursor-not-allowed",
        // Selection
        "selection:bg-[#C6A46C]/30 selection:text-[#6B4E2A]",
        // Invalid
        "aria-invalid:border-red-400",
        className
      )}
      {...props}
    />
  );
}

export { Input };
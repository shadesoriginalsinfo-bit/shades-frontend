import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type SearchInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "placeholder"
> & {
  placeholder?: string;
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, variant = "default", placeholder = "Search...", ...props }, ref) => {
    return (
      <div className="relative w-full md:w-64">
        {/* Search icon */}
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2",
            "h-4 w-4 text-muted-foreground pointer-events-none"
          )}
        />

        {/* Input */}
        <Input
          ref={ref}
          type="search"
          variant={variant}
          placeholder={placeholder}
          className={className}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };

import { Search } from "lucide-react";
import { CustomSelect } from "./CustomSelect";

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  useCardWrapper = true,
  showSearch = true
}) {
  const containerClass = useCardWrapper
    ? "flex flex-col sm:flex-row gap-4 items-center bg-card border border-border rounded-xl p-4 w-full"
    : "flex flex-col sm:flex-row gap-4 items-center w-full";

  return (
    <div className={containerClass}>
      {/* Ô tìm kiếm */}
      {showSearch && (
        <div className="relative flex-1 max-w-sm w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      )}

      {filters.map((filter, index) => (
        <div key={index} className={filter.className || "w-full sm:w-48"}>
          <CustomSelect
            value={filter.value}
            onChange={filter.onChange}
            options={filter.options}
          />
        </div>
      ))}
    </div>
  );
}

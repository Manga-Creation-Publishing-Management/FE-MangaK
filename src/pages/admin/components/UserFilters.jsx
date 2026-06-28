import { Search } from "lucide-react";
import { CustomSelect } from "../../../shared/components/CustomSelect.jsx";

export function UserFilters({
  accountType,
  searchQuery,
  onSearchQueryChange,
  filterRole,
  onFilterRoleChange,
  filterStatus,
  onFilterStatusChange,
}) {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {accountType !== "readers" && (
        <div className="w-48">
          <CustomSelect
            value={filterRole}
            onChange={onFilterRoleChange}
            options={[
              { value: "all", label: "All Roles" },
              { value: "mangaka", label: "Mangaka" },
              { value: "assistant", label: "Assistant" },
              { value: "tantou", label: "Tantou Editor" },
              { value: "editorial", label: "Editorial Board" },
              { value: "admin", label: "Admin" }
            ]}
          />
        </div>
      )}
      <div className="w-40">
        <CustomSelect
          value={filterStatus}
          onChange={onFilterStatusChange}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" }
          ]}
        />
      </div>
    </div>
  );
}

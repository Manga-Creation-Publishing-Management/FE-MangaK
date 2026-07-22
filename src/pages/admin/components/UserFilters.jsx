import { SearchFilterBar } from "@/shared/components/SearchFilterBar";

export function UserFilters({
  accountType,
  searchQuery,
  onSearchQueryChange,
  filterRole,
  onFilterRoleChange,
  filterStatus,
  onFilterStatusChange,
}) {
  const filters = [];

  if (accountType !== "readers") {
    filters.push({
      value: filterRole,
      onChange: onFilterRoleChange,
      className: "w-full sm:w-48",
      options: [
        { value: "all", label: "All Roles" },
        { value: "mangaka", label: "Mangaka" },
        { value: "assistant", label: "Assistant" },
        { value: "tantou", label: "Tantou Editor" },
        { value: "editorial", label: "Editorial Board" }
      ]
    });
  }

  filters.push({
    value: filterStatus,
    onChange: onFilterStatusChange,
    className: "w-full sm:w-40",
    options: [
      { value: "all", label: "All Status" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  });

  return (
    <SearchFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchQueryChange}
      searchPlaceholder="Search by name, email or phone…"
      filters={filters}
      useCardWrapper={false} // Không bọc khung card để hiển thị inline cạnh các nút bấm
    />
  );
}

import { useState } from "react";
import { SeriesManagement } from "../shared/SeriesManagement";
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";

export function SeriesApproval() {
  const { reload, handleReload } = useSeriesManagement();
  const { seriesData } = useCreateSeries(null, handleReload, reload);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = seriesData.filter((item) => {
    const allowedStatuses = ["pending", "approved", "scheduled", "publishing", "cancelled", "rejected"];
    const itemStatus = item.status?.toLowerCase();
    if (!allowedStatuses.includes(itemStatus)) return false;

    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.mangakaName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? itemStatus !== "rejected" : itemStatus === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by title or author…"
        filters={[
          {
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: "all", label: "All Status" },
              { value: "Pending", label: "Pending" },
              { value: "Approved", label: "Approved" },
              { value: "Scheduled", label: "Scheduled" },
              { value: "Publishing", label: "Publishing" },
              { value: "Cancelled", label: "Cancelled" },
              { value: "Rejected", label: "Rejected" },
            ]
          }
        ]}
      />

      <SeriesManagement role="editorial" seriesFiltered={filtered} />
    </div>
  );
}
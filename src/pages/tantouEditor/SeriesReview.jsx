import { useState } from "react";
import { SeriesManagement } from "../shared/SeriesManagement";
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";

// Component SeriesReview: Dành cho màn hình Đánh giá Truyện của Tantou Editor
export function SeriesReview() {
  const { reload, handleReload } = useSeriesManagement();
  const { seriesData } = useCreateSeries(null, handleReload, reload);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = seriesData.filter((item) => {
    // Các trạng thái truyện mà Tantou được phép xem/đánh giá
    const allowedStatuses = ["processing", "rejected", "pending", "approved", "scheduled", "publishing"];
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
    <div className="p-6 space-y-8 bg-background min-h-full">
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
              { value: "Processing", label: "Processing" },
              { value: "Rejected", label: "Rejected" },
              { value: "Pending", label: "Pending" },
              { value: "Scheduled", label: "Scheduled" },
              { value: "Approved", label: "Approved" },
              { value: "Publishing", label: "Publishing" },
            ]
          }
        ]}
      />

      <SeriesManagement role="tantou" seriesFiltered={filtered} />
    </div>
  );
}
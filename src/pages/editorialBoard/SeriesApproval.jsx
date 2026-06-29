import { useState } from "react";
import { Search } from "lucide-react";
import { SeriesManagement } from "../shared/SeriesManagement";
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { CustomSelect } from "../../shared/components/CustomSelect";

export function SeriesApproval() {
  const { reload, handleReload } = useSeriesManagement();
  const { seriesData } = useCreateSeries(null, handleReload, reload);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = seriesData.filter((item) => {
    const allowedStatuses = ["pending", "approved", "publishing", "cancelled"];
    const itemStatus = item.status?.toLowerCase();
    if (!allowedStatuses.includes(itemStatus)) return false;

    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.mangakaName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || itemStatus === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Block Search & Filter */}
      <div className="flex gap-4 items-center bg-card border border-border rounded-xl p-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author…"
            className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <div className="w-48">
          <CustomSelect
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "all", label: "All Status" },
              { value: "Pending", label: "Pending" },
              { value: "Approved", label: "Approved" },
              { value: "Publishing", label: "Publishing" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />
        </div>
      </div>

      <SeriesManagement role="editorial" seriesFiltered={filtered} />
    </div>
  );
}
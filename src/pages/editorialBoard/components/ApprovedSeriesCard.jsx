import { X } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";

export function ApprovedSeriesCard({ item, onCancelClick, onNavigate }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{item.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">by {item.author}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.chapters} Chapters</p>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
          <StatusBadge status={item?.status.toLowerCase()} />

          <button
            onClick={() => onCancelClick(item)}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer text-xs sm:text-sm"
          >
            <X size={16} />
            Cancel Series
          </button>

          <button
            onClick={() => onNavigate("editorial", item.id)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto text-center cursor-pointer text-xs sm:text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

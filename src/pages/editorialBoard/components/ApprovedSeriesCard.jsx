import { X } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";

export function ApprovedSeriesCard({ item, onCancelClick, onNavigate }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3>{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
          <p className="text-sm text-muted-foreground mt-1">{item.chapters} Chapters</p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={item?.status.toLowerCase()} />

          <button
            onClick={() => onCancelClick(item)}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <X size={18} />
            Cancel Series
          </button>

          <button
            onClick={() => onNavigate("editorial", item.id)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

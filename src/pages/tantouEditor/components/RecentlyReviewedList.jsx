import { ClipboardCheck, Eye } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";

// Component hiển thị danh sách series đã được Tantou Editor xử lý gần đây
export function RecentlyReviewedList({ recentlyReviewed, isLoading, onNavigateToSeries }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <ClipboardCheck size={30} className="text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Recently Reviewed</h3>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : recentlyReviewed.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <ClipboardCheck size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No recently reviewed series</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
          {recentlyReviewed.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  by {item.author} · {item.chapters} Chapters
                </p>
              </div>

              <div className="flex items-center gap-3 ml-3 shrink-0">
                <StatusBadge status={item.status} />
                <button
                  onClick={() => onNavigateToSeries(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

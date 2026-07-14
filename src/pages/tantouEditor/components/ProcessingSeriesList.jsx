import { FileSearch, Eye, ArrowRight } from "lucide-react";
import dayjs from "dayjs";

// Component hiển thị danh sách series đang chờ Tantou Editor review (ở trạng thái Processing)
export function ProcessingSeriesList({ pendingSeries, isLoading, onNavigateToSeries, onNavigateToSeriesList }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FileSearch size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Series to Review</h2>
        </div>
        <button
          onClick={onNavigateToSeriesList}
          className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">Loading...</p>
        </div>
      ) : pendingSeries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <FileSearch size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No series pending review</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {pendingSeries.map((series) => (
            <div
              key={series.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{series.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  by {series.author}
                  {series.createdDate && (
                    <span> · {dayjs(series.createdDate).format("DD/MM/YYYY")}</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => onNavigateToSeries(series.id)}
                className="flex items-center gap-1.5 ml-3 shrink-0 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <Eye size={14} />
                Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { CalendarClock, JapaneseYen, Eye, CheckCircle } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import dayjs from "dayjs";

export function UrgentTaskCard({ urgentTask, isLoading, onNavigateToTask }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-5">
          <CalendarClock size={20} className="text-amber-500" />
          <h2 className="text-lg font-semibold">Urgent Tasks</h2>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-sm">Loading...</p>
          </div>
        ) : !urgentTask ? (
          <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full min-h-[180px]">
            <CheckCircle size={40} className="text-success mb-3 opacity-80" />
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs text-muted-foreground mt-1">No urgent tasks assigned.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3">
              <div>
                <p className="font-semibold text-card-foreground text-lg line-clamp-2">
                  Chapter {urgentTask.chapterNumber} - {urgentTask.seriesTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{urgentTask.seriesTitle}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-success flex items-center gap-0.5">
                  <JapaneseYen size={20} strokeWidth={2.5} className="shrink-0 translate-y-[1px]" />
                  <span>{urgentTask.incomeAmount.toLocaleString('en-US')}</span>
                </span>
                <StatusBadge status={urgentTask.status.toLowerCase()} />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-destructive font-semibold">
              <CalendarClock size={16} />
              <span>Deadline: {dayjs(urgentTask.deadline).format("DD/MM/YYYY HH:mm")}</span>
            </div>
          </div>
        )}
      </div>

      {!isLoading && urgentTask && (
        <button
          onClick={() => onNavigateToTask(urgentTask.id)}
          className="mt-6 w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Eye size={16} />
          Go to Details
        </button>
      )}
    </div>
  );
}

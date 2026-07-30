import { CalendarClock, JapaneseYen, Eye, CheckCircle } from 'lucide-react';
import { StatusBadge } from '@/shared/components/StatusBadge';
import dayjs from 'dayjs';

export function UrgentTaskCard({ urgentTasks = [], isLoading, onNavigateToTask }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 h-full flex flex-col min-h-[220px]">
      <div className="flex items-center gap-2 mb-4 sm:mb-5 shrink-0">
        <CalendarClock size={20} className="text-amber-500" />
        <h3 className="text-lg font-semibold text-card-foreground">Urgent Tasks</h3>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground flex-1 flex items-center justify-center">
          <p className="text-sm">Loading...</p>
        </div>
      ) : urgentTasks.length === 0 ? (
        <div className="py-8 sm:py-12 text-center text-muted-foreground flex-1 flex flex-col items-center justify-center my-auto">
          <CheckCircle size={40} className="text-success mb-3 opacity-80" />
          <p className="text-sm font-semibold text-card-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground mt-1">No urgent tasks assigned.</p>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {urgentTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3"
            >
              <div>
                <p className="font-semibold text-card-foreground text-base line-clamp-2">
                  Chapter {task.chapterNumber} - {task.seriesTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{task.seriesTitle}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-success flex items-center gap-0.5">
                  <JapaneseYen size={18} strokeWidth={2.5} className="shrink-0 translate-y-[1px]" />
                  <span>{task.incomeAmount.toLocaleString('en-US')}</span>
                </span>
                <StatusBadge status={task.status.toLowerCase()} />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-500/10">
                <div className="flex items-center gap-1.5 text-xs text-destructive font-semibold">
                  <CalendarClock size={14} />
                  <span>Deadline: {dayjs(task.deadline).format("DD/MM/YYYY HH:mm")}</span>
                </div>
                <button
                  onClick={() => onNavigateToTask(task.id)}
                  className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-xs font-medium"
                >
                  <Eye size={12} />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

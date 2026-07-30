import { Edit, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

export function ScheduleCard({ schedule, onEditClick, onDeleteClick }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-2 sm:mt-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground">{schedule.seriesName}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">by {schedule.author}</p>
            </div>
            <div>
              <p className="text-sm sm:text-lg font-semibold text-card-foreground">Frequency</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 capitalize">{schedule.frequency}</p>
            </div>
            <div>
              <p className="text-sm sm:text-lg font-semibold text-card-foreground">Publishing Date</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {schedule.startDate ? dayjs(schedule.startDate).format("DD/MM/YYYY") : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onEditClick(schedule)}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
            title="Edit Schedule"
          >
            <Edit size={18} />
          </button>

          <button
            onClick={() => onDeleteClick(schedule)}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
            title="Delete Schedule"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

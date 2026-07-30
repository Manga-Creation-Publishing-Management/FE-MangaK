import { Calendar, CalendarDays } from 'lucide-react';

export function UpcomingReleases({ upcomingReleases }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <CalendarDays size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Upcoming Releases</h3>
      </div>

      {upcomingReleases.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No upcoming releases scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingReleases.map((release) => (
            <div
              key={release.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-foreground">
                  {release.seriesName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {release.frequency}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-3 shrink-0">
                <Calendar size={14} />
                <span>{release.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

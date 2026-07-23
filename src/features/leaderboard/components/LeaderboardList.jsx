import React from 'react';
import { Trophy, Loader2, AlertCircle } from 'lucide-react';
import { LeaderboardItem } from './LeaderboardItem';

export function LeaderboardList({
  isLoading,
  error,
  paginatedData,
  leaderboardDataLength,
  timePeriod,
  getHeaderPeriodLabel
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-3">
          <Trophy className="text-primary" size={32} />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Top Rankings</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Based on reader votes - {timePeriod === 'weekly' ? 'Weekly' : 'Monthly'}
              {getHeaderPeriodLabel()}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary mr-3" size={28} />
            <span className="text-muted-foreground">Loading leaderboard...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-destructive">
            <AlertCircle size={32} className="mb-2" />
            <p className="font-medium">Failed to load leaderboard</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        ) : leaderboardDataLength === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Trophy size={32} className="mb-2 opacity-50" />
            <p>No ranking data available for this period.</p>
          </div>
        ) : (
          paginatedData.map((item) => (
            <LeaderboardItem key={item.rank} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

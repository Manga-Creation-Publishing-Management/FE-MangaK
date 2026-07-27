import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { isTrendingUp } from '@/features/leaderboard/utils/leaderboardUtils';

export function LeaderboardItem({ item }) {
  const renderRankDisplay = (rank) => {
    if (rank === 1) {
      return <span className="text-amber-500 font-bold text-lg sm:text-xl tracking-tight">#1</span>;
    }
    if (rank === 2) {
      return <span className="text-slate-400 font-bold text-lg sm:text-xl tracking-tight">#2</span>;
    }
    if (rank === 3) {
      return <span className="text-amber-700 dark:text-amber-600 font-bold text-lg sm:text-xl tracking-tight">#3</span>;
    }
    return <span className="text-muted-foreground font-medium text-sm sm:text-base">#{rank}</span>;
  };

  return (
    <div
      className={`p-4 sm:p-6 hover:bg-muted/50 transition-colors ${item.rank <= 3 ? 'bg-muted/30' : ''
        }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:w-16 sm:justify-center">
          {renderRankDisplay(item.rank)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-card-foreground">{item.series}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">by {item.author}</p>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Votes</p>
            <p className="text-base sm:text-xl font-semibold text-foreground mt-0.5">{item.votes.toLocaleString()}</p>
          </div>

          <div className="text-center min-w-20">
            <p className="text-muted-foreground text-xs">Growth</p>
            <div className={`flex items-center justify-center gap-1 mt-0.5 ${isTrendingUp(item.change) ? 'text-success' : 'text-destructive'
              }`}>
              {isTrendingUp(item.change) ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="font-medium text-xs sm:text-sm">{item.change}</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground text-xs">Avg Rating</p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <p className="text-base sm:text-xl font-semibold text-foreground">
                {(item.averageRate ?? 0).toFixed(1)}
              </p>
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

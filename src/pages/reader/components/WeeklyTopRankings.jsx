import { Trophy, Medal, Star } from "lucide-react";

export function WeeklyTopRankings({ weeklyTop, isLoading, onNavigateToDetail }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Trending Weekly</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[120px] rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (weeklyTop.length === 0) {
    return null;
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold px-2.5 py-1 rounded-full">
            <Trophy size={12} />
            #1 Gold
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 bg-slate-400/10 text-slate-400 border border-slate-400/20 text-xs font-bold px-2.5 py-1 rounded-full">
            <Medal size={12} />
            #2 Silver
          </span>
        );
      case 3:
        return (
          <span className="flex items-center gap-1 bg-amber-700/10 text-amber-600 border border-amber-700/20 text-xs font-bold px-2.5 py-1 rounded-full">
            <Medal size={12} />
            #3 Bronze
          </span>
        );
      default:
        return null;
    }
  };

  // Sắp xếp thứ tự hiển thị: Hạng 2 - Hạng 1 - Hạng 3 (Podium layout) trên desktop
  // Hạng 1 sẽ được bọc glowing border
  const podiumOrder = [
    weeklyTop.find(t => t.rank === 2),
    weeklyTop.find(t => t.rank === 1),
    weeklyTop.find(t => t.rank === 3),
  ].filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Trophy size={20} className="text-yellow-500" />
        <h2 className="text-xl font-bold">Trending Weekly</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {podiumOrder.map((item) => {
          const isGold = item.rank === 1;
          return (
            <div
              key={item.rank}
              onClick={() => item.id && onNavigateToDetail(item.id)}
              className={`relative bg-card border rounded-2xl p-5 flex gap-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                isGold
                  ? "border-yellow-500/30 ring-1 ring-yellow-500/10 md:-translate-y-2 md:shadow-md"
                  : "border-border"
              }`}
            >
              {/* Cover Art Thumbnail */}
              {item.coverFile ? (
                <div className="w-16 h-22 rounded-lg overflow-hidden border border-border shrink-0">
                  <img
                    src={item.coverFile}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-22 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                  <Trophy size={20} className="text-muted-foreground/30" />
                </div>
              )}

              {/* Title & Stats */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    {getRankBadge(item.rank)}
                  </div>
                  <h3 className="font-bold text-base truncate text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">by {item.author}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Star size={12} className="fill-primary" />
                  <span>{item.votes.toLocaleString()} Votes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

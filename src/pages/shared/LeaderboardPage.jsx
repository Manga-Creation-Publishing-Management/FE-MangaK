import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Medal, Loader2, AlertCircle, Star } from 'lucide-react';
import { leaderboardService } from '../../services/leaderboardService';
import { getTotalPage } from '@/features/Pagination/hooks/getTotalPage';
import { PaginationCustom } from '@/features/Pagination/components/PaginationCustom';

export function LeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState('weekly');

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = timePeriod === 'weekly'
          ? await leaderboardService.getWeeklyLeaderboard()
          : await leaderboardService.getMonthlyLeaderboard();

        const items = Array.isArray(data) ? data : (data?.data || data?.result || []);
        const filteredItems = items
          .filter(item => (item.votes ?? 0) >= 10)
          .map((item, index) => ({
            ...item,
            rank: index + 1
          }));
        setLeaderboardData(filteredItems);
      } catch (err) {
        console.error("Error when fetching leaderboard:", err);
        setError(err.message || "Failed to load leaderboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timePeriod]);

  const pageSize = 10;
  const totalPages = Math.ceil(leaderboardData.length / pageSize);
  const paginatedData = leaderboardData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isTrendingUp = (change) => {
    if (!change) return true;
    return !change.trim().startsWith('-');
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-muted-foreground" size={24} />;
    if (rank === 3) return <Medal className="text-orange-600" size={24} />;
    return <span className="text-muted-foreground font-medium">#{rank}</span>;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className='font-medium text-2xl text-foreground'>Leaderboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Top performing series by reader votes</p>
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setTimePeriod('weekly')}
            className={`px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer ${timePeriod === 'weekly'
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimePeriod('monthly')}
            className={`px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer ${timePeriod === 'monthly'
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">

        <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <Trophy className="text-primary" size={32} />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Top Rankings</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Based on reader votes - {timePeriod === 'weekly' ? 'This Week' : 'This Month'}
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

          ) : leaderboardData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Trophy size={32} className="mb-2 opacity-50" />
              <p>No ranking data available for this period.</p>
            </div>

          ) : (
            paginatedData.map((item) => (
              <div
                key={item.rank}
                className={`p-4 sm:p-6 hover:bg-muted/50 transition-colors ${item.rank <= 3 ? 'bg-muted/30' : ''
                  }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">

                  <div className="flex items-center gap-3 sm:w-16 sm:justify-center">
                    {getRankIcon(item.rank)}
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
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

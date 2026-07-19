import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Medal, Loader2, AlertCircle, Star } from 'lucide-react';
import { leaderboardService } from '../../services/leaderboardService';

export function LeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState('weekly');

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const isTrendingUp = (change) => {
    if (!change) return true;
    return !change.trim().startsWith('-');
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Medal className="text-orange-600" size={24} />;
    return <span className="text-muted-foreground font-medium">#{rank}</span>;
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className='font-medium text-2xl'>Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performing series by reader votes</p>
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setTimePeriod('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${timePeriod === 'weekly'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimePeriod('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${timePeriod === 'monthly'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">

        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <Trophy className="text-primary" size={32} />
            <div>
              <h2>Top Rankings</h2>
              <p className="text-sm text-muted-foreground mt-1">
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
            leaderboardData.map((item, index) => (
              <div
                key={item.rank}
                className={`p-6 hover:bg-muted/50 transition-colors ${index < 3 ? 'bg-muted/30' : ''
                  }`}
              >
                <div className="flex items-center gap-6">

                  <div className="w-16 text-center">
                    {getRankIcon(item.rank)}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base">{item.series}</h3>
                    <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                  </div>



                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Votes</p>
                    <p className="text-xl mt-1">{item.votes.toLocaleString()}</p>
                  </div>

                  <div className="text-center min-w-24">
                    <p className="text-muted-foreground text-sm">Growth</p>
                    <div className={`flex items-center justify-center gap-1 mt-1 ${isTrendingUp(item.change) ? 'text-success' : 'text-destructive'
                      }`}>
                      {isTrendingUp(item.change) ? (
                        <TrendingUp size={18} />
                      ) : (
                        <TrendingDown size={18} />
                      )}
                      <span className="font-medium">{item.change}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Avg Rating</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <p className="text-xl">
                        {(item.averageRate ?? 0).toFixed(1)}
                      </p>
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

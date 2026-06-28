import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Medal, Loader2, AlertCircle, Star } from 'lucide-react';
import { leaderboardService } from '../../services/leaderboardService';

// Component hiển thị Bảng Xếp Hạng (Leaderboard) của các bộ truyện
export function LeaderboardPage() {
  // State quản lý việc người dùng đang xem bảng xếp hạng Tuần (weekly) hay Tháng (monthly)
  const [timePeriod, setTimePeriod] = useState('weekly');

  // State lưu dữ liệu bảng xếp hạng lấy từ API
  const [leaderboardData, setLeaderboardData] = useState([]);
  // State quản lý trạng thái đang tải dữ liệu
  const [isLoading, setIsLoading] = useState(false);
  // State lưu thông báo lỗi nếu gọi API thất bại
  const [error, setError] = useState(null);

  // useEffect: Tự động gọi API mỗi khi timePeriod thay đổi (weekly <-> monthly)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Gọi API tương ứng với tab đang chọn
        const data = timePeriod === 'weekly'
          ? await leaderboardService.getWeeklyLeaderboard()
          : await leaderboardService.getMonthlyLeaderboard();

        // Xử lý cấu trúc response: API có thể trả mảng trực tiếp hoặc bọc trong object
        const items = Array.isArray(data) ? data : (data?.data || data?.result || []);
        setLeaderboardData(items);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu bảng xếp hạng:", err);
        setError(err.message || "Không thể tải dữ liệu bảng xếp hạng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timePeriod]);

  // Hàm xác định trending (up/down) dựa vào chuỗi change từ API
  // Ví dụ: "+12%" -> up, "-3%" -> down, "0%" -> up (mặc định)
  const isTrendingUp = (change) => {
    if (!change) return true;
    return !change.trim().startsWith('-');
  };

  // Hàm trả về icon hoặc số thứ tự hiển thị thay cho rank (Top 1,2,3 sẽ có icon Huy chương)
  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal className="text-yellow-500" size={24} />; // Huy chương vàng
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;   // Huy chương bạc
    if (rank === 3) return <Medal className="text-orange-600" size={24} />; // Huy chương đồng
    // Các rank khác hiển thị dưới dạng số bình thường (#4, #5,...)
    return <span className="text-muted-foreground font-medium">#{rank}</span>;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Tiêu đề trang và Nhóm nút (Toggle) chuyển đổi Tuần/Tháng */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className='font-medium text-2xl'>Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performing series by reader votes</p>
        </div>

        {/* Box chứa các nút Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setTimePeriod('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${timePeriod === 'weekly'
              ? 'bg-primary text-primary-foreground' // Highlight khi đang ở tab Weekly
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimePeriod('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${timePeriod === 'monthly'
              ? 'bg-primary text-primary-foreground' // Highlight khi đang ở tab Monthly
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Card (Khung) bọc ngoài danh sách xếp hạng */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">

        {/* Banner tiêu đề bên trong Card */}
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

        {/* Danh sách từng dòng (Row) của bảng xếp hạng */}
        <div className="divide-y divide-border min-h-[200px]">

          {/* Trạng thái đang tải (Loading) */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-primary mr-3" size={28} />
              <span className="text-muted-foreground">Loading leaderboard...</span>
            </div>

          ) : error ? (
            /* Trạng thái lỗi (Error) */
            <div className="flex flex-col items-center justify-center py-16 text-destructive">
              <AlertCircle size={32} className="mb-2" />
              <p className="font-medium">Failed to load leaderboard</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>

          ) : leaderboardData.length === 0 ? (
            /* Trạng thái không có dữ liệu (Empty) */
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Trophy size={32} className="mb-2 opacity-50" />
              <p>No ranking data available for this period.</p>
            </div>

          ) : (
            /* Hiển thị dữ liệu thật từ API */
            leaderboardData.map((item, index) => (
              <div
                key={item.rank}
                // Top 3 (index 0,1,2) sẽ được làm nổi bật nhẹ với bg-muted/30
                className={`p-6 hover:bg-muted/50 transition-colors ${index < 3 ? 'bg-muted/30' : ''
                  }`}
              >
                <div className="flex items-center gap-6">

                  {/* Cột 1: Icon/Số Rank */}
                  <div className="w-16 text-center">
                    {getRankIcon(item.rank)}
                  </div>

                  {/* Cột 2: Tên truyện và Tác giả */}
                  <div className="flex-1">
                    <h3 className="text-base">{item.series}</h3>
                    <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                  </div>



                  {/* Cột 4: Số lượng người đánh giá */}
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Votes</p>
                    <p className="text-xl mt-1">{item.votes.toLocaleString()}</p>
                  </div>

                  {/* Cột 4: Mức độ tăng trưởng (Growth) */}
                  {/* Trending được xác định từ chuỗi change: bắt đầu bằng "-" = down, còn lại = up */}
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

                  {/* Cột 3: Điểm đánh giá trung bình (Average Rating) */}
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


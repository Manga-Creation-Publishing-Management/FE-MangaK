import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Medal } from 'lucide-react';

// Component hiển thị Bảng Xếp Hạng (Leaderboard) của các bộ truyện
export function LeaderboardPage() {
  // State quản lý việc người dùng đang xem bảng xếp hạng Tuần (weekly) hay Tháng (monthly)
  const [timePeriod, setTimePeriod] = useState('weekly');

  {/* Dữ liệu mẫu (mock data) cho Bảng xếp hạng Tuần */}
  const weeklyData = [
    { rank: 1, series: 'The Last Warrior', author: 'Akira Tanaka', votes: 8542, change: '+12%', trending: 'up' },
    { rank: 2, series: 'Moonlight Chronicles', author: 'Yuki Sato', votes: 6234, change: '+8%', trending: 'up' },
    { rank: 3, series: 'Dark Academia', author: 'Hiro Yamada', votes: 4891, change: '+15%', trending: 'up' },
    { rank: 4, series: 'Cyber Samurai', author: 'Kenji Ito', votes: 4102, change: '-3%', trending: 'down' },
    { rank: 5, series: 'Magic School Days', author: 'Sakura Tanaka', votes: 3845, change: '+5%', trending: 'up' },
    { rank: 6, series: 'Urban Legends', author: 'Ryu Nakamura', votes: 3421, change: '-8%', trending: 'down' },
    { rank: 7, series: 'Ocean Warriors', author: 'Ami Watanabe', votes: 2998, change: '+2%', trending: 'up' },
    { rank: 8, series: 'Space Explorers', author: 'Taro Suzuki', votes: 2654, change: '+18%', trending: 'up' },
  ];

  {/* Dữ liệu mẫu (mock data) cho Bảng xếp hạng Tháng */}
  const monthlyData = [
    { rank: 1, series: 'The Last Warrior', author: 'Akira Tanaka', votes: 34280, change: '+25%', trending: 'up' },
    { rank: 2, series: 'Dark Academia', author: 'Hiro Yamada', votes: 28540, change: '+32%', trending: 'up' },
    { rank: 3, series: 'Moonlight Chronicles', author: 'Yuki Sato', votes: 24936, change: '+15%', trending: 'up' },
    { rank: 4, series: 'Magic School Days', author: 'Sakura Tanaka', votes: 19820, change: '+12%', trending: 'up' },
    { rank: 5, series: 'Cyber Samurai', author: 'Kenji Ito', votes: 16408, change: '-5%', trending: 'down' },
    { rank: 6, series: 'Space Explorers', author: 'Taro Suzuki', votes: 14532, change: '+42%', trending: 'up' },
    { rank: 7, series: 'Urban Legends', author: 'Ryu Nakamura', votes: 13684, change: '-12%', trending: 'down' },
    { rank: 8, series: 'Ocean Warriors', author: 'Ami Watanabe', votes: 11992, change: '+8%', trending: 'up' },
  ];

  // Dữ liệu dùng để render thực tế phụ thuộc vào việc người dùng chọn Tuần hay Tháng
  const currentData = timePeriod === 'weekly' ? weeklyData : monthlyData;

  // Hàm trả về icon hoặc số thứ tự hiển thị thay cho rank (Top 1,2,3 sẽ có icon Huy chương)
  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal className="text-yellow-500" size={24} />; // Huy chương vàng
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;   // Huy chương bạc
    if (rank === 3) return <Medal className="text-orange-600" size={24} />; // Huy chương đồng
    // Các rank khác hiển thị dưới dạng số bình thường (#4, #5,...)
    return <span className="text-muted-foreground font-medium">#{rank}</span>;
  };

  return (
    <div className="p-9 space-y-8">
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
        <div className="divide-y divide-border">
          {currentData.map((item, index) => (
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

                {/* Cột 3: Lượt Vote */}
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">Votes</p>
                  <p className="text-xl mt-1">{item.votes.toLocaleString()}</p>
                </div>

                {/* Cột 4: Mức độ tăng trưởng (Growth) */}
                <div className="text-center min-w-24">
                  <p className="text-muted-foreground text-sm">Growth</p>
                  {/* Thay đổi màu sắc dựa vào trending (up: xanh lá / down: đỏ) */}
                  <div className={`flex items-center justify-center gap-1 mt-1 ${item.trending === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                    {/* Hiển thị icon mũi tên tương ứng */}
                    {item.trending === 'up' ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                    {/* Phần trăm thay đổi */}
                    <span className="font-medium">{item.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

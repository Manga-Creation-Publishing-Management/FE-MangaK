import { useState, useEffect } from 'react';
import { seriesService } from '@/services/seriesService';
import { leaderboardService } from '@/services/leaderboardService';
import { useNavigate } from 'react-router';

export function useReaderDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [seriesList, setSeriesList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [weeklyTop, setWeeklyTop] = useState([]);
  const [featuredSeries, setFeaturedSeries] = useState(null);

  const [searchTxt, setSearchTxt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, seriesRes, weeklyLeaderboardRes] = await Promise.all([
          seriesService.getAllCategory(),
          seriesService.getAllSeries(),
          leaderboardService.getWeeklyLeaderboard(),
        ]);

        const allSeries = seriesRes.data || [];
        const activeSeries = allSeries.filter(s => s.status?.toLowerCase() === "publishing");
        setSeriesList(activeSeries);

        setCategories(categoriesRes.data || []);

        const leaderboard = weeklyLeaderboardRes.data || weeklyLeaderboardRes || [];

        // So khớp thông tin từ Leaderboard với danh sách Series thật để lấy cover & id
        const mappedLeaderboard = leaderboard.slice(0, 3).map((item, index) => {
          const matched = activeSeries.find(
            s => s.title?.toLowerCase() === item.series?.toLowerCase()
          );
          return {
            rank: index + 1,
            id: matched?.seriesId || matched?.id || null,
            title: item.series,
            author: item.author,
            votes: item.votes,
            coverFile: matched?.coverFile || null,
          };
        });
        setWeeklyTop(mappedLeaderboard);

        // Chọn truyện nổi bật (Ưu tiên hạng 1 tuần, hoặc truyện đầu tiên đang xuất bản)
        if (mappedLeaderboard.length > 0 && mappedLeaderboard[0].id) {
          const featured = activeSeries.find(s => s.seriesId === mappedLeaderboard[0].id);
          setFeaturedSeries(featured || activeSeries[0] || null);
        } else {
          setFeaturedSeries(activeSeries[0] || null);
        }
      } catch (error) {
        console.error("Error loading Reader Dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (txt) => {
    setSearchTxt(txt);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleNavigateToDetail = (seriesId) => {
    navigate(`/reader/series/${seriesId}`, { state: { role: 'reader' } });
  };

  // Lọc danh sách truyện khám phá dựa trên từ khóa tìm kiếm và thể loại đang chọn
  const filteredSeries = seriesList.filter(series => {
    const matchesSearch = series.title?.toLowerCase().includes(searchTxt.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== "all") {
      // Mỗi series có thể có danh sách categoryIds
      matchesCategory = series.categoryIds?.includes(Number(selectedCategory)) || 
                        series.categories?.some(c => c.categoryId === Number(selectedCategory));
    }

    return matchesSearch && matchesCategory;
  });

  return {
    isLoading,
    featuredSeries,
    weeklyTop,
    categories,
    searchTxt,
    selectedCategory,
    filteredSeries,
    handleSearch,
    handleCategorySelect,
    handleNavigateToDetail,
  };
}

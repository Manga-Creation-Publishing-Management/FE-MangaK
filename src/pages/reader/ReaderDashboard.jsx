import { useReaderDashboard } from './hooks/useReaderDashboard';
import { HeaderPage } from '@/layout/HeaderPage';
import { FeaturedHeroBanner } from './components/FeaturedHeroBanner';
import { WeeklyTopRankings } from './components/WeeklyTopRankings';
import { GenreFilterTags } from './components/GenreFilterTags';
import { SeriesManagement } from '../shared/SeriesManagement';
import { Search } from 'lucide-react';

// Component Trang chủ dành cho Reader (Độc giả)
export function ReaderDashboard() {
  const {
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
  } = useReaderDashboard();

  return (
    <div className='h-screen bg-background flex flex-col'>
      {/* Thanh Header dành riêng cho Reader, hiển thị avatar */}
      <HeaderPage roleName="Reader" avatarUrl="/avatarImgDemo.png" />

      <div className='p-6 space-y-8 bg-background flex-1 overflow-y-auto'>
        {/* Hàng 1: Banner truyện tiêu điểm */}
        <FeaturedHeroBanner
          featuredSeries={featuredSeries}
          isLoading={isLoading}
          onNavigateToDetail={handleNavigateToDetail}
        />

        {/* Hàng 2: Bảng xếp hạng Top 3 */}
        <WeeklyTopRankings
          weeklyTop={weeklyTop}
          isLoading={isLoading}
          onNavigateToDetail={handleNavigateToDetail}
        />

        <hr className="border-border/60" />

        {/* Hàng 3: Khám phá truyện */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Explore Series</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Find and rate your next favorite story</p>
            </div>

            {/* Ô tìm kiếm */}
            <div className="w-full md:w-80 p-2.5 bg-muted rounded-full flex gap-3 hover:border hover:border-primary px-4 border border-transparent transition-all">
              <Search className="text-muted-foreground translate-y-[1px]" size={18} />
              <input
                className="w-full focus:outline-none text-xs bg-transparent"
                type="text"
                placeholder="Search series by name..."
                value={searchTxt}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Hàng thể loại lọc nhanh */}
          <GenreFilterTags
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            isLoading={isLoading}
          />

          {/* Danh sách kết quả */}
          {filteredSeries.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/10">
              <p className="text-muted-foreground text-sm font-medium">No series match your filters.</p>
            </div>
          ) : (
            <SeriesManagement role="reader" seriesFiltered={filteredSeries} />
          )}
        </div>
      </div>
    </div>
  );
}

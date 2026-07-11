import { useTantouDashboard } from './hooks/useTantouDashboard';
import { OverviewCard } from '@/shared/components/OverviewCard';
import { CircleEllipsis, CircleCheckBig, CircleX } from 'lucide-react';
import { ProcessingSeriesList } from './components/ProcessingSeriesList';
import { TantouStatusDistribution } from './components/TantouStatusDistribution';
import { RecentlyReviewedList } from './components/RecentlyReviewedList';

// Component Trang chủ (Dashboard) dành riêng cho role Tantou Editor (Biên tập viên phụ trách)
export function TantouDashboard() {
  const {
    isLoading,
    processingCount,
    approvedCount,
    rejectedCount,
    pendingSeries,
    statusDistribution,
    recentlyReviewed,
    handleNavigateToSeries,
    handleNavigateToSeriesList,
  } = useTantouDashboard();

  return (
    <div className='p-6 space-y-8 bg-background min-h-full'>
      {/* Hàng 1: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          contentText="Processing Series"
          iconName={<CircleEllipsis size={30} />}
          iconColor="#60a5fa"
          valueNum={isLoading ? "..." : processingCount}
        />
        <OverviewCard
          contentText="Approved Series"
          iconName={<CircleCheckBig size={30} />}
          iconColor="#34d399"
          valueNum={isLoading ? "..." : approvedCount}
        />
        <OverviewCard
          contentText="Rejected Series"
          iconName={<CircleX size={30} />}
          iconColor="#fbbf24"
          valueNum={isLoading ? "..." : rejectedCount}
        />
      </div>

      {/* Hàng 2: Grid 2 cột – Series cần Review + Phân bổ trạng thái */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProcessingSeriesList
          pendingSeries={pendingSeries}
          isLoading={isLoading}
          onNavigateToSeries={handleNavigateToSeries}
          onNavigateToSeriesList={handleNavigateToSeriesList}
        />
        <TantouStatusDistribution
          statusDistribution={statusDistribution}
          isLoading={isLoading}
        />
      </div>

      {/* Hàng 3: Recently Reviewed */}
      <RecentlyReviewedList
        recentlyReviewed={recentlyReviewed}
        isLoading={isLoading}
        onNavigateToSeries={handleNavigateToSeries}
      />
    </div>
  );
}


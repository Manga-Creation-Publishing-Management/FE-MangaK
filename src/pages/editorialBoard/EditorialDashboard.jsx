import { useState } from 'react';
import { OverviewCard } from '@/shared/components/OverviewCard';
import { CheckCircle, Calendar, BookOpen } from 'lucide-react';
import { ApprovedSeriesCard } from '@/pages/editorialBoard/components/ApprovedSeriesCard';
import { CancelSeriesModal } from '@/pages/editorialBoard/components/CancelSeriesModal';
import { CancelSuccessModal } from '@/pages/editorialBoard/components/CancelSuccessModal';
import { useEditorialDashboard } from '@/pages/editorialBoard/hooks/useEditorialDashboard';
import { UpcomingReleases } from '@/pages/editorialBoard/components/UpcomingReleases';
import { StatusDistribution } from '@/pages/editorialBoard/components/StatusDistribution';
import { PaginationCustom } from '@/features/pagination/components/PaginationCustom';

export function EditorialDashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    showCancelModal,
    setShowCancelModal,
    selectedSeries,
    setSelectedSeries,
    cancelFeedback,
    setCancelFeedback,
    approvedSeries,
    isLoading,
    showSuccessModal,
    setShowSuccessModal,
    cancelledSeriesName,
    seriesStats,
    upcomingReleases,
    handleCancelClick,
    handleCancelConfirm,
    handleNavigate,
  } = useEditorialDashboard();

  const pageSize = 3;
  const totalPages = Math.ceil(approvedSeries.length / pageSize);
  const paginatedApprovedSeries = approvedSeries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          iconName={<CheckCircle size={24} />}
          iconColor="#10b981"
          contentText="Active Series"
          valueNum={seriesStats.active}
        />
        <OverviewCard
          iconName={<Calendar size={24} />}
          iconColor="#06b6d4"
          contentText="This Month Releases"
          valueNum={seriesStats.thisMonthReleases}
        />
        <OverviewCard
          iconName={<BookOpen size={24} />}
          iconColor="#6366f1"
          contentText="Total Series"
          valueNum={seriesStats.total}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingReleases upcomingReleases={upcomingReleases} />
        <StatusDistribution statusDistribution={seriesStats.statusDistribution} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Approved Series</h3>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading approved series...</p>
        ) : approvedSeries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No approved series currently in publication.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedApprovedSeries.map((item) => (
                <ApprovedSeriesCard
                  key={item.id}
                  item={item}
                  onCancelClick={handleCancelClick}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <PaginationCustom
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <CancelSeriesModal
        show={showCancelModal}
        selectedSeries={selectedSeries}
        cancelFeedback={cancelFeedback}
        onCancelFeedbackChange={setCancelFeedback}
        onConfirm={handleCancelConfirm}
        onClose={() => {
          setShowCancelModal(false);
          setCancelFeedback("");
          setSelectedSeries(null);
        }}
      />

      <CancelSuccessModal
        show={showSuccessModal}
        cancelledSeriesName={cancelledSeriesName}
        onClose={() => setShowSuccessModal(false)}
      />

    </div>
  );
}

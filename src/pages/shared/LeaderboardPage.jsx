import React from 'react';
import { useLeaderboard } from '@/features/leaderboard/hooks/useLeaderboard';
import { LeaderboardFilter } from '@/features/leaderboard/components/LeaderboardFilter';
import { LeaderboardList } from '@/features/leaderboard/components/LeaderboardList';
import { PaginationCustom } from '@/features/Pagination/components/PaginationCustom';

export function LeaderboardPage() {
  const {
    timePeriod,
    setTimePeriod,
    selectedPeriod,
    setSelectedPeriod,
    leaderboardData,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    periodOptions,
    getHeaderPeriodLabel
  } = useLeaderboard();

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-medium text-2xl text-foreground">Leaderboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Top performing series by reader votes</p>
        </div>

        <LeaderboardFilter
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          periodOptions={periodOptions}
        />
      </div>

      <LeaderboardList
        isLoading={isLoading}
        error={error}
        paginatedData={paginatedData}
        leaderboardDataLength={leaderboardData.length}
        timePeriod={timePeriod}
        getHeaderPeriodLabel={getHeaderPeriodLabel}
      />

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

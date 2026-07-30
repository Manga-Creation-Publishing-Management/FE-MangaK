import { useState } from 'react';
import { ChevronDown, ChevronUp, CircleCheckBig, History, JapaneseYen, Calendar } from 'lucide-react';
import { OverviewCard } from '@/shared/components/OverviewCard';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { useIncome } from '@/features/tasks/hooks/useIncome';
import { useIncomeHistory } from '@/features/tasks/hooks/useIncomeHistory';
import { PaginationCustom } from '@/features/pagination/components/PaginationCustom';
import dayjs from 'dayjs';

export function Income() {
  const [historyPage, setHistoryPage] = useState(1);
  const [paidPage, setPaidPage] = useState(1);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const {
    totalIncome,
    countCompletedTask,
    paidIncomes,
    loadingPaid
  } = useIncome();

  const { monthlyIncomesList, loading: loadingHistory } = useIncomeHistory();

  const paidPageSize = 5;
  const paidTotalPages = Math.ceil((paidIncomes || []).length / paidPageSize);
  const paginatedPaidIncomes = (paidIncomes || []).slice(
    (paidPage - 1) * paidPageSize,
    paidPage * paidPageSize
  );

  const historyPageSize = 5;
  const historyTotalPages = Math.ceil((monthlyIncomesList || []).length / historyPageSize);
  const paginatedHistory = (monthlyIncomesList || []).slice(
    (historyPage - 1) * historyPageSize,
    historyPage * historyPageSize
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-background min-h-full">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <OverviewCard
          contentText="Completed Tasks"
          iconName={<CircleCheckBig size={30} />}
          iconColor="#34d399"
          valueNum={`${countCompletedTask}`}
        />
        <OverviewCard
          contentText="Total Income This Month"
          iconName={<JapaneseYen size={30} />}
          iconColor="#34d399"
          valueNum={`${(totalIncome || 0).toLocaleString("en-US")}`}
        />
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <JapaneseYen size={24} className="stroke-[2.5] text-success" />
          <h4 className="text-xl font-semibold text-card-foreground">Incomes This Month</h4>
        </div>

        {loadingPaid ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted/10">
            <p className="text-sm text-muted-foreground">Loading incomes...</p>
          </div>
        ) : (paidIncomes || []).length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted/10">
            <p className="text-sm text-muted-foreground">No income recorded for this month.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedPaidIncomes.map((item, index) => {
              const title =
                (item.chapterNumber != null ? `Chapter ${item.chapterNumber} - ` : "") +
                (item.seriesTitle || item.taskTitle || item.title || `Income Task #${index + 1}`);

              const amount = item.incomeAmount ?? item.amount ?? 0;
              const dateStr = item.completedAt || item.createdAt || item.date;

              return (
                <div
                  key={item.id || item.incomeTaskId || index}
                  className="p-4 bg-background border border-border/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-card-foreground text-base sm:text-lg truncate">
                      {title}
                    </p>
                    {dateStr && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Date: {dayjs(dateStr).format("DD/MM/YYYY HH:mm")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 w-full sm:w-auto">
                    <span className="text-lg sm:text-xl font-bold text-success flex items-center gap-0.5">
                      <JapaneseYen size={19} strokeWidth={2.5} />
                      <span>{amount.toLocaleString("en-US")}</span>
                    </span>
                    <StatusBadge status={(item.status || "paid").toLowerCase()} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paidTotalPages > 1 && (
          <PaginationCustom
            currentPage={paidPage}
            totalPages={paidTotalPages}
            setCurrentPage={setPaidPage}
          />
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        
        <div
          onClick={() => setIsHistoryOpen((prev) => !prev)}
          className="flex items-center justify-between cursor-pointer select-none py-1 hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <History size={24} className="stroke-[2.5]" />
            </div>
            <h4 className="text-xl font-semibold text-card-foreground">Income History</h4>
          </div>

          <button
            type="button"
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label="Toggle Income History"
          >
            {isHistoryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isHistoryOpen && (
          <div className="pt-3 space-y-4 border-t border-border/50 animate-in fade-in duration-200">
            {loadingHistory ? (
              <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted/10">
                <p className="text-sm text-muted-foreground">Loading income history...</p>
              </div>
            ) : (monthlyIncomesList || []).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/10">
                <p className="text-muted-foreground text-sm">No income history available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {paginatedHistory.map((item) => (
                  <div className="p-4 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                    <div className="text-lg sm:text-xl font-bold text-success w-full flex justify-between items-center gap-0.5">
                      <div className="flex items-center gap-4">
                        <Calendar size={20} strokeWidth={2.5} />
                        <p className="text-foreground"> {item.month}/{item.year}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <JapaneseYen size={20} strokeWidth={2.5} />
                        <span> {item.totalIncome}</span>
                      </div>
                    </div>
                    <StatusBadge status={(item.status || "paid").toLowerCase()} />
                  </div>
                ))}
              </div>
            )}

            {historyTotalPages > 1 && (
              <PaginationCustom
                currentPage={historyPage}
                totalPages={historyTotalPages}
                setCurrentPage={setHistoryPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
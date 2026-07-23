import { useState } from "react";
import { ArrowUpRight, Calendar, CircleAlert, CircleCheckBig, CircleDashed, InfoIcon, JapaneseYen } from "lucide-react";
import { OverviewCard } from "@/shared/components/OverviewCard";
import { MyTask } from "./MyTask";
import { useIncome } from "../../features/tasks/hooks/useIncome";
import { useIncomeHistory } from "../../features/tasks/hooks/useIncomeHistory";
import { getTotalPage } from "@/features/Pagination/hooks/getTotalPage";
import { PaginationCustom } from "@/features/Pagination/components/PaginationCustom";

export function Income() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    totalIncome,
    countCompletedTask
  } = useIncome();

  const { monthlyIncomesList } = useIncomeHistory();

  const pageSize = 6;
  const totalPages = Math.ceil((monthlyIncomesList || []).length / pageSize);
  const paginatedIncomes = (monthlyIncomesList || []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  console.log("list monthly:", monthlyIncomesList);

  return (
    <div className='p-4 sm:p-6 space-y-6 sm:space-y-8 bg-background min-h-full'>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <OverviewCard contentText="Completed tasks" iconName={<CircleCheckBig size={30} />} iconColor="#34d399" valueNum={`${countCompletedTask}`} />
        <OverviewCard contentText="Total Income This Month" iconName={<JapaneseYen size={30} />} iconColor="#34d399" valueNum={`${totalIncome.toLocaleString('en-US') }`} />
      </div>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-5 text-card-foreground">Income History</h2>

        <div className="grid grid-cols-1 gap-4">
          {paginatedIncomes.map(item => (
            <div
              key={`${item.month}-${item.year}`}
              className="bg-background border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Cụm thông tin Thời gian bên trái */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Calendar size={22} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-xl sm:text-2xl">
                      {item.month}/{item.year}
                    </p>
                  </div>
                </div>

                {/* Cụm số tiền bên phải */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                  <span className="text-xl sm:text-2xl font-bold text-success flex items-center gap-0.5">
                    <JapaneseYen size={20} strokeWidth={2.5} className="shrink-0 translate-y-[1px]" />
                    <span>{item.totalIncome.toLocaleString('en-US')}</span>
                  </span>

                  {/* Icon trang trí chỉ hướng tăng trưởng */}
                  <div className="text-muted-foreground/60 p-1">
                    <InfoIcon size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Trường hợp mảng rỗng / Chưa có dữ liệu */}
          {(!monthlyIncomesList || monthlyIncomesList.length === 0) && (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/10">
              <p className="text-muted-foreground text-sm">No income history available for this period.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <PaginationCustom
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
import { ArrowUpRight, Calendar, CircleAlert, CircleCheckBig, CircleDashed, InfoIcon, JapaneseYen } from "lucide-react";
import { OverviewCard } from "@/shared/components/OverviewCard";
import { MyTask } from "./MyTask";
import { useIncome } from "../../features/tasks/hooks/useIncome";
import { useIncomeHistory } from "../../features/tasks/hooks/useIncomeHistory";

export function Income() {


  const {
    totalIncome,
    countCompletedTask
  } = useIncome();

  const { monthlyIncomesList } = useIncomeHistory();
  
  console.log("list monthly:", monthlyIncomesList);

  return (
    <div className='p-6 space-y-8 bg-background min-h-full'>
      <div className='flex gap-6 xs:flex-col'>
        <OverviewCard contentText="Completed tasks" iconName={<CircleCheckBig size={30} />} iconColor="#34d399" valueNum={`${countCompletedTask}`} />
        <OverviewCard contentText="Total Income This Month" iconName={<JapaneseYen size={30} />} iconColor="#34d399" valueNum={`${totalIncome.toLocaleString('en-US') }`} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-5 text-card-foreground">Income History</h2>

        <div className="grid grid-cols-1 gap-4">
          {monthlyIncomesList?.map(item => (
            <div
              key={`${item.month}-${item.year}`}
              className="bg-background border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                {/* Cụm thông tin Thời gian bên trái */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Calendar size={22} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-2xl">
                      {item.month}/{item.year}
                    </p>
                  </div>
                </div>

                {/* Cụm số tiền bên phải */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-2xl font-bold text-success flex items-center gap-0.5">
                    <JapaneseYen size={22} strokeWidth={2.5} className="shrink-0 translate-y-[1px]" />
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
      </div>
    </div>
  );
}
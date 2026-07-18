import { useAssistantDashboard } from './hooks/useAssistantDashboard';
import { OverviewCard } from '@/shared/components/OverviewCard';
import { CircleCheckBig, CircleDashed, CircleAlert } from 'lucide-react';
import { UrgentTaskCard } from './components/UrgentTaskCard';
import { MyTask } from './MyTask';

// Component Trang chủ (Dashboard) dành riêng cho role Assistant (Trợ lý)
export function AssistantDashboard() {
  const {
    isLoading,
    completedCount,
    pendingCount,
    reviewCount,
    urgentTasks,
    handleNavigateToTask,
  } = useAssistantDashboard();

  return (
    <div className='p-6 space-y-8 bg-background min-h-full animate-in fade-in duration-300'>
      {/* Hàng 1: Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <OverviewCard
          contentText="Completed tasks"
          iconName={<CircleCheckBig size={30} />}
          iconColor="#34d399"
          valueNum={isLoading ? "..." : completedCount}
        />
        <OverviewCard
          contentText="Pending tasks"
          iconName={<CircleDashed size={30} />}
          iconColor="#60a5fa"
          valueNum={isLoading ? "..." : pendingCount}
        />
        <OverviewCard
          contentText="Need to review"
          iconName={<CircleAlert size={30} />}
          iconColor="#fbbf24"
          valueNum={isLoading ? "..." : reviewCount}
        />
      </div>

      {/* Hàng 2: Grid 4-8 (Urgent Spotlight + Nhiệm vụ khác) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Cột trái (col-span-4): Spotlight Task khẩn cấp */}
        <div className="lg:col-span-4">
          <UrgentTaskCard
            urgentTasks={urgentTasks}
            isLoading={isLoading}
            onNavigateToTask={handleNavigateToTask}
          />
        </div>

        {/* Cột phải (col-span-8): Danh sách các nhiệm vụ khác */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-5">My Assigned Tasks</h2>
          <MyTask isDashboardView={true} />
        </div>
      </div>
    </div>
  );
}

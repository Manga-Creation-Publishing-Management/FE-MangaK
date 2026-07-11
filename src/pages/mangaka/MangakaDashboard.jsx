import { useMangakaDashboard } from './hooks/useMangakaDashboard';
import { OverviewPanel } from './components/OverviewPanel';
import { ActiveAssistantsTable } from './components/ActiveAssistantsTable';
import { TasksToApproveTable } from './components/TasksToApproveTable';

// Component Trang chủ (Dashboard) dành riêng cho role Mangaka (Tác giả)
export function MangakaDashboard() {
  const {
    totalSeries,
    pendingChaptersCount,
    pendingTasks,
    activeAssistants,
    isLoading,
    handleNavigateToTask,
  } = useMangakaDashboard();

  return (
    <div className='p-6 space-y-8 bg-background min-h-full'>
      {/* Khung chia 2 cột phía trên */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột trái: Overview bọc 2 Overview Card chiều dọc */}
        <OverviewPanel 
          isLoading={isLoading} 
          totalSeries={totalSeries} 
          pendingChaptersCount={pendingChaptersCount} 
        />

        {/* Cột phải: Active Assistants */}
        <ActiveAssistantsTable 
          isLoading={isLoading} 
          activeAssistants={activeAssistants} 
        />
      </div>

      {/* Phần Tasks to Approve nằm hoàn toàn ở hàng riêng phía dưới */}
      <TasksToApproveTable 
        isLoading={isLoading} 
        pendingTasks={pendingTasks} 
        onNavigateToTask={handleNavigateToTask} 
      />
    </div>
  );
}

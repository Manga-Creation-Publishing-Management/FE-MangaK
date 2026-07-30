import { useMangakaDashboard } from '@/pages/mangaka/hooks/useMangakaDashboard';
import { OverviewPanel } from '@/pages/mangaka/components/OverviewPanel';
import { ActiveAssistantsTable } from '@/pages/mangaka/components/ActiveAssistantsTable';
import { TasksToApproveTable } from '@/pages/mangaka/components/TasksToApproveTable';

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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <OverviewPanel 
          isLoading={isLoading} 
          totalSeries={totalSeries} 
          pendingChaptersCount={pendingChaptersCount} 
        />

        <ActiveAssistantsTable 
          isLoading={isLoading} 
          activeAssistants={activeAssistants} 
        />
      </div>

      <TasksToApproveTable 
        isLoading={isLoading} 
        pendingTasks={pendingTasks} 
        onNavigateToTask={handleNavigateToTask} 
      />
    </div>
  );
}

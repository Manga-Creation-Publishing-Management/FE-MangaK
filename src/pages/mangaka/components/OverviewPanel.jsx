import { OverviewCard } from '@/shared/components/OverviewCard';
import { BookOpen, CircleEllipsis } from 'lucide-react';

export function OverviewPanel({ isLoading, totalSeries, pendingChaptersCount }) {
  return (
    <div className="lg:col-span-4 bg-card border border-border rounded-xl p-6 space-y-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-foreground">Overview</h3>
        <p className="text-xs text-muted-foreground">General metrics and active status summary.</p>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-6 py-4">
        <OverviewCard 
          contentText="Total Series" 
          iconName={<BookOpen size={30} />} 
          iconColor="#60a5fa" 
          valueNum={isLoading ? "..." : totalSeries} 
        />
        <OverviewCard 
          contentText="Pending Chapters" 
          iconName={<CircleEllipsis size={30} />} 
          iconColor="#fbbf24" 
          valueNum={isLoading ? "..." : pendingChaptersCount} 
        />
      </div>
    </div>
  );
}

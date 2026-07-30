import { useGetFeedbackDetail } from '@/shared/hooks/useGetFeedbackDetail';
import { FeedbackHistoryItem } from '@/shared/components/FeedbackHistoryItem';
import { History, AlertCircle } from 'lucide-react';

export function FeedbackHistoryList({ seriesId = null, chapterId = null, taskId = null, fileUrl, role }) {
  const { feedbacks, isLoading, error } = useGetFeedbackDetail(seriesId, chapterId, taskId);

  return (
    <div className="w-full bg-card rounded-xl p-5 md:p-6 border border-border shadow-sm mt-3">
      
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border/60">
        <div className="text-primary flex items-center justify-center">
          <History size={18} className="stroke-[2.2]" />
        </div>
        <h3 className="text-foreground text-sm md:text-base font-bold tracking-tight">
          Feedback History Logs
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-xs animate-pulse font-medium">Loading history logs...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 justify-center py-6 text-destructive text-xs md:text-sm font-medium">
            <AlertCircle size={16} />
            <span>Could not load feedback history.</span>
          </div>
        ) : feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((item, idx) => (
            <FeedbackHistoryItem
              key={item.id || idx}
              feedback={item}
              fileUrl={fileUrl}
              role={role}
            />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <History size={40} className="mx-auto mb-2 opacity-25 stroke-[1.5]" />
            <p className="text-xs font-light">No feedback history found for this submission.</p>
          </div>
        )}
      </div>
    </div>
  );
}

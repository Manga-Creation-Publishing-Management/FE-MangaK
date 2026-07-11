import { Mail } from 'lucide-react';
import { FeedbackItem } from './FeedbackItem';
import { useFeedback } from '@/features/auth/hooks/useFeedback';
import { useGetFeedback } from '@/features/series/hooks/useGetFeedback';

export function Feedback({ Feedbacks }) {
  const { Feedbacks: hookFeedbacks } = useFeedback();
  const displayFeedbacks = Feedbacks ?? hookFeedbacks ?? [];
  const newCount = displayFeedbacks.filter(notif => notif.isNew).length;
  const { feedbackData } = useGetFeedback();

  return (
    <div className="w-full mx-auto bg-card rounded-lg p-6 md:p-8 shadow border-accent border">
      <div className="flex items-center gap-3.5 mb-6 md:mb-8 pb-4 border-b border-border/50">
        <div className="text-accent flex items-center justify-center p-1">
          <Mail size={28} className="stroke-[2]" />
        </div>
        <h2 className="text-accent text-lg font-bold tracking-tight">
          Feedback Mailbox
        </h2>
        {/* {newCount > 0 && (
          <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold tracking-wide animate-pulse">
            {newCount} new
          </span>
        )}
         */}


      </div>

      <div className="flex flex-col gap-4">
        {feedbackData?.data?.length > 0 ? (
          feedbackData?.data?.map((feedback) => (
            <FeedbackItem
              key={feedback.id}
              senderName={feedback.senderName}
              seriesTitle={feedback.seriesTitle}
              content={feedback.content}
              createdAt={feedback.createdAt}
              hasIcon={true}
              isNew={true}
            />
          ))
        )

          : (<div className="text-center py-12 text-muted-foreground">
            <Mail size={48} className="mx-auto mb-3 opacity-30 stroke-[1.5]" />
            <p className="text-sm">No new feedback messages</p>
          </div>
          )
        }
      </div>
    </div >
  );
}

export default Feedback;

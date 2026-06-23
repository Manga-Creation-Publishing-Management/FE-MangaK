import { Mail } from 'lucide-react';
import { FeedbackItem } from './FeedbackItem';
import { useFeedback } from '@/features/auth/hooks/useFeedback';

export function Feedback({ feedbacks }) {
  const { feedbacks: hookFeedbacks, isLoading, error } = useFeedback();
  const displayFeedbacks = feedbacks ?? hookFeedbacks ?? [];

  // Helper function to format the feedback targets as a breadcrumb path
  const getSubject = (fback) => {
    const parts = [];
    if (fback.seriesTitle) parts.push(`Series: ${fback.seriesTitle}`);
    if (fback.chapterTitle) parts.push(`Chapter: ${fback.chapterTitle}`);
    if (fback.mangaTaskTitle) parts.push(`Task: ${fback.mangaTaskTitle}`);
    return parts.length > 0 ? parts.join(" ▸ ") : "General Feedback";
  };

  // Helper function to format CreatedAt date/time
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to determine if a feedback is new (e.g., within the last 24 hours)
  const isNewFeedback = (dateString) => {
    if (!dateString) return false;
    try {
      const diff = Date.now() - new Date(dateString).getTime();
      return diff > 0 && diff < 24 * 60 * 60 * 1000;
    } catch (e) {
      return false;
    }
  };

  // Calculate new feedbacks count
  const newCount = displayFeedbacks.filter(fback => {
    if (fback.isNew !== undefined) return fback.isNew;
    return isNewFeedback(fback.createdAt);
  }).length;

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-card rounded-lg p-6 md:p-8 shadow border-accent border text-center py-12">
        <p className="text-muted-foreground animate-pulse text-sm">Loading feedback messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto bg-card rounded-lg p-6 md:p-8 shadow border-accent border text-center py-12">
        <p className="text-destructive text-sm">Error loading feedback: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-card rounded-lg p-6 md:p-8 shadow border-accent border">
      <div className="flex items-center gap-3.5 mb-6 md:mb-8 pb-4 border-b border-border/50">
        <div className="text-accent flex items-center justify-center p-1">
          <Mail size={28} className="stroke-[2]" />
        </div>
        <h2 className="text-accent text-lg font-bold tracking-tight">
          Feedback Mailbox
        </h2>
        {newCount > 0 && (
          <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold tracking-wide animate-pulse">
            {newCount} new
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {displayFeedbacks.length > 0 ? (
          displayFeedbacks.map((fback) => (
            <FeedbackItem
              key={fback.id}
              sender={fback.senderName || fback.sender || "System"}
              subject={getSubject(fback)}
              message={fback.content || fback.message}
              date={formatDate(fback.createdAt || fback.date)}
              hasIcon={fback.hasIcon ?? true}
              isNew={fback.isNew !== undefined ? fback.isNew : isNewFeedback(fback.createdAt)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Mail size={48} className="mx-auto mb-3 opacity-30 stroke-[1.5]" />
            <p className="text-sm">No new feedback messages</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;

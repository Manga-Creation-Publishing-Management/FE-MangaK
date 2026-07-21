import { useState } from 'react';
import { FileSpreadsheet, Eye, MessageSquare } from 'lucide-react';
import dayjs from 'dayjs';
import { TextFeedbackModal } from '@/pages/shared/TextFeedbackModal';
import { AnnotationModal } from '@/pages/shared/AnnotationModal';

export function FeedbackHistoryItem({ feedback, fileUrl, role }) {
  const [isTextOpen, setIsTextOpen] = useState(false);
  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);

  const type = feedback?.type || feedback?.feedbackType || "Manual";
  const content = feedback?.content || "";
  const sender = feedback?.senderName || "System Reviewer";
  const date = feedback?.createdAt || feedback?.createdDate;

  const formattedDate = dayjs(date).isValid()
    ? dayjs(date).format('DD/MM/YYYY HH:mm')
    : date || 'N/A';

  const isPDF = type === "EditPDF";

  const handleViewClick = () => {
    if (isPDF) {
      setIsAnnotationOpen(true);
    } else {
      setIsTextOpen(true);
    }
  };

  return (
    <>
      <div className="group bg-card border border-border hover:border-primary/45 hover:shadow-md transition-all duration-300 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Icon indicator */}
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
              isPDF 
                ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400' 
                : 'bg-primary/10 text-primary'
            }`}>
              {isPDF ? <FileSpreadsheet size={20} className="stroke-[2]" /> : <MessageSquare size={20} className="stroke-[2]" />}
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-semibold text-foreground text-sm md:text-base">
                {sender}
              </span>
              <span className="text-xs text-muted-foreground font-light">
                {formattedDate}
              </span>
            </div>
            
            {/* Feedback type badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                isPDF 
                  ? 'bg-rose-500/5 text-rose-500 border-rose-500/20' 
                  : 'bg-primary/5 text-primary border-primary/20'
              }`}>
                {isPDF ? "PDF Annotation" : "Text Feedback"}
              </span>
              {!isPDF && content && (
                <p className="text-muted-foreground text-xs md:text-sm truncate max-w-[200px] sm:max-w-md">
                  - {content}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* View button */}
        <button
          onClick={handleViewClick}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg text-xs md:text-sm transition-all duration-200 cursor-pointer border border-border shadow-sm"
        >
          <Eye size={14} className="stroke-[2]" />
          <span>View</span>
        </button>
      </div>

      {/* Specific Feedback Modals */}
      <TextFeedbackModal
        isOpen={isTextOpen}
        onClose={() => setIsTextOpen(false)}
        feedbackText={content}
      />

      <AnnotationModal
        isOpen={isAnnotationOpen}
        onClose={() => setIsAnnotationOpen(false)}
        fileUrl={fileUrl}
        isReadOnly={true}
        initialFeedbackJson={content}
        role={role}
      />
    </>
  );
}

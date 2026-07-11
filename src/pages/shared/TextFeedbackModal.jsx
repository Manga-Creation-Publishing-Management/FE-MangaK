import { X } from "lucide-react";

export function TextFeedbackModal({ isOpen, onClose, feedbackText }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-[95vw] md:w-[600px] max-w-[100vw] max-h-[80vh] overflow-y-auto flex flex-col items-start gap-4 relative">
        <div className="flex justify-between items-center w-full pb-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">View Annotation Feedback</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="w-full bg-muted/20 p-4 rounded-xl border border-border text-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {feedbackText || "No feedback provided."}
        </div>

        <div className="w-full flex justify-end mt-2 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm cursor-pointer text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

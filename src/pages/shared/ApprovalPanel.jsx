import { Check, X } from "lucide-react";


export function ApprovalPanel({
  feedback = "",
  onFeedbackChange,
  onApprove,
  onReject,
  isLoading = false,
}) {
  return (
    <div className="space-y-4 bg-card border-t border-border rounded-xl p-5 hover:shadow-lg">

      <p className="text-sm font-medium text-foreground">
        Feedback on Names/Chapter
        <span className="text-muted-foreground font-normal ml-2">
          (Optional for approval, Required for rejection)
        </span>
      </p>


      <textarea

        defaultValue={feedback}
        onChange={onFeedbackChange}
        rows={4}
        placeholder="Provide feedback on the series concept and draft..."
        className="
      w-full px-4 py-3 resize-none
      bg-muted rounded-lg
      border border-border
      text-foreground placeholder:text-muted-foreground
      focus:outline-none focus:ring-2 focus:ring-primary
      transition-colors
      "
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onApprove}
          disabled={isLoading}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-lg bg-success text-white font-semibold
            hover:opacity-90 active:scale-[0.98]
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <Check size={16} strokeWidth={2.5} />
          Approve Names & Submit to Editorial Board
        </button>

        <button
          type="button"
          onClick={onReject}
          disabled={isLoading}
          className="
            flex items-center gap-2
            px-5 py-2.5 rounded-lg
            bg-destructive text-destructive-foreground font-semibold
            hover:opacity-90 active:scale-[0.98]
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <X size={16} strokeWidth={2.5} />
          Reject Names & Send Feedback
        </button>
      </div>
    </div>
  );
}

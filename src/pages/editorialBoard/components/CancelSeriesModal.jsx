export function CancelSeriesModal({
  show,
  selectedSeries,
  cancelFeedback,
  onCancelFeedbackChange,
  onConfirm,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-8 w-full max-w-md">
        <h2 className="mb-4 text-xl font-semibold">Cancel Series</h2>

        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to cancel <strong>{selectedSeries?.name}</strong>? This action requires feedback.
        </p>

        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">
            Cancellation Feedback (Required)
          </label>
          <textarea
            value={cancelFeedback}
            onChange={(e) => onCancelFeedbackChange(e.target.value)}
            placeholder="Explain why this series is being cancelled..."
            className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-32 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Back
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteScheduleModal({ show, deleteSeriesName, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-8 w-full max-w-md">
        <h2 className="mb-4 text-xl font-semibold text-card-foreground">Confirm Delete</h2>

        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete the publishing schedule for <strong>{deleteSeriesName}</strong>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

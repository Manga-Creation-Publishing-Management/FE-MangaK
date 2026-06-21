export function ConfirmStatusModal({ confirmAction, onConfirm, onCancel }) {
  if (!confirmAction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-8 w-full max-w-sm">
        <h2 className="mb-4">
          {confirmAction.action === "inactive"
            ? "Deactivate Account"
            : "Activate Account"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {confirmAction.action === "inactive"
            ? `Are you sure you want to deactivate ${confirmAction.user.name}'s account? They will lose access immediately.`
            : `Restore access for ${confirmAction.user.name}? They will be able to log in again.`}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity ${
              confirmAction.action === "inactive"
                ? "bg-destructive text-destructive-foreground"
                : "bg-success text-success-foreground"
            }`}
          >
            {confirmAction.action === "inactive" ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}

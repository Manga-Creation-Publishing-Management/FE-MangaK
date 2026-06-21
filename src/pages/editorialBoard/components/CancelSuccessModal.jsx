import { CheckCircle } from "lucide-react";

export function CancelSuccessModal({ show, cancelledSeriesName, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={56} className="text-success" />
        </div>

        <h2 className="mb-2 text-xl font-semibold">Series Cancelled</h2>

        <p className="text-sm text-muted-foreground mb-6">
          <strong>{cancelledSeriesName}</strong> has been cancelled successfully.
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          OK
        </button>
      </div>
    </div>
  );
}

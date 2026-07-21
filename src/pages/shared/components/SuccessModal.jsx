import { CheckCircle } from "lucide-react";

export function SuccessModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-sm p-6 rounded-xl border border-border shadow-lg flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Updated successfully!</h3>
        <p className="text-muted-foreground mb-6">
          Your profile information has been updated successfully.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  );
}

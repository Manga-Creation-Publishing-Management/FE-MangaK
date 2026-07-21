import { useState } from "react";
import { X } from "lucide-react";

export function UnsatisfiedModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [percentage, setPercentage] = useState("70");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(percentage);
    if (isNaN(val) || val < 0 || val > 100) {
      setError("Please enter a percentage between 0 and 100.");
      return;
    }
    setError("");
    onSubmit(percentage);
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[99999] p-4"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Mark as Unsatisfied</h2>
          <p className="text-muted-foreground text-sm mt-1">
            This action will mark the task as Unsatisfied and pay the assistant a partial salary.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Salary Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 70"
              required
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-warning text-warning-foreground font-semibold cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

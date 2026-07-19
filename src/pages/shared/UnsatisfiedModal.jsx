import { useState } from "react";
import { X, Percent } from "lucide-react";

export function UnsatisfiedModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [percentage, setPercentage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(percentage);
    if (isNaN(value) || value < 0 || value > 100) {
      setError("Please enter a valid percentage between 0 and 100");
      return;
    }
    setError("");
    onSubmit(percentage);
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-sm relative flex flex-col gap-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-0"
        >
          <X size={20} />
        </button>

        <div>
          <h2 className="text-xl font-bold text-foreground">Close Task as Unsatisfied</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Specify the percentage of the salary that the assistant will receive (0% to 100%).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Salary Percentage</label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
                autoFocus
              />
              <span className="absolute right-3 text-muted-foreground">
                <Percent size={18} />
              </span>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted font-medium transition-colors cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/95 text-destructive-foreground font-semibold transition-colors cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { CustomSelect } from '@/shared/components/CustomSelect.jsx';

export function ScheduleFormModal({
  show,
  isEditing,
  editingScheduleId,
  schedules,
  selectedSeries,
  onSelectedSeriesChange,
  approvedSeries,
  frequency,
  onFrequencyChange,
  startDate,
  onStartDateChange,
  onClose,
  onConfirm,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-8 w-full max-w-2xl">
        <h2 className="mb-6 text-xl font-semibold text-card-foreground">
          {isEditing ? "Update Publishing Schedule" : "Create Publishing Schedule"}
        </h2>

        <div className="space-y-6 mb-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Select Series
            </label>
            {isEditing ? (
              <input
                type="text"
                disabled
                value={
                  schedules.find((s) => s.id === editingScheduleId)?.seriesName || ""
                }
                className="w-full px-4 py-3 bg-muted rounded-lg border border-border text-muted-foreground cursor-not-allowed focus:outline-none"
              />
            ) : (
              <CustomSelect
                value={selectedSeries}
                onChange={onSelectedSeriesChange}
                options={[
                  { value: "", label: "Choose a series..." },
                  ...approvedSeries.map((series) => ({
                    value: series.id,
                    label: `${series.name} by ${series.author}`,
                  })),
                ]}
              />
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Publication Frequency
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onFrequencyChange("Weekly")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  frequency === "Weekly" ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                <p className="font-medium text-foreground">Weekly</p>
                <p className="text-sm text-muted-foreground">
                  New chapter every week
                </p>
              </button>
              <button
                onClick={() => onFrequencyChange("Monthly")}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  frequency === "Monthly" ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                <p className="font-medium text-foreground">Monthly</p>
                <p className="text-sm text-muted-foreground">
                  New chapter every month
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-input-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <p className="text-sm text-info">
              The publishing schedule will determine when new chapters are automatically released to readers.
              Make sure the mangaka has enough chapters ready before setting the start date.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isEditing ? "Update Schedule" : "Create Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

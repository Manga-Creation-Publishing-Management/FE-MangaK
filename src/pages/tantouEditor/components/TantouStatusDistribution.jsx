import { BookOpen } from 'lucide-react';

export function TantouStatusDistribution({ statusDistribution, isLoading }) {
  
  const STATUS_LABELS = {
    processing: "Processing",
    rejected: "Rejected",
    pending: "Pending",
    approved: "Approved",
    publishing: "Publishing",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen size={30} className="text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Series Status</h3>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">Loading...</p>
        </div>
      ) : statusDistribution.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <BookOpen size={30} className="mb-3 opacity-30" />
          <p className="text-sm">No series data available</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/50 flex-1">
          <table className="w-full">
            <thead>
              <tr className="bg-background">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {statusDistribution.map((item, index) => (
                <tr
                  key={item.status}
                  className={`${index !== statusDistribution.length - 1
                    ? "border-b border-border/30"
                    : ""
                    } hover:bg-background/50 transition-colors`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3">
                    <span className="text-sm font-semibold text-foreground">{item.count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

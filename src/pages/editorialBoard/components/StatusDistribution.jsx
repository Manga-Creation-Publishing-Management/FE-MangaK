import { BookOpen } from 'lucide-react';

export function StatusDistribution({ statusDistribution }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">Series Status</h3>
      </div>

      {statusDistribution.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No series data available</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/50">
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
                      <span className="text-sm font-medium capitalize text-foreground">
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3">
                    <span className="text-sm font-semibold text-foreground">
                      {item.count}
                    </span>
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

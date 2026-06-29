import { roleLabels } from "../constants/adminConstants.js";

const roleDotColors = {
  mangaka: "bg-pink-500",
  assistant: "bg-sky-500",
  tantou: "bg-indigo-500",
  editorial: "bg-emerald-500",
  reader: "bg-purple-500",
  admin: "bg-rose-500",
};

export function RoleDistributionTable({ roleCounts, isLoading }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Role Distribution</h3>
        <p className="text-xs text-muted-foreground">Overview of users assigned to each system role.</p>
      </div>
      <div className="overflow-hidden border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-3.5 text-left font-semibold">Role Name</th>
              <th className="px-6 py-3.5 text-right font-semibold">User Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {isLoading ? (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                  Loading statistics...
                </td>
              </tr>
            ) : (
              Object.entries(roleLabels).map(([roleKey, label]) => (
                <tr key={roleKey} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${roleDotColors[roleKey] || 'bg-gray-500'}`} />
                    <span className="font-medium text-sm">{label}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold font-mono text-sm">
                    {roleCounts[roleKey] || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

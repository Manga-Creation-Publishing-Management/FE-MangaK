import { Loader2 } from 'lucide-react';
import { PaginationCustom } from "../../../features/Pagination/components/PaginationCustom";
import { getTotalPage } from "../../../features/Pagination/hooks/getTotalPage";

export function ActiveAssistantsTable({ isLoading, activeAssistants }) {
  const postsPerPageLimit = 4;
  const {
    currentPage,
    setCurrentPage,
    currentDataListDisplay,
    totalPages
  } = getTotalPage(1, postsPerPageLimit, activeAssistants || []);

  return (
    <div className="lg:col-span-8 bg-card border border-border rounded-xl p-6 space-y-4 flex flex-col justify-between h-[540px]">

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Active Assistants</h3>
          <p className="text-xs text-muted-foreground">Assistants currently active on the platform.</p>
        </div>
        <div className="overflow-hidden border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3.5 text-left font-semibold">Assistant Name</th>
                <th className="px-6 py-3.5 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-primary" size={24} />
                      <span>Loading assistants...</span>
                    </div>
                  </td>
                </tr>
              ) : (currentDataListDisplay || []).length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                    No active assistants found.
                  </td>
                </tr>
              ) : (
                currentDataListDisplay.map((assistant) => (
                  <tr key={assistant.userId} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary text-primary font-bold flex items-center justify-center text-xs">
                        {assistant.lastName ? assistant.lastName[0] : ""}{assistant.firstName ? assistant.firstName[0] : ""}
                      </div>
                      <span className="font-medium text-sm">
                        {assistant.lastName} {assistant.firstName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Active
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {!isLoading && totalPages > 1 && (
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}


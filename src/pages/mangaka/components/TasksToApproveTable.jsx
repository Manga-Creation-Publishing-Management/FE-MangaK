import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getTotalPage } from '@/features/Pagination/hooks/getTotalPage';
import { PaginationCustom } from '@/features/Pagination/components/PaginationCustom';

export function TasksToApproveTable({ isLoading, pendingTasks = [], onNavigateToTask }) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;
  const totalPages = Math.ceil(pendingTasks.length / pageSize);
  const paginatedTasks = pendingTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-4">
      <div>
        <h3 className="text-lg sm:text-lg font-bold text-foreground">Tasks to Approve</h3>
        <p className="text-xs text-muted-foreground">Tasks submitted by assistants awaiting your review.</p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-primary" size={24} />
              <span>Loading tasks...</span>
            </div>
          </div>
        ) : pendingTasks.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground text-sm">
            No pending tasks to approve.
          </div>
        ) : (
          <>
            {/* Mobile Card Layout (< 640px) */}
            <div className="sm:hidden divide-y divide-border bg-card">
              {paginatedTasks.map((task) => (
                <div key={task.id} className="p-4 flex flex-col gap-2.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-foreground break-words">
                        Chapter {task.chapterNumber} - {task.seriesTitle}
                      </div>
                      {task.taskDescription && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Page Range: {task.taskDescription}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onNavigateToTask(task.id)}
                      className="cursor-pointer shrink-0 inline-flex items-center justify-center px-3.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Review
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1.5 border-t border-border/40">
                    <span>Assistant:</span>
                    <span className="font-medium text-foreground">{task.assistantName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table Layout (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-3.5 text-left font-semibold">Task Detail</th>
                    <th className="px-6 py-3.5 text-left font-semibold">Assistant</th>
                    <th className="px-6 py-3.5 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {paginatedTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm text-foreground">
                          Chapter {task.chapterNumber} - {task.seriesTitle}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                          {task.taskDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                        {task.assistantName}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onNavigateToTask(task.id)}
                          className="cursor-pointer inline-flex items-center justify-center px-3.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

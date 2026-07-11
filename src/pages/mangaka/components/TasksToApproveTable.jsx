import { Loader2 } from 'lucide-react';

export function TasksToApproveTable({ isLoading, pendingTasks, onNavigateToTask }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Tasks to Approve</h3>
        <p className="text-xs text-muted-foreground">Tasks submitted by assistants awaiting your review.</p>
      </div>
      <div className="overflow-hidden border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-3.5 text-left font-semibold">Task Detail</th>
              <th className="px-6 py-3.5 text-left font-semibold">Assistant</th>
              <th className="px-6 py-3.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={24} />
                    <span>Loading tasks...</span>
                  </div>
                </td>
              </tr>
            ) : pendingTasks.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  No pending tasks to approve.
                </td>
              </tr>
            ) : (
              pendingTasks.map((task) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from "react";
import { CalendarClock, JapaneseYen } from "lucide-react";
import { useTaskListByAssistant } from "../../features/tasks/hooks/useTaskListByAssistant";
import { StatusBadge } from "@/shared/components/StatusBadge";
import dayjs from "dayjs";
import { useTaskList } from "../../features/tasks/hooks/useTaskList";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";
import { getTotalPage } from "../../features/Pagination/hooks/getTotalPage";
import { PaginationCustom } from "../../features/Pagination/components/PaginationCustom";

export function MyTask({ isDashboardView = false }) {
  const userString = localStorage.getItem('user');
  const currentUser = JSON.parse(userString);
  const assistantId = currentUser.id;
  const role = currentUser.role;

  const { handleNavigateToTask } = useTaskList();
  const { taskListByAssistant } = useTaskListByAssistant(assistantId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTasks = (taskListByAssistant || []).filter(item => {
    const matchesSearch =
      (item.seriesTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.chapterNumber || "").includes(searchQuery);

    const matchesStatus =
      filterStatus === "all" ||
      item.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const postsPerPageLimit = 4;
  const {
    currentPage,
    setCurrentPage,
    currentDataListDisplay,
    totalPages
  } = getTotalPage(1, postsPerPageLimit, filteredTasks);

  const searchFilterEl = (
    <div className="flex-1 max-w-xl">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by series, chapter..."
        useCardWrapper={false}
        filters={[
          {
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "revising", label: "Revising" },
              { value: "completed", label: "Completed" }
            ]
          }
        ]}
      />
    </div>
  );

  const tasksListEl = (currentDataListDisplay || []).length === 0 ? (
    <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/10">
      <p className="text-muted-foreground text-sm">No tasks found.</p>
    </div>
  ) : (
    <div className="space-y-4">
      {currentDataListDisplay.map(item => (
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow" key={item.id}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-card-foreground truncate text-xl">
                Chapter {item.chapterNumber} - {item.seriesTitle}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{item.seriesTitle}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-2xl font-semibold text-success flex items-center gap-0.5">
                <JapaneseYen size={23} strokeWidth={2.5} className="shrink-0 translate-y-[2px]" />
                <span>{item.incomeAmount.toLocaleString('en-US')}</span>
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 mt-2.5 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-sm text-destructive font-medium shrink-0 pb-0.5">
              <CalendarClock size={16} />
              <span>Deadline: {dayjs(item.deadline).format('DD/MM/YYYY HH:mm')}</span>
            </div>

            <div className="flex items-center gap-4 text-sm shrink-0">
              <StatusBadge status={item.status?.toLowerCase()} />
              <button
                className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                onClick={() => handleNavigateToTask(role.toLowerCase(), item.id)}
              >
                View Detail
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const paginationEl = totalPages > 1 && (
    <PaginationCustom
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  );

  if (isDashboardView) {
    return (
      <div className="space-y-6">
        {searchFilterEl}
        {tasksListEl}
        {paginationEl}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-background min-h-full animate-in fade-in duration-300">

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {searchFilterEl}
        {tasksListEl}
        {paginationEl}
      </div>
    </div>
  );
}

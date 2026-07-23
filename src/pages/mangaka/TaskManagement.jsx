import { useState } from "react";
import { CalendarClock, Plus, Loader2 } from "lucide-react";
import { useCreateTask } from "../../features/tasks/hooks/useCreateTask";
import CreateTaskModal from "../../features/tasks/components/CreateTaskModal";
import { useTaskList } from "../../features/tasks/hooks/useTaskList";
import { StatusBadge } from "@/shared/components/StatusBadge";
import dayjs from 'dayjs';
import { useParams } from "react-router";
// import { useSeriesManagement } from "../../series/hooks/useSeriesManagement";
import utc from 'dayjs/plugin/utc';
import { getTotalPage } from "../../features/Pagination/hooks/getTotalPage";
import { PaginationCustom } from "../../features/Pagination/components/PaginationCustom";
import { SearchFilterBar } from "@/shared/components/SearchFilterBar";
dayjs.extend(utc);
export function TaskManagement() {

  const userString = localStorage.getItem('user');
  const currentUser = JSON.parse(userString);
  const role = currentUser.role;


  const {
    handleShowCreateTaskModal,
    showCreateTaskModal,
    showAssistantList,
    showSeriesApproval,
    chapters,
    selectedSeriesId,
    setSelectedSeriesId,
    selectedChapterId,
    setSelectedChapterId,
    maxPagesAllowed,
    handleSubmitCreateTask,
    handleReload,
    isLoading,
    reload
  } = useCreateTask();

  const {
    taskList,
    handleNavigateToTask,
    isLoadingList
  } = useTaskList(reload);

  console.log("chapet", taskList);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTasks = (taskList || []).filter(item => {
    const matchesSearch =
      (item.seriesTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.assistantName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.chapterNumber || "").includes(searchQuery);

    const matchesStatus =
      filterStatus === "all" ||
      item.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const {
    currentPage,
    postsPerPage,
    setCurrentPage,
    currentDataListDisplay,
    totalPages
  } = getTotalPage(1, 4, filteredTasks);

  return (
    <>
      <div className="p-6 space-y-8">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1 w-full max-w-xl">
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by series, assistant, chapter..."
                useCardWrapper={false}
                filters={[
                  {
                    value: filterStatus,
                    onChange: setFilterStatus,
                    options: [
                      { value: "all", label: "All Status" },
                      { value: "available", label: "Available" },
                      { value: "rejected", label: "Rejected" },
                      { value: "pending", label: "Pending" },
                      { value: "processing", label: "Processing" },
                      { value: "completed", label: "Completed" },
                      { value: "revising", label: "Revising" },
                      { value: "unsatisfied", label: "Unsatisfied" }
                    ]
                  }
                ]}
              />
            </div>
            <button
              onClick={handleShowCreateTaskModal}
              className="cursor-pointer border-2 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shrink-0 w-full sm:w-auto"
            >
              <Plus size={20} />
              Create New Task
            </button>
          </div>
          <div className="space-y-6">
            {isLoadingList ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm font-medium">Loading tasks...</span>
              </div>
            ) : currentDataListDisplay?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No tasks found.
              </div>
            ) : (
              currentDataListDisplay?.map(item => (
                <div key={item.id} className="task-card p-4 sm:p-6 transition-shadow animate-in fade-in duration-200">
                  {/* Phần trên: Tiêu đề bên trái, Trạng thái & Nút bấm bên phải */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground truncate sm:text-xl font-semibold">Chapter {item.chapterNumber} - {item.seriesTitle}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Page Range: {item.taskDescription}</p>
                    </div>

                    {/* Cụm Status và Button bên phải */}
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      <StatusBadge status={item.status?.toLowerCase()} />

                      <button
                        className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium w-full sm:w-auto"
                        onClick={() => handleNavigateToTask(role.toLowerCase(), item.id)}
                      >
                        View Detail
                      </button>
                    </div>
                  </div>

                  {/* Phần dưới: Đường phân cách + Assigned (Trái) và Deadline (Phải) */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-3 border-t border-border/50">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Assigned to: <span className="font-medium text-foreground">{item.assistantName}</span>
                    </span>

                    {/* Deadline được đẩy hẳn sang bên phải */}
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-destructive font-medium shrink-0">
                      <CalendarClock size={16} />
                      <span>Deadline: {dayjs(item.deadline).utc(true).format('DD/MM/YYYY HH:mm')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>



          <PaginationCustom
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div >
      {
        showCreateTaskModal &&
        <CreateTaskModal
          onClose={handleShowCreateTaskModal}
          showSeriesApproval={showSeriesApproval}
          showAssistantList={showAssistantList}
          chapters={chapters}
          selectedSeriesId={selectedSeriesId}
          onSeriesChange={setSelectedSeriesId}
          selectedChapterId={selectedChapterId}
          onChapterChange={setSelectedChapterId}
          maxPagesAllowed={maxPagesAllowed}
          isLoading={isLoading}
          onSubmitCreateTask={handleSubmitCreateTask}
          onReload={handleReload}
        />
      }
      {/* {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)} */}


    </>
  )
}
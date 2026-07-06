import { CalendarClock, Plus } from "lucide-react";
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
    handleSubmitCreateTask,
    handleReload,
    reload
  } = useCreateTask();

  const {
    taskList,
    handleNavigateToTask
  } = useTaskList(reload);

  console.log("chapet", taskList);

  const {
      currentPage,
      postsPerPage,
      setCurrentPage,
      currentDataListDisplay,
      totalPages
  } = getTotalPage(1, 4, taskList);

  return (
    <>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sidebar-foreground font-medium text-2xl pb-1">Task Management</h1>
            <p className="text-muted-foreground">Assign tasks to assistants </p>
          </div>
          <button
            onClick={handleShowCreateTaskModal}
            className="cursor-pointer border-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Create New Task
          </button>
        </div>
        {currentDataListDisplay?.map(item => (

          <div className="space-y-4 mb-5">
            {/* {tasks.map((task) => ( */}
            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              {/* Phần trên: Tiêu đề bên trái, Trạng thái & Nút bấm bên phải */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground truncate text-xl font-semibold">Chapter {item.chapterNumber} - {item.seriesTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Page Range: {item.taskDescription}</p>
                </div>

                {/* Cụm Status và Button bên phải (Đồng bộ từ bên Chapter qua) */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* <StatusBadge status={task.status} /> */}
                  <span>
                    <StatusBadge status={item.status?.toLowerCase()} />
                  </span>

                  <button
                    className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    onClick={() => handleNavigateToTask(role.toLowerCase(), item.id)}
                  >
                    View Detail
                  </button>
                </div>
              </div>

              {/* Phần dưới: Đường phân cách + Assigned (Trái) và Deadline (Phải) */}
              <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  Assigned to: <span className="font-medium text-foreground">{item.assistantName}</span>
                </span>

                {/* Deadline được đẩy hẳn sang bên phải */}
                <div className="flex items-center gap-1.5 text-sm text-destructive font-medium shrink-0">
                  <CalendarClock size={16} />
                  <span>Deadline: {dayjs(item.deadline).utc(true).format('DD/MM/YYYY HH:mm')}</span>
                </div>
              </div>
            </div>
            {/* ))} */}
          </div>
        ))}

        <PaginationCustom
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />

      </div>
      {
        showCreateTaskModal &&
        <CreateTaskModal
          onClose={handleShowCreateTaskModal}
          showSeriesApproval={showSeriesApproval}
          showAssistantList={showAssistantList}
          chapters={chapters}
          selectedSeriesId={selectedSeriesId}
          onSeriesChange={setSelectedSeriesId}
          onSubmitCreateTask={handleSubmitCreateTask}
          onReload={handleReload}
        />
      }
      {/* {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)} */}


    </>
  )
}
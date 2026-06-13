import { CalendarClock, Plus } from "lucide-react";
import { useCreateTask } from "../../features/tasks/hooks/useCreateTask";
import CreateTaskModal from "../../features/tasks/components/CreateTaskModal";
import { useTaskList } from "../../features/tasks/hooks/useTaskList";
import { StatusBadge } from "../shared/StatusBadge";
import dayjs from 'dayjs';

export function TaskManagement() {

  const {
    handleShowCreateTaskModal,
    showCreateTaskModal,
    showAssistantList,
    showSeriesApproval,
    chapters,
    selectedSeriesId,
    setSelectedSeriesId,
    handleSubmitCreateTask
  } = useCreateTask();

  const {
    taskList
  } = useTaskList();

  console.log( "chapet",taskList.chapterNumber);

  return (
    <>
      <div className="p-9">
        <div className="flex justify-between items-center mb-6">
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
        {taskList?.map(item => (
          <div className="space-y-4 mb-5">
            {/* {tasks.map((task) => ( */}
            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              {/* Phần trên: Tiêu đề bên trái, Trạng thái & Nút bấm bên phải */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground truncate text-xl font-semibold">Task - Chapter {item.chapterNumber}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Chapter {item.chapterNumber} • Page Range: {item.taskDescription}</p>
                </div>

                {/* Cụm Status và Button bên phải (Đồng bộ từ bên Chapter qua) */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* <StatusBadge status={task.status} /> */}
                  <span className="text-sm font-medium text-muted-foreground">
                    <StatusBadge status={item.status.toLowerCase()} />
                  </span>

                  <button
                    className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    onClick={() => handleNavigateToTask(task.id)}
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
                  <span>Deadline: {dayjs(item.deadline).format('DD/MM/YYYY HH:mm')}</span>
                </div>
              </div>
            </div>
            {/* ))} */}
          </div>
        ))}

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
        />
      }
      {/* {showCreateSeriesModal && (<CreateSeriesModal onClose={handleClick} onReload={handleReload} />)} */}


    </>
  )
}
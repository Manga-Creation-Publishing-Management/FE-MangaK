import { BadgeDollarSign, Banknote, Bitcoin, CalendarClock, DollarSign, JapaneseYen } from "lucide-react";
import { useTaskListByAssistant } from "../../features/tasks/hooks/useTaskListByAssistant";
import { StatusBadge } from "@/shared/components/StatusBadge";
import dayjs from "dayjs";
import { useTaskList } from "../../features/tasks/hooks/useTaskList";

export function MyTask() {
  const userString = localStorage.getItem('user');
  const currentUser = JSON.parse(userString);
  const assistantId = currentUser.id;
  const role = currentUser.role;
  // console.log(assistantId);

  const { handleNavigateToTask } = useTaskList();
  const { taskListByAssistant } = useTaskListByAssistant(assistantId);


  console.log(taskListByAssistant)
  return (
    <>
      {
        taskListByAssistant?.length === 0 &&
        <>
          <div className="text-center text-3xl">
            Not Assigned Tasks.
          </div>

        </>

      }
      <div className="p-9 pb-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-sidebar-foreground font-medium text-2xl pb-1">My Tasks</h1>
            <p className="text-muted-foreground">Assigned Task By Mangaka</p>
          </div>
        </div>
      </div>
      <div className="p-9">
        {taskListByAssistant?.map(item => (
          <div className="space-y-4 mb-3" key={item.id}>
            {/* {tasks.map((task) => ( */}
            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-card-foreground truncate text-xl font-semibold">Chapter {item.chapterNumber} - {item.seriesTitle}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.seriesTitle} </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 mt-0.1">

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
                  <StatusBadge status={item.status} />
                  <button
                    className="cursor-pointer block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    onClick={() => handleNavigateToTask(role.toLowerCase(), item.id)}
                  >
                    View Detail
                  </button>
                </div>

              </div>
            </div>
            {/* ))} */}
          </div>
        ))}

      </div>
    </>
  )
}
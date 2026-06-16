import { ArrowLeft, Calendar, DollarSign, Download, FileText, JapaneseYen, UploadCloud } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useTaskDetail } from "../../features/tasks/hooks/useTaskDetail";
import { StatusBadge } from "../shared/StatusBadge";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export function TaskDetail() {


  const navigate = useNavigate();
  const taskId = useLocation().state?.taskId;
  const role = useLocation().state?.role;

  console.log("ss", taskId);

  const {
    taskDetail,
    storyFile,
    storyInputRef,
    handleStoryChange,
    handleGetTask,
    isLoading

  } = useTaskDetail(taskId);

  console.log("sss", taskDetail);

  return (
    <>
      <div className="p-8 space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-card border border-border rounded-xl p-8 space-y-6">

          <div className="flex justify-between items-start border-b border-border pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-2xl font-semibold mb-3">
                Chapter {taskDetail?.chapterNumber}: {taskDetail?.chapterTitle}
              </div>
              <p className="text-muted-foreground text-l flex items-center gap-1 mt-2">
                <FileText size={16} />
                Page Range: <span className="text-foreground font-medium">{taskDetail?.taskDescription}</span>
              </p>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span className="mb-6" >
                <StatusBadge status={taskDetail?.status} />
              </span>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md border border-border">
                <Calendar size={14} className="text-destructive" />
                <span>Deadline: <strong className="text-foreground">
                  {dayjs(taskDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm')}
                </strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Task Description</h3>
              <div className="bg-muted/30 p-4 rounded-lg border border-border min-h-[100px] text-foreground text-sm leading-relaxed">
                {taskDetail?.taskTitle}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Income Amount</h3>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-center gap-3 h-[100px]">
                <div className="p-3 bg-emerald-500 rounded-lg text-white">
                  <JapaneseYen size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {taskDetail?.incomeAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">Original Manuscript</h3>
              <div className="border border-dashed border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center space-y-3 h-[160px]">
                <p className="text-xs text-muted-foreground">Download the initial manuscript file to start working</p>
                <a
                  href={taskDetail?.manuscriptFileUrl}
                  download
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                >
                  <Download size={16} />
                  Download Manuscript
                </a>
              </div>
            </div>
            <div className="space-y-3">
              {role === "assistant" &&
                <>
                  <h3 className="font-medium text-sm text-muted-foreground">Submit Your Work</h3>
                  <div
                    onClick={() => storyInputRef.current.click()}
                    name="nameFile"
                    className="border border-dashed border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center h-[160px] hover:border-primary transition-colors cursor-pointer"
                  >
                    {storyFile ? (
                      <div className="text-primary font-medium">
                        Selected: {storyFile.name}
                      </div>
                    ) : (
                      <>
                        <p className="text-muted-foreground">Click to upload file</p>
                        <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.zip"
                      className="hidden"
                      ref={storyInputRef}
                      onChange={handleStoryChange}
                    />
                  </div>
                </>
              }

              {role === "mangaka" &&
                <>
                <h3 className="font-medium text-sm text-muted-foreground">Submited File by Assistant</h3>
                <div className="border border-dashed border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center space-y-3 h-[160px]">
                  <p className="text-xs text-muted-foreground">Download the submitted file to review</p>
                  <a
                    href={taskDetail?.submittedFileUrl}
                    download
                    className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-10 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                  >
                    <Download size={16} />
                    Download File
                  </a>
                </div>
                </>
              }

            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">

            {(role === "assistant") &&
              <>
                {taskDetail?.status == "Available" &&
                  <button
                    onClick={handleGetTask}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-50">
                    Get Task
                  </button>
                }
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-50">
                  Submit Task
                </button>
              </>
            }

            {role === "mangaka" &&
              <>
                <button className="bg-destructive hover:bg-destructive/70 text-white font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-50">

                  Reject & Feedback
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-50">
                  Approve
                </button>
              </>
            }
          </div>

        </div>
      </div>
    </>
  )
}
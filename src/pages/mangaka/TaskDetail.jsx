import { ArrowLeft, Calendar, DollarSign, Download, FileText, JapaneseYen, UploadCloud } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useTaskDetail } from "../../features/tasks/hooks/useTaskDetail";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ApprovalPanel } from "@/pages/shared/ApprovalPanel";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AnnotationModal } from "../shared/AnnotationModal";
import { useState } from "react";
dayjs.extend(utc);
export function TaskDetail() {

  const navigate = useNavigate();
  const taskId = useLocation().state?.taskId;
  const role = useLocation().state?.role;
  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);

  console.log("ss", taskId);

  const {
    taskDetail,
    storyFile,
    storyInputRef,
    handleStoryChange,
    handleGetTask,
    isLoading,
    feedback,
    setFeedback,
    handleSubmitTask,
    handleRejectTask,
    handleApprovedTask
  } = useTaskDetail(taskId, role);

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
                <StatusBadge status={taskDetail?.status?.toLowerCase()} />
              </span>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md border border-border">
                <Calendar size={14} className="text-destructive" />
                <span>Deadline: <strong className="text-foreground">
                  {dayjs(taskDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm')}
                </strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Task Description</h3>
              <div className="bg-muted/30 p-4 rounded-lg border border-border min-h-[100px] text-foreground text-sm leading-relaxed max-h-20 overflow-y-auto">
                {taskDetail?.taskTitle}
              </div>
            </div>

            <div className=" md:col-span-3 space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase">Original Manuscript</h3>
              <div className="border  border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center space-y-2 h-[100px]">
                {/* <p className="text-xs text-muted-foreground">Download the initial manuscript file to start working</p> */}
                <a
                  href={taskDetail?.manuscriptFileUrl}
                  download
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80  py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Income Amount</h3>
              <div className="bg-muted/30 p-4 rounded-lg border border-border p-4 rounded-lg flex items-center gap-3 h-[100px] justify-center ">
                <span className="text-4xl font-semibold text-success flex items-center gap-0.5">
                  <JapaneseYen size={28} strokeWidth={2.5} className="shrink-0 translate-y-[2px]" />
                  <span>{taskDetail?.incomeAmount}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1  md:grid-cols-1 gap-6 pt-4 border-t border-border">


            <div className="space-y-3 w-full">
              {(role === "assistant" && taskDetail?.status != "Available") &&
                <>
                  <h3 className="font-medium text-sm text-muted-foreground">Submit Your Work</h3>
                  <div
                    onClick={() => storyInputRef.current.click()}
                    name="nameFile"
                    className="w-full border border-dashed border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center h-[160px] hover:border-primary transition-colors cursor-pointer"
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
              {/* PHẦN DƯỚI NÀY ĐỂ CHÈN PDF NÈ
                        PHẦN DƯỚI NÀY ĐỂ CHÈN PDF NÈ
                        PHẦN DƯỚI NÀY ĐỂ CHÈN PDF NÈ */}
              {role === "mangaka" &&
                <>
                  <h3 className="font-medium text-sm text-muted-foreground">Submited File by Assistant</h3>
                  <div className="w-full border border-dashed border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center space-y-3 h-[160px] ">
                    {taskDetail?.submittedFileUrl ? (
                      <>
                        <p className="text-xs text-muted-foreground">Download the submitted file to review</p>
                        <a
                          href={taskDetail?.submittedFileUrl}
                          download
                          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-10 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                        >
                          <Download size={16} />
                          Download File
                        </a>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-semibold text-muted-foreground">No file has been submitted by the assistant yet.</p>
                      </>
                    )}

                    {/* NHÃ THÊM CÁI NÚT ANNOTATE CHO MANGAKA NÀY */}
                    {taskDetail?.status === "Pending" &&
                      <button
                        onClick={() => setIsAnnotationOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm w-[240px]"
                      >
                        View and Annotate
                      </button>}
                    <AnnotationModal
                      isOpen={isAnnotationOpen}
                      onClose={() => setIsAnnotationOpen(false)}
                      fileUrl={taskDetail?.submittedFileUrl}
                      taskId={taskId}
                      role={role}
                    />
                  </div>

                </>
              }
              {/* KẾT THÚC PHẦN CHÈN
                    KẾT THÚC PHẦN CHÈN
                    KẾT THÚC PHẦN CHÈN
                    KẾT THÚC PHẦN CHÈN */}

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
                {taskDetail?.status != ("Available" || "Completed") &&
                  <button
                    onClick={handleSubmitTask}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-50 disabled:cursor-not-allowed">
                    {isLoading ? "Submitting..." : "Submit Task"}
                  </button>
                }


              </>
            }


          </div>
          {(role === "mangaka" && taskDetail?.status != "Completed") &&
            <>
              {/* NHÃ SỬA CÁI APPROVAL */}
              <ApprovalPanel
                feedback={feedback}
                onFeedbackChange={(e) => setFeedback(e.target.value)}
                onApprove={() => handleApprovedTask(taskId)}
                onReject={() => handleRejectTask(taskId, role)}
                isLoading={isLoading}
                approveText="Approve Task"
                rejectText="Reject Task with Feedback"
              />


              {/* PHẦN CŨ CỦA CHƯN */}
              {/* <button
                  onClick={handleRejectTask}
                  className="bg-destructive hover:bg-destructive/70 text-white font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-50">
                  Reject & Feedback
                </button>
                <button
                  onClick={handleApprovedTask}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-50">
                  Approve Task
                </button> */}
            </>
          }
        </div>

      </div>
    </>
  )

}
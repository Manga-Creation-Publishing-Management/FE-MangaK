import { ArrowLeft, Calendar, DollarSign, Download, FileText, JapaneseYen, SquarePen, UploadCloud, ChevronDown, Loader2, X, Check } from "lucide-react";
import { FeedbackHistoryList } from "../../shared/components/FeedbackHistoryList";
import { Navigate, useLocation, useNavigate, useOutletContext } from "react-router";
import { useTaskDetail } from "../../features/tasks/hooks/useTaskDetail";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ApprovalPanel } from "@/pages/shared/ApprovalPanel";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AnnotationModal } from "../shared/AnnotationModal";
import { ConfirmRejectModal } from "../shared/ConfirmRejectModal";
import { PreviewModal } from "../shared/PreviewModal";
import { UnsatisfiedModal } from "../shared/UnsatisfiedModal";
import { useState, useRef, useEffect } from "react";
import { FeedbackViewer } from "../shared/FeedbackViewer";
import { useToast } from "@/shared/hooks/useToast";
import { useUpdateTaskDeadline } from "../../features/tasks/hooks/useUpdateTaskDeadline";

import { useUpdateTaskAssistant } from "../../features/tasks/hooks/useUpdateTaskAssistant";
dayjs.extend(utc);
export function TaskDetail() {

  const navigate = useNavigate();
  const { showAlert } = useToast();
  const { setBreadcrumbItems } = useOutletContext();
  const taskId = useLocation().state?.taskId;
  const role = useLocation().state?.role;

  console.log("ss", taskId);

  const {
    taskDetail,
    storyFile,
    storyInputRef,
    handleStoryChange,
    isLoading,
    feedback,
    setFeedback,
    handleSubmitTask,
    handleRejectTask,
    handleApprovedTask,
    handleDenyTask,
    handleGetTask,
    handleUnsatisfiedTask,
    handleReload
  } = useTaskDetail(taskId, role);

  const {
    isEditingDeadline,
    deadlineValue,
    setDeadlineValue,
    isUpdating,
    handleStartEditDeadline,
    handleCancelEditDeadline,
    handleSaveDeadline
  } = useUpdateTaskDeadline(taskId, taskDetail?.deadline, (newDeadline) => {
    // Cập nhật trực tiếp trường deadline trong object taskDetail mà không gọi lại API reload
    if (taskDetail) {
      taskDetail.deadline = newDeadline;
    }
  });

  console.log("sss", taskDetail);

  //các state quản lí hiển thị pop-up
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUnsatisfiedModalOpen, setIsUnsatisfiedModalOpen] = useState(false);

  const feedbackViewerRef = useRef(null);

  const handleViewFeedbackClick = () => {
    feedbackViewerRef.current?.viewFeedback();
  };

  const handleInitialRejectClick = () => {
    setConfirmModalOpen(true);
  }

  const today = dayjs().utc(true);
  const deadlineObj = dayjs(taskDetail?.deadline).utc(true);
  const foramttedDeadline = dayjs(taskDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm')

  const isOverdue = deadlineObj.isBefore(today)

  const rolePrefix = role?.toLowerCase() || "mangaka";
  const taskLabel = taskDetail?.chapterNumber
    ? `Chapter ${taskDetail.chapterNumber}${taskDetail.chapterTitle ? `: ${taskDetail.chapterTitle}` : ''}`
    : "Task Detail";

  const customBreadcrumb = [
    { label: rolePrefix.charAt(0).toUpperCase() + rolePrefix.slice(1), path: `/${rolePrefix}` },
    { label: rolePrefix === 'assistant' ? "My Tasks" : "Task Management", path: `/${rolePrefix}/tasks` },
    { label: taskLabel }
  ];

  useEffect(() => {
    setBreadcrumbItems(customBreadcrumb);
    return () => setBreadcrumbItems(null);
  }, [taskDetail?.chapterNumber, taskDetail?.chapterTitle, rolePrefix]);

  const {
    isEditingTaskAssistant,
    isUpdatingTaskAssistant,
    taskAssistantList,
    selectedTaskAssistantId,
    setSelectedTaskAssistantId,
    handleStartEditTaskAssistant,
    handleSaveTaskAssistant,
    handleCancelEditTaskAssistant
  } = useUpdateTaskAssistant(
    taskId,
    taskDetail?.assignedToId || taskDetail?.assistantId,
    taskDetail?.assistantName,
    (newAssistantId, newAssistantName) => {
      // Gọi hàm handleReload để fetch lại API
      handleReload();
    }
  );


  return (
    <>
      <div className="p-6 space-y-6">

        <div className="bg-card border border-border rounded-xl p-8 space-y-6">

          <div className="flex justify-between items-start border-b border-border pb-6">
            <div className="space-y-1">
              <div className="flex items-center text-2xl font-semibold mb-1 text-card-foreground">
                Chapter {taskDetail?.chapterNumber}: {taskDetail?.chapterTitle}
              </div>
              <p className="text-muted-foreground text-l flex items-center gap-1 mt-2">
                <span>{taskDetail?.seriesTitle}</span>
              </p>
              <p className="text-muted-foreground text-l flex items-center gap-1 mt-2">
                <FileText size={16} />
                Page Range: <span className="text-foreground font-medium">{taskDetail?.taskDescription}</span>
              </p>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <span className="flex items-center mb-6" >
                <span>
                  <StatusBadge status={taskDetail?.status?.toLowerCase()} />
                </span>

              </span>

              {/* <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md border border-border">
                <Calendar size={14} className="text-destructive" />
                <span>Deadline: <strong className="text-foreground">
                  {dayjs(taskDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm')}
                </strong></span>
                <span className="cursor-pointer hover:bg-secondary/50 rounded-xl p-2">

                  <SquarePen
                    size={20}
                  />
                </span>
              </div> */}
              <div className="flex flex-col justify-center space-y-2 items-end">
                {/* <p className="text-xs text-muted-foreground">Download the initial manuscript file to start working</p> */}
                <h3 className="font-medium text-sm text-muted-foreground uppercase">Original Manuscript</h3>

                <span className="items-center">
                  <a
                    href={taskDetail?.manuscriptFileUrl}
                    download
                    className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80  py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </span>

              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1. Task Description */}
            <div className="md:col-span-6">
              <div className="bg-muted/30 p-4 rounded-lg border border-border min-h-[200px] text-foreground text-sm leading-relaxed max-h-20 overflow-y-auto">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Task Description
                </h3>
                <div>{taskDetail?.taskTitle}</div>
              </div>
            </div>

            {/* 2. Cột giữa */}
            <div className="md:col-span-3 flex flex-col gap-2 min-h-[200px] h-auto">
              {/* Ô 2: Assistant in Charge */}
              <div className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col justify-start min-h-[96px]">
                <div className="flex flex-row justify-between items-center w-full">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3 items-center flex gap-2">
                    Assistant in charge
                  </h3>
                  {role === "mangaka" && (
                    taskDetail?.status === "Available" ||
                    taskDetail?.status === "Rejected" ||
                    taskDetail?.status === "Revising" ||
                    taskDetail?.status === "Unsatisfied"
                  ) && (
                      isEditingTaskAssistant ? (
                        <div className="flex items-center gap-1 -mt-[10px] -mr-2">
                          <button
                            onClick={handleCancelEditTaskAssistant}
                            disabled={isUpdatingTaskAssistant}
                            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground p-1 rounded cursor-pointer transition-colors disabled:opacity-50"
                          >
                            <X size={14} />
                          </button>
                          <button
                            onClick={handleSaveTaskAssistant}
                            disabled={isUpdatingTaskAssistant}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground p-1 rounded cursor-pointer transition-colors disabled:opacity-50"
                          >
                            {isUpdatingTaskAssistant ? "..." : <Check size={14} />}
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={handleStartEditTaskAssistant}
                          className="cursor-pointer hover:bg-secondary/50 rounded-xl p-2 inline-flex items-center justify-center text-muted-foreground -mt-[10px] -mr-2"
                        >
                          <SquarePen size={13} />
                        </span>
                      )
                    )}
                </div>

                {isEditingTaskAssistant ? (
                  <div className="w-full mt-1">
                    <select
                      value={selectedTaskAssistantId} // BIẾN MỚI
                      onChange={(e) => setSelectedTaskAssistantId(e.target.value)} // Cập nhật state cục bộ thay vì gọi API ngay
                      disabled={isUpdatingTaskAssistant} // BIẾN MỚI
                      className="bg-card text-foreground border border-border rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full cursor-pointer h-[26px]"
                    >
                      <option value="">Select assistant...</option>
                      {taskAssistantList.map((as) => ( // MAP TỪ LIST MỚI
                        <option key={as.userId} value={as.userId}>
                          {as.firstName + " " + as.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-l font-semibold text-muted-foreground flex items-center">
                    {taskDetail?.assistantName || "Unassigned"}
                  </span>
                )}
              </div>
              {/* Ô 1: Income Amount */}
              <div className="bg-muted/30 p-4 rounded-lg border border-border min-h-[96px] flex flex-col justify-start">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Income Amount
                </h3>
                <span className="text-l font-semibold text-success flex items-center gap-0.5 mt-1">
                  <JapaneseYen size={20} strokeWidth={2.5} className="shrink-0 translate-y-[2px]" />
                  <span>{taskDetail?.incomeAmount}</span>
                </span>
              </div>


            </div>

            {/* 3. Cột phải */}
            <div className="md:col-span-3 flex flex-col gap-2 min-h-[200px] h-auto">
              {/* Ô 3: Deadline */}
              <div className="border border-border rounded-xl p-4 bg-muted/20 flex flex-col justify-start min-h-[96px]">
                <div className="flex flex-row justify-between items-center w-full">
                  {/* Thẻ h3 giữ nguyên mb-3 để đẩy chiều cao header chuẩn như mẫu */}
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3 items-center flex gap-2">
                    deadline {isOverdue && <span className="text-destructive font-bold text-[10px]">(Overdue)</span>}
                  </h3>

                  {(role === "mangaka" && taskDetail?.status != "processing") && (
                    isEditingDeadline ? (
                      <div className="flex items-center gap-1 -mt-[10px] -mr-2">
                        <button
                          onClick={handleCancelEditDeadline}
                          disabled={isUpdating}
                          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground p-1 rounded cursor-pointer transition-colors disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={handleSaveDeadline}
                          disabled={isUpdating}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground p-1 rounded cursor-pointer transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "..." : <Check size={14} />}
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={handleStartEditDeadline}
                        className="cursor-pointer hover:bg-secondary/50 rounded-xl p-2 inline-flex items-center justify-center text-muted-foreground -mt-[10px] -mr-2"
                      >
                        <SquarePen size={13} />
                      </span>
                    )
                  )}
                </div>

                {/* PHẦN HIỂN THỊ INPUT / TEXT PHÍA DƯỚI GIỮ NGUYÊN */}
                {isEditingDeadline ? (
                  <div className="w-full mt-1">
                    <input
                      type="datetime-local"
                      value={dayjs(deadlineValue).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) => setDeadlineValue(e.target.value)}
                      disabled={isUpdating}
                      className="bg-background border border-border rounded px-2 py-0.5  text-sm focus:outline-none focus:border-primary w-full text-foreground"
                    />
                  </div>
                ) : (
                  <span className="text-l text-muted-foreground flex items-center font-semibold">
                    {taskDetail?.deadline
                      ? dayjs(taskDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm')
                      : "— — — —"}
                  </span>
                )}
              </div>

              {/* Ô 4: Submitted At */}
              <div className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col justify-start min-h-[96px]">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                  Submitted At
                </h3>
                {taskDetail?.submittedAt ? (
                  <div className="text-l text-muted-foreground flex items-center font-semibold">{dayjs(taskDetail?.submittedAt).utc(true).format('DD/MM/YYYY HH:mm')}</div>
                ) : (
                  <div className="text-l text-muted-foreground flex items-center">— — — —</div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1  md:grid-cols-1 gap-6 pt-4 border-t border-border">


            <div className="space-y-3 w-full">
              {(role === "assistant" && (taskDetail?.status == "Processing" || taskDetail?.status == "Revising")) &&
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

              {role === "mangaka" && (taskDetail?.status == "Processing" || taskDetail?.status == "Pending" || taskDetail?.status == "Completed" || taskDetail?.status == "Unsatisfied") &&
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
                        onClick={() => setIsPreviewOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                      >
                        Preview Submission
                      </button>}

                  </div>

                </>
              }

            </div>

          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border">

            {(role === "assistant") &&
              <>
                {taskDetail?.status == "Available" &&
                  <>
                    <button
                      onClick={handleDenyTask}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-full sm:w-auto">
                      Reject
                    </button>
                    <button
                      onClick={handleGetTask}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-full sm:w-auto">
                      Get
                    </button>
                  </>

                }
                {(taskDetail?.status === "Processing" || taskDetail?.status === "Revising") &&
                  <button
                    onClick={handleSubmitTask}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-full sm:w-auto disabled:cursor-not-allowed">
                    {isLoading ? "Submitting..." : "Submit Task"}
                  </button>
                }

                {(taskDetail?.status === "Revising" || taskDetail?.status === "Unsatisfied") && (
                  <button
                    onClick={handleViewFeedbackClick}
                    className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-full sm:w-auto">
                    View Feedback
                  </button>
                )}


              </>
            }

            {role === "mangaka" && (taskDetail?.status === "Revising" || taskDetail?.status === "Unsatisfied" || taskDetail?.status === "Completed") && (
              <button
                onClick={handleViewFeedbackClick}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium px-6 py-2.5 rounded-lg text-l transition-colors cursor-pointer shadow-sm w-full sm:w-auto">
                View Feedback
              </button>
            )}


          </div>
          {(role === "mangaka" && taskDetail?.status == "Pending") &&
            <>
              {/* NHÃ SỬA CÁI APPROVAL */}
              <ApprovalPanel
                feedback={feedback}
                onFeedbackChange={(e) => setFeedback(e.target.value)}
                onApprove={() => handleApprovedTask(taskId)}
                onReject={() => handleInitialRejectClick()}
                onUnsatisfied={() => setIsUnsatisfiedModalOpen(true)}
                rejectCount={taskDetail?.rejectCount}
                isLoading={isLoading}
                approveText="Approve Task"
                rejectText="Reject Task with Feedback"
              />

              <AnnotationModal
                isOpen={isAnnotationOpen}
                onClose={() => setIsAnnotationOpen(false)}
                fileUrl={taskDetail?.submittedFileUrl}
                taskId={taskId}
                role={role}
                onRejectTrigger={() => { //cho chữ mặc định khi annotation vì reject nó vẫn check á
                  handleRejectTask(taskId, role);
                  setIsAnnotationOpen(false);
                }}
              />


              <ConfirmRejectModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onYes={() => {
                  setConfirmModalOpen(false);
                  setIsAnnotationOpen(true);
                }}
                onNo={() => {
                  setConfirmModalOpen(false);
                  handleRejectTask(taskId, role);
                }}
              />

              <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                fileUrl={taskDetail?.submittedFileUrl}
                role={role}
              />

              <UnsatisfiedModal
                isOpen={isUnsatisfiedModalOpen}
                onClose={() => setIsUnsatisfiedModalOpen(false)}
                onSubmit={(percentage) => {
                  handleUnsatisfiedTask(percentage);
                  setIsUnsatisfiedModalOpen(false);
                }}
                isLoading={isLoading}
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

          {/* Feedback Modals */}
          <FeedbackViewer
            ref={feedbackViewerRef}
            taskId={taskId}
            fallbackFeedback={taskDetail?.feedback}
            fallbackFeedbackType={taskDetail?.feedbackType}
            fileUrl={taskDetail?.submittedFileUrl}
            role={role}
          />
        </div>

        {/* Feedback History Log Section */}
        <div className="w-full">

          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all duration-300 mt-2 cursor-pointer"
          >
            <span>View feedback history</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${isHistoryOpen ? "rotate-180 text-primary" : ""
                }`}
            />
          </button>

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isHistoryOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
          >
            <div className="overflow-hidden">
              <FeedbackHistoryList
                taskId={taskId}
                fileUrl={taskDetail?.submittedFileUrl}
                role={role?.toLowerCase()}
              />
            </div>
          </div>
        </div>
      </div >
    </>
  )

}
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';


import { ArrowLeft, Download, Star, ChevronDown, FileText, Loader2, X, SquarePen, Check } from "lucide-react";
import { FeedbackHistoryList } from "../../shared/components/FeedbackHistoryList";
import { useChapterDetail } from "../../features/chapters/hooks/useChapterDetail";
import { useUpdateChapter } from "../../features/chapters/hooks/useUpdateChapter";
import { useProgressing } from "../../features/chapters/hooks/useProgressing";
import { ApprovalPanel } from "../shared/ApprovalPanel";
import { ConfirmRejectModal } from "../shared/ConfirmRejectModal";
import { AnnotationModal } from "../shared/AnnotationModal";
import { FeedbackViewer } from "../shared/FeedbackViewer";
import { useToast } from "@/shared/hooks/useToast";
import { useUpdateManuscript } from "../../features/chapters/hooks/useUpdateManuscript";


// (Worker setup moved to AnnotationModal)

// Component hiển thị chi tiết của một Chapter cụ thể (để đọc truyện/xem nháp)
export function ChapterDetail() {


  // Hook dùng để quay lại trang trước đó
  const navigate = useNavigate();
  const { showAlert } = useToast();
  const { setBreadcrumbItems } = useOutletContext();

  // Lấy seriesId và chapterId được truyền ngầm qua state khi gọi hàm navigate từ component cha (VD: ChapterList)
  const seriesId = useLocation().state?.seriesId;
  const chapterId = useLocation().state?.chapterId;
  const currentRole = useLocation().state?.role;

  // const validSeriesData = seriesData.find(item => String(item.id) == String(seriesIdFromState))

  // const validChapterData = chapterList.find(item => String(item.id) == String(chapterId))

  const { progress } = useProgressing(chapterId);

  const { chapterDetail,
    setChapterDetail,
    storyFile,
    storyInputRef, handleStoryChange,
    handleSubmitChapter,
    isLoading,
    handleReload
  } = useChapterDetail(seriesId, chapterId);
  const { handleApprove, handleReject, feedback, setFeedback } = useUpdateChapter(seriesId, chapterId);

  const today = dayjs().utc(true);
  const deadlineObj = dayjs(chapterDetail?.deadline).utc(true);
  const foramttedDeadline = dayjs(chapterDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm')
  console.log(foramttedDeadline);

  const isOverdue = deadlineObj.isBefore(today)

  console.log(isOverdue);
  console.log(chapterDetail);
  const {
    isEditingManuscript,
    manuscriptFile,
    isUpdating,
    manuscriptInputRef,
    handleStartEditManuscript,
    handleCancelEditManuscript,
    handleManuscriptChange,
    handleSaveManuscript,
  } = useUpdateManuscript(seriesId, chapterId, handleReload);



  //các state quản lí hiển thị pop-up
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const feedbackViewerRef = useRef(null);

  const handleViewFeedbackClick = () => {
    feedbackViewerRef.current?.viewFeedback();
  };

  const handleInitialRejectClick = () => {
    setConfirmModalOpen(true);
  }



  const rolePrefix = currentRole?.toLowerCase() || "mangaka";
  const customBreadcrumb = [
    { label: rolePrefix.charAt(0).toUpperCase() + rolePrefix.slice(1), path: `/${rolePrefix}` },
    { label: "Series", path: `/${rolePrefix}/series` },
    { label: chapterDetail?.seriesTitle || "Series Detail", path: seriesId ? `/${rolePrefix}/series/${seriesId}` : undefined },
    { label: chapterDetail?.chapterNumber ? `Chapter ${chapterDetail.chapterNumber}${chapterDetail.title ? `: ${chapterDetail.title}` : ''}` : "Chapter Detail" }
  ];

  useEffect(() => {
    if (chapterDetail) {
      setBreadcrumbItems(customBreadcrumb);
    }
    return () => setBreadcrumbItems(null);
  }, [chapterDetail?.seriesTitle, chapterDetail?.chapterNumber, chapterDetail?.title, rolePrefix]);

  if (!chapterDetail) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium text-lg">Loading chapter details...</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">

        {/* Khung (Card) chứa thông tin chính của Chapter */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-4">
          {chapterDetail?.status !== ("Published" || "Publishing") && (
            <div className="w-full bg-muted rounded-full h-6 overflow-hidden border border-border">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out flex items-center justify-start ps-2 text-xs font-bold text-white ${progress === 100 ? 'bg-success' : 'bg-info'
                  }`}
                style={{ width: `${progress}%` }}
              >
                {/* Chỉ hiển thị số khi tiến độ lớn hơn 10% để tránh chữ bị tràn ra ngoài khi thanh quá ngắn */}
                {`${progress}%`}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            {/* Cụm thông tin bên trái: Tiêu đề Chapter, Số thứ tự, Tóm tắt */}
            <div className="min-w-0">
              <h3 className="title-obelix font-semibold text-lg sm:text-xl capitalize text-card-foreground break-words">Chapter {chapterDetail?.chapterNumber}: {chapterDetail?.title}</h3>
              <div>
                <p className="mt-1 sm:mt-3 text-xs sm:text-sm text-muted-foreground">{chapterDetail?.seriesTitle}</p>
              </div>
            </div>

            {/* Cụm thông tin bên phải: Badge trạng thái (Status) và Ngày tải lên */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <StatusBadge status={chapterDetail?.status.toLowerCase()} />
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground"><FileText size={16} /> Total pages: <span className="text-foreground font-medium">{chapterDetail?.totalPage}</span></div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-border pb-6">

            <div className="md:col-span-4 space-y-2">
              <div className="bg-muted/30 p-3 rounded-lg border border-border min-h-[85px] text-foreground text-sm leading-relaxed">
                <h3 className="font-normal text-sm text-muted-foreground  tracking-wider">Created Date</h3>
                {chapterDetail?.createdAt ? (
                  <div className="text-sm my-2 font-semibold">{dayjs(chapterDetail?.createdAt).utc(true).format('DD/MM/YYYY HH:mm')}</div>
                ) : (
                  <div className="text-sm ms-0.5">— — — —</div>
                )}

              </div>
            </div>
            <div className="md:col-span-4 space-y-2 ">
              <div className="bg-muted/30 p-3 rounded-lg border border-border min-h-[85px] text-foreground text-sm leading-relaxed">
                <h3 className="font-normal text-sm text-muted-foreground  tracking-wider">Deadline
                  {chapterDetail?.status != ("Publishing" || "Scheduled") ? (
                    <>{isOverdue && <span className="text-destructive font-bold">(Overdue)</span>}</>
                  ) : (
                    <></>
                  )}

                </h3>
                {chapterDetail?.deadline ? (
                  <>
                    <div className="text-xs my-2 font-semibold capitalize">{foramttedDeadline}</div>

                  </>

                ) : (
                  <div className="text-sm ms-0.5"> — — — —</div>
                )}
              </div>
            </div>
            <div className="md:col-span-4 space-y-2">
              <div className="bg-muted/30 p-3 rounded-lg border border-border min-h-[85px] text-foreground text-sm leading-relaxed">
                <h3 className="font-normal text-sm text-muted-foreground  tracking-wider">Rating</h3>
                {chapterDetail?.averageRate != 0 ? (
                  <div className="text-l gap-2 my-2 font-light capitalize flex items-center justify-content-center"><Star size={15} className="text-yellow-400 fill-yellow-400" />  {chapterDetail?.averageRate}</div>
                ) : (
                  <div className="text-sm ms-0.5"> — — — —</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Summary</h3>
              <div className="bg-muted/30 p-4 rounded-lg border border-border min-h-[100px] text-foreground text-sm leading-relaxed max-h-35 overflow-y-auto">
                {chapterDetail?.summary}
              </div>
            </div>

            {currentRole.toLowerCase() === "mangaka" &&
              <div className=" md:col-span-6 space-y-2">

                {/* Header & Nút Edit */}
                <div className="flex justify-between items-center w-full">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase">Original Manuscript</h3>
                  {chapterDetail?.status === "Created" && (
                    isEditingManuscript ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleCancelEditManuscript}
                          disabled={isUpdating}
                          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground p-1 rounded cursor-pointer transition-colors disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={handleSaveManuscript}
                          disabled={isUpdating}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground p-1 rounded cursor-pointer transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "..." : <Check size={14} />}
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={handleStartEditManuscript}
                        className="cursor-pointer hover:bg-secondary/50 rounded-xl p-1 inline-flex items-center justify-center text-muted-foreground"
                      >
                        <SquarePen size={14} />
                      </span>
                    )
                  )}
                </div>

                {/* Nội dung vùng chọn file / tải file */}
                <div className="bg-muted/30 p-4 rounded-lg border border-border min-h-[100px] flex flex-col items-center justify-center text-center space-y-2">
                  {isEditingManuscript ? (
                    <div
                      className="w-full flex flex-col items-center justify-center cursor-pointer h-full"
                      onClick={() => manuscriptInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        accept=".pdf,.zip"
                        className="hidden"
                        ref={manuscriptInputRef}
                        onChange={handleManuscriptChange}
                      />
                      {manuscriptFile ? (
                        <p className="text-primary font-medium text-sm truncate max-w-[250px]">
                          {manuscriptFile.name}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          Click to select new file
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground">View the initial manuscript file here</p>
                      <a
                        href={chapterDetail?.manuscriptFileUrl}
                        download
                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                      >
                        <Download size={16} />
                        View Initial Manuscript
                      </a>
                    </>
                  )}
                </div>

              </div>
            }

            {currentRole.toLowerCase() === "tantou" &&

              <div className=" md:col-span-6 space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground uppercase">Submitted File By mangaka</h3>
                {/* THÊM MỚI: Thay đổi chiều cao từ h-[100px] sang min-h-[140px] h-auto và khoảng cách space-y-3 */}
                <div className="border  border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center space-y-3 min-h-[140px] h-auto">
                  {chapterDetail?.chapterFileUrl ? (
                    <>
                      <p className="text-xs text-muted-foreground">Download To Review</p>
                      <div className="flex flex-col gap-2 w-full items-center">
                        <a
                          href={chapterDetail?.chapterFileUrl}
                          download
                          className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm w-[240px]"
                        >
                          <Download size={16} />
                          Download File Here
                        </a>
                      </div>
                    </>
                  ) : (
                    <p className="text-xl font-semibold text-muted-foreground">No file to review</p>
                  )
                  }
                </div>
              </div>
            }
          </div>




          {/* PHẦN DƯỚI NÀY ĐỂ CHÈN PDF NÈ
                        PHẦN DƯỚI NÀY ĐỂ CHÈN PDF NÈ
                        PHẦN DƯỚI NÀY ĐỂ CHÈN PDF NÈ */}
          <div className="space-y-3">

            {currentRole === "mangaka" ? (
              progress === 100 ? (
                <>
                  <h3 className="font-medium text-sm inline-flex items-center text-muted-foreground">Submit Your Work</h3>
                  {chapterDetail?.chapterFileUrl ? (
                    <div className="w-full border border-dashed border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center h-[160px] gap-2">
                      <p className="text-xs text-center text-muted-foreground">Submitted File</p>
                      <div className="flex flex-col gap-2 w-full items-center">
                        <a
                          href={chapterDetail?.chapterFileUrl}
                          download
                          className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm w-[240px]"
                        >
                          <Download size={16} />
                          Download File Here
                        </a>
                      </div>
                    </div>
                  ) : (
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
                          <p className="text-sm text-muted-foreground mt-1">PDF, ZIP up to 50MB</p>
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
                  )
                  }

                </>
              ) : (
                <div className="w-full border border-dashed border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center h-[160px] hover:border-primary transition-colors cursor-pointer">
                  <p className="text-muted-foreground">The progress bar needs to be at 100% to submit the file.</p>
                </div>
              )

            ) : (
              <></>
            )}
          </div>

          {/* KẾT THÚC PHẦN CHÈN
                    KẾT THÚC PHẦN CHÈN
                    KẾT THÚC PHẦN CHÈN
                    KẾT THÚC PHẦN CHÈN */}


          {currentRole.toLowerCase() === "mangaka" &&
            <>
              <div className="flex justify-end gap-3 pt-4 border-t border-border ">
                {!isOverdue ? (
                  <button
                    onClick={handleSubmitChapter}
                    disabled={!storyFile || isLoading}
                    className="bg-secondary cursor-pointer text-secondary-foreground hover:bg-secondary/80 font-medium px-6 py-2.5 rounded-lg text-base transition-colors shadow-sm w-50 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed">

                    {isLoading ? "Submitting..." : "Submit Chapter"}
                  </button>
                ) : (
                  <button className="bg-secondary text-secondary-foreground  font-medium px-6 py-2.5 rounded-lg text-base transition-colors shadow-sm w-50 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed readonly " >
                    Overdue
                  </button>
                )
                }

                {((chapterDetail?.feedback) || (currentRole?.toLowerCase() === 'mangaka' && ['rejected', 'approved', 'scheduled', 'publishing'].includes(chapterDetail?.status?.toLowerCase()))) && (
                  <button
                    onClick={handleViewFeedbackClick}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium px-6 py-2.5 rounded-lg text-base transition-colors shadow-sm w-50">
                    View Feedback
                  </button>
                )}

                {console.log("Coi chapter ID: ", chapterDetail?.chapterId)}

              </div>
            </>
          }




          {(currentRole.toLowerCase() == 'tantou' && chapterDetail?.status === "Pending") && (
            <ApprovalPanel
              feedback={feedback}
              onFeedbackChange={(e) => setFeedback(e.target.value)}
              onApprove={() => handleApprove(currentRole, chapterDetail?.status, setChapterDetail)}
              onReject={() => currentRole === 'tantou'
                ? handleInitialRejectClick()
                : handleReject(currentRole, chapterDetail?.status, setChapterDetail, "Rejected by tantou, view annotation for details")}
            />
          )}



        </div>

        {/* Feedback History Log Section */}
        {['tantou', 'editorial', 'board', 'mangaka'].includes(currentRole?.toLowerCase()) && (
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
                  chapterId={chapterId}
                  fileUrl={chapterDetail?.chapterFileUrl}
                  role={currentRole?.toLowerCase()}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmRejectModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onYes={() => {
          setConfirmModalOpen(false);
          setIsAnnotationOpen(true);
        }}
        onNo={() => {
          setConfirmModalOpen(false);
          handleReject(currentRole, chapterDetail?.status, setChapterDetail);
        }}
      />


      <AnnotationModal
        isOpen={isAnnotationOpen}
        onClose={() => setIsAnnotationOpen(false)}
        fileUrl={chapterDetail?.chapterFileUrl}
        chapterId={chapterId}
        seriesId={seriesId}
        role={currentRole.toLowerCase()}
        onRejectTrigger={() => {
          handleReject(currentRole, chapterDetail?.status, setChapterDetail, "Annotation feedback added to the submission")
          setIsAnnotationOpen(false);
        }}
      />

      <FeedbackViewer
        ref={feedbackViewerRef}
        chapterId={chapterDetail?.chapterId}
        fallbackFeedback={chapterDetail?.feedback}
        fallbackFeedbackType={chapterDetail?.feedbackType}
        fileUrl={chapterDetail?.chapterFileUrl}
        role={currentRole.toLowerCase()}
      />
    </>
  )
}
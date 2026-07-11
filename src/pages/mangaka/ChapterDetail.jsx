import { useLocation, useNavigate } from "react-router";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';


import { ArrowLeft, Download, Star } from "lucide-react";
import { useChapterDetail } from "../../features/chapters/hooks/useChapterDetail";
import { useUpdateChapter } from "../../features/chapters/hooks/useUpdateChapter";
import { useProgressing } from "../../features/chapters/hooks/useProgressing";
import { ApprovalPanel } from "../shared/ApprovalPanel";
import { ConfirmRejectModal } from "../shared/ConfirmRejectModal";
import { AnnotationModal } from "../shared/AnnotationModal";
import { TextFeedbackModal } from "../shared/TextFeedbackModal";
import { FeedbackViewer } from "../shared/FeedbackViewer";
import { useToast } from "@/shared/hooks/useToast";

// (Worker setup moved to AnnotationModal)

// Component hiển thị chi tiết của một Chapter cụ thể (để đọc truyện/xem nháp)
export function ChapterDetail() {


  // Hook dùng để quay lại trang trước đó
  const navigate = useNavigate();
  const { showAlert } = useToast();

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
    isLoading
  } = useChapterDetail(seriesId, chapterId);
  const { handleApprove, handleReject, feedback, setFeedback } = useUpdateChapter(seriesId, chapterId);

  const today = dayjs().utc(true);
  const deadlineObj = dayjs(chapterDetail?.deadline).utc(true);
  const foramttedDeadline = dayjs(chapterDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm')
  console.log(foramttedDeadline);

  const isOverdue = deadlineObj.isBefore(today)

  console.log(isOverdue);
  console.log(chapterDetail);

  //các state quản lí hiển thị pop-up
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);

  const feedbackViewerRef = useRef(null);

  const handleViewFeedbackClick = () => {
    feedbackViewerRef.current?.viewFeedback();
  };

  const handleInitialRejectClick = () => {
    setConfirmModalOpen(true);
  }

  return (
    <>
      {/* Vùng chứa toàn bộ nội dung của trang chi tiết */}
      <div className="p-6 space-y-8">

        {/* Nút Back quay lại trang trước */}
        <button
          onClick={() => navigate(-1)} // navigate(-1) tương đương với bấm nút Back trên trình duyệt
          className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Khung (Card) chứa thông tin chính của Chapter */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out flex items-center justify-start ps-2 text-xs font-bold text-white ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                }`}
              style={{ width: `${progress}%` }}
            >
              {/* Chỉ hiển thị số khi tiến độ lớn hơn 10% để tránh chữ bị tràn ra ngoài khi thanh quá ngắn */}
              {`${progress}%`}
            </div>
          </div>

          <div className="flex justify-between items-start">
            {/* Cụm thông tin bên trái: Tiêu đề Chapter, Số thứ tự, Tóm tắt */}
            <div>
              <h1 className="font-semibold text-xl capitalize">Chapter {chapterDetail?.chapterNumber}: {chapterDetail?.title}</h1>
              <div>
                <p className="mt-1 text-foreground/80">{chapterDetail?.seriesTitle}</p>
              </div>
            </div>

            {/* Cụm thông tin bên phải: Badge trạng thái (Status) và Ngày tải lên */}
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge status={chapterDetail?.status.toLowerCase()} />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-gray-200 pb-6">

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
                <h3 className="font-normal text-sm text-muted-foreground  tracking-wider">Deadline</h3>
                {chapterDetail?.deadline ? (
                  <div className="text-sm my-2 font-semibold capitalize">{foramttedDeadline}</div>
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
              <div className="bg-muted/30 p-4 rounded-lg border border-border min-h-[100px] text-foreground text-sm leading-relaxed">
                {chapterDetail?.summary}
              </div>
            </div>

            {currentRole.toLowerCase() === "mangaka" &&
              <div className=" md:col-span-6 space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground uppercase">Original Manuscript</h3>
                <div className="border  border-border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center space-y-2 h-[100px]">
                  <p className="text-xs text-muted-foreground">View the initial manuscript file here</p>
                  <a
                    href={chapterDetail?.manuscriptFileUrl}
                    download
                    className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm"
                  >
                    <Download size={16} />
                    View Initial Manuscript
                  </a>
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
                    className="bg-secondary cursor-pointer text-secondary-foreground hover:bg-secondary/80 font-medium px-6 py-2.5 rounded-lg text-base transition-colors shadow-sm w-50 disabled:bg-gray-500 disabled:cursor-not-allowed">

                    {isLoading ? "Submitting..." : "Submit Chapter"}
                  </button>
                ) : (
                  <button className="bg-secondary text-secondary-foreground  font-medium px-6 py-2.5 rounded-lg text-base transition-colors shadow-sm w-50 disabled:bg-gray-500 disabled:cursor-not-allowed readonly " >
                    Overdue
                  </button>
                )
                }

                {((chapterDetail?.feedback) || (currentRole?.toLowerCase() === 'mangaka' && ['pending', 'reject', 'rejected', 'approved', 'scheduled', 'publishing'].includes(chapterDetail?.status?.toLowerCase()))) && (
                  <button
                    onClick={handleViewFeedbackClick}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium px-6 py-2.5 rounded-lg text-base transition-colors shadow-sm w-50">
                    View Feedback
                  </button>
                )}

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
        chapterId={chapterId}
        fallbackFeedback={chapterDetail?.feedback}
        fallbackFeedbackType={chapterDetail?.feedbackType}
        fileUrl={chapterDetail?.chapterFileUrl}
        role={currentRole.toLowerCase()}
      />
    </>
  )
}
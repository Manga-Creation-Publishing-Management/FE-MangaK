import { useLocation, useNavigate } from "react-router";
import { StatusBadge } from "../shared/StatusBadge";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import dayjs from 'dayjs';

import { ArrowLeft, Download, Undo, Brush, Type } from "lucide-react";
import { useChapterDetail } from "../../features/chapters/hooks/useChapterDetail";
import { useUpdateChapter } from "../../features/chapters/hooks/useUpdateChapter";
import { ApprovalPanel } from "../shared/ApprovalPanel";
import { KonvaDraw } from "../shared/KonvaDraw";
import { useChapterAnnotation } from "../../features/chapters/hooks/useChapterAnnotation";
import { useProgressing } from "../../features/chapters/hooks/useProgressing";

// Kích hoạt Web Worker để thư viện react-pdf xử lý PDF ở một luồng độc lập (tránh đơ UI)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Component hiển thị chi tiết của một Chapter cụ thể (để đọc truyện/xem nháp)
export function ChapterDetail() { 

  const {
    tool,
    setTool,
    annotationData,
    annotationText,
    textInput,
    setTextInput,
    brushColor,
    setBrushColor,
    isModalOpen,
    setIsModalOpen,
    pageNumber,
    setPageNumber,
    pageWidth,
    pageHeight,
    isPageLoaded,
    setIsPageLoaded,
    numPages,
    handleUndo,
    handleClearPage,
    setPageLines,
    setPageTexts,
    closeModal,
    handleBackdropClick,
    onPageLoadSuccess,
    onDocumentLoadSuccess,
    handleSubmitAnnotation,
  } = useChapterAnnotation();

  // Hook dùng để quay lại trang trước đó
  const navigate = useNavigate();

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
  const foramttedDeadline =  dayjs(chapterDetail?.deadline).utc(true).format('DD/MM/YYYY HH:mm') 
  console.log(foramttedDeadline);

  const isOverdue = deadlineObj.isBefore(today)

  console.log(isOverdue);

  return (
    <>
      {/* Vùng chứa toàn bộ nội dung của trang chi tiết */}
      <div className="p-8 space-y-8">

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
              <StatusBadge status={chapterDetail?.status} />
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
                {chapterDetail?.deadline ? (
                  <div className="text-sm my-2 font-semibold capitalize">{chapterDetail?.deadline}</div>
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

                        {/* THÊM MỚI: Nút View and Annotate */}
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-border shadow-sm w-[240px]"
                        >
                          View and Annotate
                        </button>
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

            {currentRole === "mangaka" &&
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

            }
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
                
              </div>
            </>
          }




          {(currentRole.toLowerCase() == 'tantou' && chapterDetail?.status === "Pending") && (
            <ApprovalPanel
              feedback={feedback}
              onFeedbackChange={(e) => setFeedback(e.target.value)}
              onApprove={() => handleApprove(currentRole, chapterDetail?.status, setChapterDetail)}
              onReject={() => handleReject(currentRole, chapterDetail?.status, setChapterDetail)}
            />
          )}



        </div>
      </div>

      {/* THÊM: POP-UP CHO PDF ANNOTATION */}
      {isModalOpen && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-[95vw] max-h-[95vh] overflow-y-auto flex flex-col items-center gap-4 relative">

            {/* Tiêu đề & Nút Close */}
            <div className="flex justify-between items-center w-full pb-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">View and Annotate</h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* MỚI NỮA NÈ: Thanh công cụ: Vẽ và Text */}
            <div className="flex flex-wrap items-center justify-between gap-4 w-full bg-muted/40 p-3 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                {/* Các nút chọn công cụ vẽ/text */}
                <button
                  onClick={() => setTool('brush')}
                  className={`p-2 rounded-lg transition-all ${tool === 'brush' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/50 text-muted-foreground'
                    }`}
                  title="Brush"
                >
                  <Brush />
                </button>
                <button
                  onClick={() => setTool('text')}
                  className={`p-2 rounded-lg transition-all ${tool === 'text' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted/50 text-muted-foreground'
                    }`}
                  title="Text"
                >
                  <Type />
                </button>
              </div>

              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Thanh công cụ vẽ: Brush color, Undo, Clear */}
            <div className="flex flex-wrap items-center justify-between gap-4 w-full bg-muted/40 p-3 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color:</span>
                <div className="flex gap-1.5">
                  {["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#000000"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${brushColor === color ? 'border-primary scale-110 shadow-sm' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUndo(pageNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 text-xs font-semibold transition-colors cursor-pointer border border-border shadow-sm"
                >
                  <Undo size={14} />
                  Undo
                </button>
                <button
                  onClick={() => handleClearPage(pageNumber)}
                  className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 text-xs font-semibold transition-colors cursor-pointer border border-transparent"
                >
                  Clear Page
                </button>
              </div>
            </div>

            {/* Vùng hiển thị PDF và lớp vẽ KonvaDraw */}
            <div className="relative overflow-hidden border border-border rounded-xl shadow-inner bg-white min-h-[400px] flex items-center justify-center">
              <Document
                file={chapterDetail?.chapterFileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center gap-2 py-20 px-32 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm font-medium animate-pulse">Loading PDF document...</p>
                  </div>
                }
              >
                <div className="relative" style={{ width: pageWidth, height: pageHeight }}>
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    onLoadSuccess={onPageLoadSuccess}
                    loading={
                      <div className="flex flex-col items-center justify-center absolute inset-0 text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm font-medium mt-2">Loading page {pageNumber}...</p>
                      </div>
                    }
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                  {isPageLoaded && (
                    <div className="absolute inset-0 z-20">
                      <KonvaDraw
                        width={pageWidth}
                        height={pageHeight}
                        tool={tool}
                        textInput={textInput}
                        onTextPlaced={() => setTextInput('')}
                        lines={annotationData[pageNumber] || []}
                        setLines={(newLines) => setPageLines(pageNumber, newLines)}
                        texts={annotationText[pageNumber] || []}
                        setTexts={(newTexts) => setPageTexts(pageNumber, newTexts)}
                        color={brushColor}
                      />
                    </div>
                  )}
                </div>
              </Document>
            </div>

            {/* Phân trang PDF */}
            {numPages && (
              <div className="flex items-center justify-between w-full px-2">
                <button
                  disabled={pageNumber <= 1}
                  onClick={() => { setPageNumber(prev => prev - 1); setIsPageLoaded(false); }}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors cursor-pointer border border-border"
                >
                  Previous Page
                </button>
                <span className="text-sm font-semibold text-muted-foreground">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  disabled={pageNumber >= numPages}
                  onClick={() => { setPageNumber(prev => prev + 1); setIsPageLoaded(false); }}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors cursor-pointer border border-border"
                >
                  Next Page
                </button>
              </div>
            )}

            {/* Nút Submit Annotation */}
            <div className="w-full border-t border-border pt-4 mt-2">
              <button
                onClick={handleSubmitAnnotation}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md cursor-pointer hover:shadow-lg text-sm"
              >
                Submit Annotation
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
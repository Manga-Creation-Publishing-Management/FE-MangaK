import { useLocation, useParams, useNavigate } from "react-router";
import { StatusBadge } from "../shared/StatusBadge";
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { ArrowLeft } from "lucide-react";
import { useChapterDetail } from "../../features/chapters/hooks/useChapterDetail";
import { useUpdateChapter } from "../../features/chapters/hooks/useUpdateChapter";
import { ApprovalPanel } from "../shared/ApprovalPanel";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;// File PDF thường rất nặng và tốn phần cứng để xử lý. Dòng này kích hoạt một "Worker" chạy ngầm dưới trình duyệt, giúp việc dịch file PDF diễn ra ở một luồng độc lập, không làm đơ/lag giao diện web

export function ChapterDetail() {

  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const seriesId = useLocation().state?.seriesId;

  const chapterId = useLocation().state?.chapterId;
  const currentRole = useLocation().state?.role;

  // const validSeriesData = seriesData.find(item => String(item.id) == String(seriesIdFromState))

  // const validChapterData = chapterList.find(item => String(item.id) == String(chapterId))

  const { chapterDetail, setChapterDetail } = useChapterDetail(seriesId, chapterId);
  const { handleApprove, handleReject, feedback, setFeedback } = useUpdateChapter(seriesId, chapterId);


  console.log(chapterDetail);

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
          <div className="flex justify-between items-start">
            {/* Cụm bên trái: Tiêu đề và Tên Series */}
            <div>
              <h1 className="font-semibold text-xl">Chapter {chapterDetail?.chapterNumber}: {chapterDetail?.title}</h1>
              {/* <p className="text-muted-foreground mt-1">{chapterDetail?.seriesTitle}</p> */}
              <div>
                <p className="mt-1 text-foreground">Summary: {chapterDetail?.summary}</p>
              </div>
            </div>


            {/* Cụm bên phải: Gom Badge và Upload Date lại chung một nhóm */}
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge status={chapterDetail?.status} />
              {chapterDetail?.updatedAt != null &&
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Upload Date: {chapterDetail?.updatedAt}</p>
                </div>
              }
            </div>

          </div>

          <div className="w-full h-[350px] overflow-y-auto border border-gray-300 bg-zinc-700 p-4 rounded-lg shadow-inner">

            <Document
              file={chapterDetail?.manuscriptFileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex justify-center items-center h-full text-white font-medium">
                  <span>Đang tải tài liệu...</span>
                </div>
              }
            >
              {/* Chỉ render các trang khi đã load xong số lượng */}
              {numPages && Array.from(new Array(numPages), (el, index) => (

                /* Khung bọc từng trang: tạo khoảng cách giữa các trang (mb-6) và căn giữa */
                <div
                  key={`page_wrapper_${index + 1}`}
                  className="mb-6 flex justify-center"
                >
                  {/* Trang PDF: Thêm shadow và bo góc nhẹ để trông giống tờ giấy thật */}
                  <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
                    <Page
                      pageNumber={index + 1}
                      width={600}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </div>
                </div>

              ))}
            </Document>

          </div>
          {currentRole.toLowerCase() == 'tantou' &&

            < ApprovalPanel onApprove={() =>
              handleApprove(chapterId, currentRole, chapterDetail?.status, setChapterDetail)} />
          }




        </div>


      </div>
    </>
  )
} 
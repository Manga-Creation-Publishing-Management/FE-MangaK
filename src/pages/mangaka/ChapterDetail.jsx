import { useLocation, useParams, useNavigate } from "react-router";
import { StatusBadge } from "../shared/StatusBadge";
import useCreateSeries from "../../features/series/hooks/useCreateSeries";
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { ArrowLeft } from "lucide-react";
import { useChapterDetail } from "../../features/chapters/hooks/useChapterDetail";

// Kích hoạt Web Worker để thư viện react-pdf xử lý PDF ở một luồng độc lập (tránh đơ UI)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Component hiển thị chi tiết của một Chapter cụ thể (để đọc truyện/xem nháp)
export function ChapterDetail() {

  // Hook dùng để quay lại trang trước đó
  const navigate = useNavigate();
  
  // State lưu tổng số trang của file PDF
  const [numPages, setNumPages] = useState(null);

  // Hàm callback được gọi khi thư viện react-pdf tải xong file PDF thành công
  // Trả về số trang thực tế của file PDF
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Lấy seriesId và chapterId được truyền ngầm qua state khi gọi hàm navigate từ component cha (VD: ChapterList)
  const seriesId = useLocation().state?.seriesId;
  const chapterId = useLocation().state?.chapterId;

  // Gọi API lấy dữ liệu chi tiết của chapter thông qua hook useChapterDetail
  const { chapterDetail } = useChapterDetail(seriesId, chapterId)

  console.log(chapterDetail);

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
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-start">
            
            {/* Cụm thông tin bên trái: Tiêu đề Chapter, Số thứ tự, Tóm tắt */}
            <div>
              <h1 className="font-semibold text-xl">Chapter {chapterDetail?.chapterNumber}: {chapterDetail?.title}</h1>
              <div>
                <p className="mt-1 text-foreground">Summary: {chapterDetail?.summary}</p>
              </div>
            </div>

            {/* Cụm thông tin bên phải: Badge trạng thái (Status) và Ngày tải lên */}
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge status={chapterDetail?.status} />
              {chapterDetail?.updatedAt != null &&
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Upload Date: {chapterDetail?.updatedAt}</p>
                </div>
              }
            </div>

          </div>

          {/* Vùng hiển thị nội dung PDF đọc truyện. 
              Sử dụng h-[350px] overflow-y-auto để có thể cuộn danh sách các trang PDF */}
          <div className="w-full h-[350px] overflow-y-auto border border-gray-300 bg-zinc-700 p-4 rounded-lg shadow-inner">
            
            {/* Component Document của react-pdf để tải file PDF từ URL trả về */}
            <Document
              file={chapterDetail?.manuscriptFileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={ // Hiển thị khi file PDF đang được tải
                <div className="flex justify-center items-center h-full text-white font-medium">
                  <span>Đang tải tài liệu...</span>
                </div>
              }
            >
              {/* Vòng lặp duyệt qua tất cả số trang của PDF để hiển thị lần lượt từ trên xuống */}
              {numPages && Array.from(new Array(numPages), (el, index) => (

                /* Khung bọc từng trang để tạo khoảng cách và căn giữa */
                <div
                  key={`page_wrapper_${index + 1}`}
                  className="mb-6 flex justify-center"
                >
                  {/* Khung hiển thị từng trang PDF riêng lẻ. Thêm shadow và bo góc cho giống trang giấy thật */}
                  <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
                    <Page
                      pageNumber={index + 1} // Render trang PDF thứ i+1
                      width={600}            // Kích thước chuẩn hiển thị
                      renderTextLayer={true} // Cho phép người dùng bôi đen text trên PDF
                      renderAnnotationLayer={true} 
                    />
                  </div>
                </div>

              ))}
            </Document>
          </div>

        </div>
      </div>
    </>
  )
}
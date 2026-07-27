import { useEffect, useRef, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";
import dayjs from "dayjs";
import { pdfjs } from 'react-pdf';
// Đảm bảo Web Worker được kích hoạt để tránh block UI Thread khi đếm trang PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export function useCreateChapter(seriesId, onClose, onReload) {
  const { showAlert } = useToast();
  const [chapterListForm, setChapterListForm] = useState({});
  const [seriesData, setSeriesData] = useState([]);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  // Thêm state lưu số trang và trạng thái loading khi đang đọc file
  const [pageCount, setPageCount] = useState(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);

  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoryFile(file);
      setPageCount(null); // Reset lại số trang mỗi khi chọn file mới

      // Kiểm tra xem file upload có phải là định dạng PDF không
      if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        setIsReadingPdf(true);

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const typedarray = new Uint8Array(event.target.result);
            // Load tài liệu ngầm bằng pdfjs
            const pdf = await pdfjs.getDocument(typedarray).promise;

            // Cập nhật số trang vào state
            setPageCount(pdf.numPages);
          } catch (error) {
            console.error("Error parsing PDF pages:", error);
            showAlert("Cannot read PDF page count", "error");
          } finally {
            setIsReadingPdf(false);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    }
  };


  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setChapterListForm({
      ...chapterListForm,
      [name]: value,
    })
  }

  const handleSubmitChapter = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formElement = e.target;
    const summary = formElement.elements["Summary"]?.value?.trim();

    if (!chapterListForm.Title?.trim() || !summary || !storyFile) {
      showAlert("Please fill in all required fields: Title, Summary, and Manuscript File!", "error");
      setIsLoading(false);
      return;
    }

    // 1. Khởi tạo một đối tượng FormData trống hoàn toàn
    const formDataToSend = new FormData();
    if (pageCount !== null) {
      formDataToSend.append("TotalPage", pageCount);
    }

    // 2. Append các chuỗi text thông thường (Lưu ý: Viết hoa chữ cái đầu y hệt Swagger)
    formDataToSend.append("Title", formElement.elements["Title"].value);
    formDataToSend.append("Summary", formElement.elements["Summary"].value);
    // 3. Xử lý định dạng Deadline và append vào FormData

    // 4. Append FILE NHỊ PHÂN thực tế (Lấy từ state storyFile đã chọn)
    if (storyFile) {
      // Key "ManuscriptFileUrl" phải trùng khớp hoàn toàn với tên biến bên Swagger
      formDataToSend.append("ManuscriptFileUrl", storyFile);
    }

    try {
      // 4. Gọi qua API client mới: api.post chứ không dùng post() lẻ loi nữa
      const results = await chaptersService.createChapter(seriesId, formDataToSend);



      if (results) {
        showAlert("Created successfully!");
        setTimeout(() => {
          onClose();
          onReload();
        }, 0);
      }
    } catch (error) {
      showAlert(error.response?.data?.Message || "Error creating chapter", "error");
      console.error("Error:", error);
    }


  };


  // Trả về danh sách chapter để các component (như ChapterList) có thể render
  return {
    handleSubmitChapter,
    handleStoryChange,
    handleChange,
    storyInputRef,
    storyFile,
    isLoading,
    pageCount,
    isReadingPdf
  }
}

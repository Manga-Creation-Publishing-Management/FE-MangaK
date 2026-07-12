
import { useEffect, useRef, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Hook tự tạo (Custom hook) dùng để lấy chi tiết của một chapter cụ thể
export function useChapterDetail(seriesId, chapterId) {
  // State lưu trữ dữ liệu chi tiết của chapter sau khi gọi API thành công
  const [chapterDetail, setChapterDetail] = useState(null);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useToast();

  const [reload, setReload] = useState(false);

  const [pageNums, setPageNums] = useState(0);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleStoryChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoryFile(file);

      if (file.type === "application/pdf") {
        try {
          // Chuyển file thành dạng array buffer để pdfjs có thể đọc
          const arrayBuffer = await file.arrayBuffer();
          // Lấy thông tin tài liệu PDF
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;

          // Lưu số trang vào state
          setPageNums(pdf.numPages);
          console.log("Số trang PDF là:", pdf.numPages);

        } catch (error) {
          console.error("Lỗi khi đếm số trang PDF:", error);
          showAlert("Can't read PDF pages.", "warning");
        }
      }
    }
  };


  // useEffect sẽ tự động chạy mỗi khi component sử dụng hook này được render lần đầu,
  // hoặc mỗi khi 'chapterId' thay đổi
  useEffect(() => {
    // Hàm fetchChapterDetail được khai báo bên trong useEffect để gọi API bất đồng bộ
    const fetchChapterDetail = async () => {
      // Nếu không có chapterId (chưa có data hoặc id lỗi), thì dừng và không gọi API
      if (!chapterId) return;
      try {
        // Gọi API lấy thông tin chi tiết của chapter thông qua service
        const response = await chaptersService.getChapterDetailById(seriesId, chapterId);
        // Cập nhật state với dữ liệu trả về từ server
        setChapterDetail(response.data);
      } catch (error) {
        // Bắt lỗi nếu API thất bại (lỗi mạng, sai ID,...)
        console.log("Lỗi:", error);
      }
    };
    // Gọi hàm fetch
    fetchChapterDetail();
  }, [chapterId, reload]); // Dependency array: Effect này phụ thuộc vào chapterId

  const handleSubmitChapter = async () => {
    if (!chapterId) {
      showAlert("TaskId does not exist");
      return;
    }
    if (!storyFile) {
      showAlert("Please select a file before submitting!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("Status", "Created");
      formData.append("ChapterFileUrl", storyFile);
      formData.append("TotalPage", pageNums);
      const response = await chaptersService.submitChapter(seriesId, chapterId, formData);
      console.log("Submit chapter thành công:", response);

      // Cập nhật lại status hiển thị thành "Pending""


      showAlert("Chapter submitted successfully!");
      handleReload();
      // setStoryFile(null); // Reset lại file đã chọn sau khi nộp thành công
    } catch (error) {
      console.error("Lỗi khi submit chapter:", error);
      showAlert("Submitting chapter failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Trả về dữ liệu chi tiết để component giao diện có thể sử dụng
  return {
    chapterDetail,
    setChapterDetail,
    storyFile,
    storyInputRef,
    handleStoryChange,
    // chapterListForm,
    handleSubmitChapter,
    isLoading,
    handleReload
  }
}

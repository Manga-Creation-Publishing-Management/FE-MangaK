
import { useEffect, useRef, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";

// Hook tự tạo (Custom hook) dùng để lấy chi tiết của một chapter cụ thể
export function useChapterDetail(seriesId, chapterId) {
  // State lưu trữ dữ liệu chi tiết của chapter sau khi gọi API thành công
  const [chapterDetail, setChapterDetail] = useState(null);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useToast();

  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoryFile(e.target.files[0]);
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
      showAlert("TaskId không tồn tại");
      return;
    }
    if (!storyFile) {
      showAlert("Vui lòng chọn file trước khi nộp bài!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("Status", "Created");
      formData.append("ChapterFileUrl", storyFile);
      const response = await chaptersService.submitChapter(seriesId, chapterId, formData);
      console.log("Submit chpater thành công:", response);

      // Cập nhật lại status hiển thị thành "Submitted" (hoặc trạng thái tương ứng phía Backend)


      showAlert("Submit chapter thành công!");
      handleReload();
      // setStoryFile(null); // Reset lại file đã chọn sau khi nộp thành công
    } catch (error) {
      console.error("Lỗi khi submit chapter:", error);
      showAlert("Nộp Chapter thất bại: " + error.message);
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

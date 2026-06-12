
import { useEffect, useState } from "react";
import { chaptersService } from "../../../services/chapterService";

// Hook tự tạo (Custom hook) dùng để lấy chi tiết của một chapter cụ thể
export function useChapterDetail(seriesId, chapterId) {
  // State lưu trữ dữ liệu chi tiết của chapter sau khi gọi API thành công
  const [chapterDetail, setChapterDetail] = useState(null);

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
  }, [chapterId]); // Dependency array: Effect này phụ thuộc vào chapterId

  // Trả về dữ liệu chi tiết để component giao diện có thể sử dụng
  return {
    chapterDetail,
    setChapterDetail
    // chapterListForm
  }
}

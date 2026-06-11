import { useEffect, useState } from "react";
import { chaptersService } from "../../../services/chapterService";

// Hook tự tạo (Custom hook) dùng để lấy danh sách toàn bộ chapter của một bộ truyện (series)
export function useCreateChapter(seriesId) {
  // State lưu trữ danh sách các chapter thuộc bộ truyện
  const [chapterList, setChapterList] = useState([]);

  // useEffect tự động fetch danh sách chapter mỗi khi component render hoặc khi seriesId thay đổi
  useEffect(() => {
    const fetchApi = async e => {
      // Nếu chưa có seriesId, không gọi API
      if (!seriesId) return;
      try {
        // Gọi service để lấy toàn bộ danh sách chapter bằng seriesId
        const resultChapterList = await chaptersService.getAllSeriesBySeriesId(seriesId);
        
        // Cập nhật state bằng dữ liệu lấy về từ API
        setChapterList(resultChapterList.data);
        console.log("..", resultChapterList.data)
      } catch (error) {
        // Hiển thị thông báo lỗi nếu quá trình lấy dữ liệu thất bại
        console.error("Error fetching chapters:", error);
      }
    }
    // Thực thi hàm lấy dữ liệu
    fetchApi();
  }, [seriesId]) // Dependency array: Hook sẽ gọi lại API nếu seriesId bị đổi

  // Trả về danh sách chapter để các component (như ChapterList) có thể render
  return {
    chapterList,
  }
}
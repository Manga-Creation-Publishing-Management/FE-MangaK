import { useEffect, useRef, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
import dayjs from "dayjs";

export function useCreateChapter(seriesId, onClose, onReload) {
  const [chapterListForm, setChapterListForm] = useState({});
  const [seriesData, setSeriesData] = useState([]);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoryFile(e.target.files[0]);
    }
  };


  const handleChange = (e) => {
    // console.log(e);
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
    // 1. Khởi tạo một đối tượng FormData trống hoàn toàn
    const formDataToSend = new FormData();

    // 2. Append các chuỗi text thông thường (Lưu ý: Viết hoa chữ cái đầu y hệt Swagger)
    formDataToSend.append("Title", formElement.elements["Title"].value);
    formDataToSend.append("Summary", formElement.elements["Summary"].value);

    // 3. Xử lý định dạng Deadline và append vào FormData
    const rawDeadline = formElement.elements["deadline"].value;
    if (rawDeadline) {
      const formattedDeadline = dayjs(rawDeadline).toISOString();
      formDataToSend.append("Deadline", formattedDeadline);
    }

    // 4. Append FILE NHỊ PHÂN thực tế (Lấy từ state storyFile đã chọn)
    if (storyFile) {
      // Key "ManuscriptFileUrl" phải trùng khớp hoàn toàn với tên biến bên Swagger
      formDataToSend.append("ManuscriptFileUrl", storyFile);
    }

    // console.log("du lieu tra ve", chapterData);
    try {
      // 4. Gọi qua API client mới: api.post chứ không dùng post() lẻ loi nữa
      const results = await chaptersService.createChapter(seriesId, formDataToSend);

      

      if (results) {
        alert("Created successfully!");
        setTimeout(() => {
          onClose();
          onReload();
        }, 0);
      } else {
        alert(results?.Message || "Failed to create chapter");
      }
    } catch (error) {
      alert(error.response?.data?.Message || "Error creating chapter");
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
    isLoading
  }
}
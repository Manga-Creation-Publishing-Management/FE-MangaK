import { useEffect, useRef, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";

export function useCreateChapter(seriesId, onClose, onReload) {
  const { showAlert } = useToast();
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

    if (!chapterListForm.Title?.trim()) {
      showAlert("Title is required", "warning");
      return;
    }
    if (!storyFile) {
      showAlert("Manuscript file is required", "warning");
      return;
    }

    const formData = new FormData();

    Object.keys(chapterListForm).forEach((key) => {
      formData.append(key, chapterListForm[key]);
    });
    if (storyFile) formData.append("ManuscriptFileUrl", storyFile); // File truyện thật

    try {
      // 4. Gọi qua API client mới: api.post chứ không dùng post() lẻ loi nữa
      const results = await chaptersService.createChapter(seriesId, formData);

      if (results) {
        showAlert("Created successfully!");
        setTimeout(() => {
          onClose();
          onReload();
        }, 0);
      } else {
        showAlert(results?.Message || "Failed to create chapter", "error");
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
    isLoading
  }
}
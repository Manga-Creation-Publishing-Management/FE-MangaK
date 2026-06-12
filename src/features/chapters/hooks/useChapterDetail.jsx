
import { useEffect, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
export function useChapterDetail(seriesId, chapterId) {
  const [chapterDetail, setChapterDetail] = useState(null);


  useEffect(() => {
    const fetchChapterDetail = async () => {
      if (!chapterId) return;
      try {
        const response = await chaptersService.getChapterDetailById(seriesId, chapterId);
        setChapterDetail(response.data);
      } catch (error) {
        console.log("Lỗi:", error);
      }
    };
    fetchChapterDetail();
  }, [chapterId]);

  return {
    chapterDetail,
    setChapterDetail
    // chapterListForm
  }
}


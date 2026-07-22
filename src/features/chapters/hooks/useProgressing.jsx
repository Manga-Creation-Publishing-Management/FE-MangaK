import { useEffect, useState } from "react";
import { chaptersService } from "../../../services/chapterService";

export function useProgressing(chapterId) {
  const [progress, setProgressing] = useState(0);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const completedChapter = await chaptersService.getProgressingChapter(chapterId, "Completed");
        const unsatisChapter = await chaptersService.getProgressingChapter(chapterId, "Unsatisfactory");
        const total = completedChapter?.data?.total + unsatisChapter?.data?.total || 0;
        const numberOfStatus = completedChapter?.data?.numberOfStatus + unsatisChapter?.data?.numberOfStatus || 0;

        if (total > 0) {
          let currentProgressing = (numberOfStatus / total) * 100;
          setProgressing(currentProgressing);
        } else {
          setProgressing(0);
        }
      } catch (error) {
        console.log("lỗi khi lấy tiến độ: ", error);
        setProgressing(0);
      }
    }
    fetchApi();
  }, [chapterId])

  return {
    progress
  }
}
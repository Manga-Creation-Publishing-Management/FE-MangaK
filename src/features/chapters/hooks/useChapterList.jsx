import { useEffect, useState } from "react";
import { chaptersService } from "@/services/chapterService";

export function useChapterList(seriesId, reload) {
  const [chapterList, setChapterList] = useState([]);
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);

  const handleShowChapterModal = () => {
    setShowCreateChapterModal(!showCreateChapterModal);
  };

  useEffect(() => {
    const fetchApi = async () => {
      if (!seriesId) return;
      try {
        const resultChapterList = await chaptersService.getAllSeriesBySeriesId(seriesId);
        setChapterList(resultChapterList.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };
    fetchApi();
  }, [seriesId, reload]);

  return {
    chapterList,
    showCreateChapterModal,
    handleShowChapterModal,
  };
}
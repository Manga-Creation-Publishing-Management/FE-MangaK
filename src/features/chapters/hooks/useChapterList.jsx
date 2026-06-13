import { useEffect, useRef, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
// import { get } from "../../shared/requests";

export function useChapterList(seriesId, reload) {
  const [chapterList, setChapterList] = useState([]);
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);
  const [storyFile, setStoryFile] = useState(null);


  const handleShowChapterModal = () => {
    setShowCreateChapterModal(!showCreateChapterModal);
  }

  useEffect(() => {
    const fetchApi = async e => {
      if (!seriesId) return;
      try {
        const resultChapterList = await chaptersService.getAllSeriesBySeriesId(seriesId);
        // const resultChapterListForm = await get("chapter");
        setChapterList(resultChapterList.data);
        // setChapterListForm(resultChapterListForm);
        console.log("..", resultChapterList.data)
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    }
    fetchApi();
  }, [seriesId, reload])



  return {
    chapterList,
    showCreateChapterModal,
    handleShowChapterModal,
  }
}
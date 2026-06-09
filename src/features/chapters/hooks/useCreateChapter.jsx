import { useEffect, useState } from "react";
import { chaptersService } from "../../../services/chapterService";
// import { get } from "../../shared/requests";

export function useCreateChapter(seriesId) {
  const [chapterList, setChapterList] = useState([]);
  // const [chapterListForm, setChapterListForm] = useState({});

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
  }, [seriesId])

  return {
    chapterList,
    // chapterListForm
  }
}
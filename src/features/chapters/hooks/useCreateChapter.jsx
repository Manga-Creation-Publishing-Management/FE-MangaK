import { useEffect, useState } from "react";
// import { get } from "../../shared/requests";

export function useCreateChapter(seriesData) {
  const [chapterList, setChapterList] = useState([]);
  const [chapterListForm, setChapterListForm] = useState({});

  useEffect(() => {
    const fetchApi = async e => {
      if (!seriesData || !seriesData.id) return;
      try {
        const resultChapterList = await get(`chapter?seriesId:contains=${seriesData.id}`);
        const resultChapterListForm = await get("chapter");
        setChapterList(resultChapterList.reverse());
        setChapterListForm(resultChapterListForm);
        console.log("..", resultChapterList)
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    }
    fetchApi();
  }, [seriesData])
  
  return {
    chapterList,
    chapterListForm
  }
}
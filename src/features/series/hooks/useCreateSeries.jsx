import { useEffect, useRef, useState } from "react";
// import { get, post } from "../../shared/requests";
import { api } from "../../../services/api";
import { seriesService } from "../../../services/seriesService";

export default function useCreateSeries(onClose, onReload, reloadState ) {

  const [genreList, setGenreList] = useState([]); 
  const [selectGenres, setSelectGenres] = useState([]);
  const [formSeriesData, setFormSeriesData] = useState({});
  const [seriesData, setSeriesData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [storyFile, setStoryFile] = useState(null);

  const coverInputRef = useRef(null);
  const storyInputRef = useRef(null);

  useEffect(() => {
    const fetchApi = async () => {
      const resultsGenre = await seriesService.getAllCategory();
      const resultsSeries = await seriesService.getAllSeries();
      setGenreList(resultsGenre.data);
      setSeriesData(resultsSeries.data.toReversed());
    };
    fetchApi();
  }, [reloadState])
  

  const handleActive = (genreId) => {
    if (selectGenres.includes(genreId)) {
      setSelectGenres(selectGenres.filter(id => id !== genreId))
    } else {
      setSelectGenres([...selectGenres, genreId]);
      
    }
  }

  const handleChange = (e) => {
    // console.log(e);
    const name = e.target.name;
    const value = e.target.value;
    setFormSeriesData({
      ...formSeriesData,
      [name]: value,
    })
  }

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoryFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    Object.keys(formSeriesData).forEach((key) => {
      formData.append(key, formSeriesData[key]);
    });

    if (selectGenres && selectGenres.length > 0) {
      selectGenres.forEach((id) => {
        formData.append("CategoryIds", id);
      });
    }

    if (coverFile) formData.append("coverFile", coverFile); // File ảnh thật
    if (storyFile) formData.append("nameFile", storyFile); // File truyện thật

    try {
      // 4. Gọi qua API client mới: api.post chứ không dùng post() lẻ loi nữa
      const results = await seriesService.createSeries(formData);

      if (results) {
        alert("Created successfully!");
        setTimeout(() => {
          onClose();
          onReload();
        }, 500);
      }
    } catch (error) {
      console.log("Error tại hook:", error);
    } finally {
      setIsLoading(false);
    }

    
  };
  return {
    isLoading,
    genreList,
    selectGenres,
    coverFile,
    storyFile,
    coverInputRef,
    storyInputRef,
    seriesData,
    formSeriesData,
    handleActive,
    handleChange,
    handleCoverChange,
    handleStoryChange,
    handleSubmit,
  };
}
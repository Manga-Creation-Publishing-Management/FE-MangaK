import { useEffect, useRef, useState } from "react";
// import { get, post } from "../../shared/requests";
import { api } from "../../../services/api";

export default function useCreateSeries(onClose, onReload ) {

  // const [genreList, setGenreList] = useState([]);
  const [selectGenres, setSelectGenres] = useState([]);
  const [formSeriesData, setFormSeriesData] = useState({});
  const [seriesData, setSeriesData] = useState([]);

  const [coverFile, setCoverFile] = useState(null);
  const [storyFile, setStoryFile] = useState(null);

  const coverInputRef = useRef(null);
  const storyInputRef = useRef(null);

  useEffect(() => {
    const fetchApi = async () => {
      // const resultsGenre = await api.get("genre");
      const resultsSeries = await api.get("/Series/get-all-series");
      // setGenreList(resultsGenre);
      setSeriesData(resultsSeries.data.reverse());
    };
    fetchApi();
  }, [])
  

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

    const formData = new FormData();

    Object.keys(formSeriesData).forEach((key) => {
      formData.append(key, formSeriesData[key]);
    });

    formData.append("genres", JSON.stringify(selectGenres));

    if (coverFile) formData.append("coverFile", coverFile); // File ảnh thật
    if (storyFile) formData.append("storyFile", storyFile); // File truyện thật

    try {
      // 4. Gọi qua API client mới: api.post chứ không dùng post() lẻ loi nữa
      const results = await api.post("/Series/create-series", formData);

      if (results) {
        onClose();
        alert("Created successfully!");
        onReload();
      }
    } catch (error) {
      console.log("Error tại hook:", error);
    }

    
  };
  return {
    // genreList,
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

 
// const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();

  //   // Thêm các field text thông thường
  //   formData.append("title", seriesData.title || "");
  //   formData.append("description", seriesData.description || "");

  //   // Thêm mảng genres (Thường server sẽ nhận dạng chuỗi JSON hoặc append từng item)
  //   formData.append("genres", JSON.stringify(selectGenres));

  //   // Thêm 2 file vào formData (nếu có)
  //   if (coverFile) {
  //     formData.append("coverPage", coverFile); // 'coverPage' là key phía backend nhận
  //   }
  //   if (storyFile) {
  //     formData.append("storyFile", storyFile); // 'storyFile' là key phía backend nhận
  //   }

  //   // Lưu ý: DummyJSON (https://dummyjson.com/products/add) chỉ là API giả lập mock, 
  //   // nó có thể không lưu hoặc không hiển thị đúng file bạn tải lên, nhưng logic này chuẩn 100% cho các dự án thực tế.
  //   fetch("https://dummyjson.com/products/add", {
  //     method: "POST",
  //     // CHÚ Ý: KHÔNG ĐỂ "Content-Type": "application/json" khi gửi FormData. 
  //     // Trình duyệt sẽ tự động thêm Content-Type là multipart/form-data cùng với boundary.
  //     headers: {
  //       Accept: "application/json",
  //     },
  //     body: formData
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data) {
  //         onClose();
  //       }
  //     })
  //     .catch(err => console.error("Error upload:", err));
  // }
import { useEffect, useRef, useState } from 'react';
import { seriesService } from '@/services/seriesService';
import { useToast } from '@/shared/hooks/useToast';

export default function useCreateSeries(onClose, onReload, reloadState) {
  const { showAlert } = useToast();

  const [genreList, setGenreList] = useState([]);
  
  const [selectGenres, setSelectGenres] = useState([]);
  
  const [formSeriesData, setFormSeriesData] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [storyFile, setStoryFile] = useState(null);

  const coverInputRef = useRef(null);
  const storyInputRef = useRef(null);

  const [image, setImage] = useState("");
  const [croppedFile, setCroppedFile] = useState(null);
  const cropperRef = useRef(null);

  useEffect(() => {
    const fetchApi = async () => {
      
      const resultsGenre = await seriesService.getAllCategory();

      setGenreList(resultsGenre.data);
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
    const name = e.target.name;   
    const value = e.target.value; 
    setFormSeriesData({
      ...formSeriesData, 
      [name]: value,     
    })
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoryFile(e.target.files[0]);
    }
  };
  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas({
      width: 900,
      height: 1200,
      fillColor: "#fff",
    }).toBlob((blob) => {
      const file = new File([blob], "cover-cropped.jpg", {
        type: "image/jpeg",
      });
      setCroppedFile(file);
      setCoverFile(file);
      showAlert("Cropped successfully!");
    }, "image/jpeg");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = formSeriesData.title?.trim();
    const description = formSeriesData.description?.trim();

    if (!title || !description || selectGenres.length === 0 || !croppedFile || !storyFile) {
      showAlert("Please enter all information");
      return;
    }

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

    if (croppedFile) formData.append("coverFile", croppedFile); 
    if (storyFile) formData.append("nameFile", storyFile);  

    try {
      
      const results = await seriesService.createSeries(formData);

      if (results) {
        showAlert("Created successfully!");
        
        setTimeout(() => {
          onClose();
          onReload();
        }, 0);
      }
    } catch (error) {
      
      console.log("Error tại hook:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  return {
    genreList,
    selectGenres,
    coverFile,
    storyFile,
    coverInputRef,
    storyInputRef,
    formSeriesData,
    handleActive,
    handleChange,
    handleCoverChange,
    handleStoryChange,
    handleSubmit,
    getCroppedImage,
    cropperRef,
    image
  };

}
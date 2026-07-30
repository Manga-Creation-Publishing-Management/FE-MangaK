
import { useEffect, useRef, useState } from 'react';
import { chaptersService } from '@/services/chapterService';
import { useToast } from '@/shared/hooks/useToast';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function useChapterDetail(seriesId, chapterId) {
  
  const [chapterDetail, setChapterDetail] = useState(null);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useToast();

  const [reload, setReload] = useState(false);

  const [pageNums, setPageNums] = useState(0);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleStoryChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoryFile(file);

      if (file.type === "application/pdf") {
        try {
          
          const arrayBuffer = await file.arrayBuffer();
          
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;

          setPageNums(pdf.numPages);

        } catch (error) {
          console.error("Lỗi khi đếm số trang PDF:", error);
          showAlert("Can't read PDF pages.", "warning");
        }
      }
    }
  };

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
  }, [chapterId, reload]); 

  const handleSubmitChapter = async () => {
    if (!chapterId) {
      showAlert("TaskId does not exist");
      return;
    }
    if (!storyFile) {
      showAlert("Please select a file before submitting!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("Status", "Created");
      formData.append("ChapterFileUrl", storyFile);
      formData.append("TotalPage", pageNums);
      const response = await chaptersService.submitChapter(seriesId, chapterId, formData);

      showAlert("Chapter submitted successfully!");
      handleReload();
    } catch (error) {
      console.error("Lỗi khi submit chapter:", error);
      showAlert("Submitting chapter failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    chapterDetail,
    setChapterDetail,
    storyFile,
    storyInputRef,
    handleStoryChange,
    
    handleSubmitChapter,
    isLoading,
    handleReload
  }
}

import { useRef, useState } from 'react';
import { chaptersService } from '@/services/chapterService';
import { useToast } from '@/shared/hooks/useToast';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export function useCreateChapter(seriesId, onClose, onReload) {
  const { showAlert } = useToast();
  const [chapterListForm, setChapterListForm] = useState({});
  const [seriesData, setSeriesData] = useState([]);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [pageCount, setPageCount] = useState(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);

  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoryFile(file);
      setPageCount(null); 

      if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        setIsReadingPdf(true);

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const typedarray = new Uint8Array(event.target.result);
            
            const pdf = await pdfjs.getDocument(typedarray).promise;

            setPageCount(pdf.numPages);
          } catch (error) {
            console.error("Error parsing PDF pages:", error);
            showAlert("Cannot read PDF page count", "error");
          } finally {
            setIsReadingPdf(false);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setChapterListForm({
      ...chapterListForm,
      [name]: value,
    })
  }

  const handleSubmitChapter = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formElement = e.target;
    const summary = formElement.elements["Summary"]?.value?.trim();

    if (!chapterListForm.Title?.trim() || !summary || !storyFile) {
      showAlert("Please fill in all required fields: Title, Summary, and Manuscript File!", "error");
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    if (pageCount !== null) {
      formDataToSend.append("TotalPage", pageCount);
    }

    formDataToSend.append("Title", formElement.elements["Title"].value);
    formDataToSend.append("Summary", formElement.elements["Summary"].value);
    
    if (storyFile) {
      
      formDataToSend.append("ManuscriptFileUrl", storyFile);
    }

    try {
      
      const results = await chaptersService.createChapter(seriesId, formDataToSend);

      if (results) {
        showAlert("Created successfully!");
        setTimeout(() => {
          onClose();
          onReload();
        }, 0);
      }
    } catch (error) {
      showAlert(error.response?.data?.Message || "Error creating chapter", "error");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }

  };

  return {
    handleSubmitChapter,
    handleStoryChange,
    handleChange,
    storyInputRef,
    storyFile,
    isLoading,
    pageCount,
    isReadingPdf
  }
}

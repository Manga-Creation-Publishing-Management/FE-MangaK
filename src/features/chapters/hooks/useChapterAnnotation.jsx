import { useState, useEffect } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { feedbackService } from '@/services/feedbackService';

export function useChapterAnnotation(onClose, initialFeedbackJson = null) {
  const { showAlert } = useToast();

  const [tool, setTool] = useState('brush');
  const [annotationData, setAnnotationData] = useState({});
  const [annotationText, setAnnotationText] = useState({});

  useEffect(() => {
    if (initialFeedbackJson) {
      try {
        let parsed = initialFeedbackJson;
        if (typeof initialFeedbackJson === 'string') {
          const trimmed = initialFeedbackJson.trim();
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            parsed = JSON.parse(trimmed);
          } else {
            return;
          }
        }

        if (parsed && typeof parsed === 'object') {
          const parsedLines = {};
          const parsedTexts = {};

          Object.keys(parsed).forEach(page => {
            if (parsed[page]?.lines) parsedLines[page] = parsed[page].lines;
            if (parsed[page]?.texts) parsedTexts[page] = parsed[page].texts;
          });

          setAnnotationData(parsedLines);
          setAnnotationText(parsedTexts);
        }
      } catch (err) {
        console.warn("initialFeedbackJson is not a valid JSON annotation object:", err);
      }
    }
  }, [initialFeedbackJson]);

  const [brushColor, setBrushColor] = useState("#ef4444");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(600);
  const [pageHeight, setPageHeight] = useState(800);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const handleUndo = (pageIndex) => {
    if (tool === 'brush') {
      const currentPageLines = annotationData[pageIndex] || [];
      if (currentPageLines.length === 0) return;
      const newLines = currentPageLines.slice(0, -1);
      setAnnotationData(prev => ({
        ...prev,
        [pageIndex]: newLines
      }));
    } else if (tool === 'text') {
      const currentPageTexts = annotationText[pageIndex] || [];
      if (currentPageTexts.length === 0) return;
      const newTexts = currentPageTexts.slice(0, -1);
      setAnnotationText(prev => ({
        ...prev,
        [pageIndex]: newTexts
      }));
    }
  };

  const handleClearPage = (pageIndex) => {
    setAnnotationData(prev => ({
      ...prev,
      [pageIndex]: []
    }));
    setAnnotationText(prev => ({
      ...prev,
      [pageIndex]: []
    }));
  };

  const setPageLines = (pageIndex, newLines) => {
    setAnnotationData(prev => ({
      ...prev,
      [pageIndex]: newLines
    }));
  };

  const setPageTexts = (pageIndex, newTexts) => {
    setAnnotationText(prev => ({
      ...prev,
      [pageIndex]: newTexts
    }));
  };

  const closeModal = () => {
    setPageNumber(1);
    setIsPageLoaded(false);
    if (onClose) onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const onPageLoadSuccess = (page) => {
    const scaledHeight = page.height * (pageWidth / page.width);
    setPageHeight(scaledHeight);
    setIsPageLoaded(true);
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSubmitAnnotation = async (seriesId, chapterId, taskId, role) => {
    const combinedAnnotations = {};
    const allPages = new Set([
      ...Object.keys(annotationData),
      ...Object.keys(annotationText)
    ]);

    allPages.forEach(page => {
      combinedAnnotations[page] = {
        lines: annotationData[page] || [],
        texts: annotationText[page] || []
      };
    });

    try {
      await feedbackService.sendAnnotation(seriesId || null, chapterId || null, taskId || null, JSON.stringify(combinedAnnotations), "EditPDF");
      showAlert("Annotation submitted successfully!");
      return true;
    } catch (err) {
      console.error("Error sending annotation:", err);
      showAlert("Annotation submission failed!");
      return false;
    }
    closeModal();
  };

  return {
    tool,
    setTool,
    annotationData,
    setAnnotationData,
    annotationText,
    setAnnotationText,
    brushColor,
    setBrushColor,
    pageNumber,
    setPageNumber,
    pageWidth,
    setPageWidth,
    pageHeight,
    setPageHeight,
    isPageLoaded,
    setIsPageLoaded,
    numPages,
    setNumPages,
    handleUndo,
    handleClearPage,
    setPageLines,
    setPageTexts,
    closeModal,
    handleBackdropClick,
    onPageLoadSuccess,
    onDocumentLoadSuccess,
    handleSubmitAnnotation,
  };
}

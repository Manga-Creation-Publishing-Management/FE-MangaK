import { useState, useEffect } from 'react';
import { useToast } from "../../../shared/hooks/useToast";
import { feedbackService } from '../../../services/feedbackService';

/**
 * Custom hook quản lý các state và logic xử lý liên quan đến chức năng PDF Annotation (chú thích/vẽ).
 */
export function useChapterAnnotation(onClose, initialFeedbackJson = null) {
  const { showAlert } = useToast();

  // Chế độ chọn công cụ: 'brush' (cọ vẽ) hoặc 'text' (gõ chữ)
  const [tool, setTool] = useState('brush');

  // State lưu trữ dữ liệu vẽ (các nét vẽ) của từng trang PDF (dạng key-value với key là số trang)
  const [annotationData, setAnnotationData] = useState({});

  // State lưu trữ dữ liệu chữ của từng trang PDF (dạng key-value với key là số trang)
  const [annotationText, setAnnotationText] = useState({});

  useEffect(() => {
    if (initialFeedbackJson) {
      try {
        const parsed = JSON.parse(initialFeedbackJson);
        const parsedLines = {};
        const parsedTexts = {};
        
        Object.keys(parsed).forEach(page => {
          if (parsed[page].lines) parsedLines[page] = parsed[page].lines;
          if (parsed[page].texts) parsedTexts[page] = parsed[page].texts;
        });
        
        setAnnotationData(parsedLines);
        setAnnotationText(parsedTexts);
      } catch (err) {
        console.error("Failed to parse initialFeedbackJson:", err);
      }
    }
  }, [initialFeedbackJson]);
  // Màu sắc hiện tại của nét vẽ/chữ viết (mặc định là màu đỏ)
  const [brushColor, setBrushColor] = useState("#ef4444");

  // Trang hiện tại của file PDF đang được hiển thị
  const [pageNumber, setPageNumber] = useState(1);

  // Chiều rộng hiển thị mặc định của trang PDF (đơn vị pixel), sẽ được cập nhật lại theo container
  const [pageWidth, setPageWidth] = useState(600);

  // Chiều cao hiển thị của trang PDF (sẽ được cập nhật động theo tỉ lệ trang gốc)
  const [pageHeight, setPageHeight] = useState(800);

  // Trạng thái tải xong của trang PDF hiện tại (để bắt đầu hiển thị bảng vẽ Konva)
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Tổng số trang của file PDF hiện tại
  const [numPages, setNumPages] = useState(null);

  /**
   * Hoàn tác (xóa nét vẽ hoặc chữ cuối cùng) của trang hiện tại tùy theo công cụ đang chọn
   * @param {number} pageIndex - Số trang cần hoàn tác
   */
  const handleUndo = (pageIndex) => {
    if (tool === 'brush') {
      const currentPageLines = annotationData[pageIndex] || [];
      if (currentPageLines.length === 0) return;

      // Loại bỏ nét vẽ cuối cùng trong mảng nét vẽ
      const newLines = currentPageLines.slice(0, -1);
      setAnnotationData(prev => ({
        ...prev,
        [pageIndex]: newLines
      }));
    } else if (tool === 'text') {
      const currentPageTexts = annotationText[pageIndex] || [];
      if (currentPageTexts.length === 0) return;

      // Loại bỏ đoạn text cuối cùng được thêm vào trang
      const newTexts = currentPageTexts.slice(0, -1);
      setAnnotationText(prev => ({
        ...prev,
        [pageIndex]: newTexts
      }));
    }
  };

  /**
   * Xóa sạch toàn bộ nét vẽ và các chữ chú thích của trang hiện tại
   * @param {number} pageIndex - Số trang cần xóa sạch
   */
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

  /**
   * Cập nhật danh sách các nét vẽ mới cho một trang cụ thể
   * @param {number} pageIndex - Số trang cần cập nhật
   * @param {Array} newLines - Danh sách các nét vẽ mới
   */
  const setPageLines = (pageIndex, newLines) => {
    setAnnotationData(prev => ({
      ...prev,
      [pageIndex]: newLines
    }));
  };

  /**
   * Cập nhật danh sách các text mới cho một trang cụ thể
   * @param {number} pageIndex - Số trang cần cập nhật
   * @param {Array} newTexts - Danh sách các chữ mới
   */
  const setPageTexts = (pageIndex, newTexts) => {
    setAnnotationText(prev => ({
      ...prev,
      [pageIndex]: newTexts
    }));
  };

  /**
   * Đóng modal vẽ annotation, reset số trang hiển thị về trang 1 và xóa ô nhập chữ tạm thời
   */
  const closeModal = () => {
    setPageNumber(1);
    setIsPageLoaded(false);
    if (onClose) onClose();
  };

  /**
   * Đóng modal khi người dùng click vào vùng nền mờ phía sau modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  /**
   * Callback được gọi khi một trang PDF tải xong thành công.
   * Tính toán chiều cao hiển thị tương ứng theo tỉ lệ của trang gốc dựa trên chiều rộng hiện tại.
   */
  const onPageLoadSuccess = (page) => {
    const scaledHeight = page.height * (pageWidth / page.width);
    setPageHeight(scaledHeight);
    setIsPageLoaded(true);
  };

  /**
   * Callback được gọi khi tài liệu PDF được tải thành công
   */
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  /**
   * Gộp chung cả nét vẽ (lines) và chữ (texts) của từng trang vào một file JSON duy nhất để gửi qua API
   */
  const handleSubmitAnnotation = async (seriesId, chapterId, taskId, role) => {
    const combinedAnnotations = {};

    // Gom tất cả các trang có chỉnh sửa nét vẽ hoặc chữ
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

    console.log("TEST Combined Annotations JSON:", JSON.stringify(combinedAnnotations));
    try {
      await feedbackService.sendAnnotation(seriesId || null, chapterId || null, taskId || null, JSON.stringify(combinedAnnotations), "EditPDF");
      showAlert("Annotation submitted successfully!");
      return true;
    } catch (err) {
      console.log("TEST error:", err)
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

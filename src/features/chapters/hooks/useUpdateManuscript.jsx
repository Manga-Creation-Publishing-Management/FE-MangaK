import { useState, useRef } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { chaptersService } from "../../../services/chapterService";
import { pdfjs } from "react-pdf";

// Đặt workerSrc để pdfjs hoạt động
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function useUpdateManuscript(seriesId, chapterId, onUpdateSuccess) {
  const [isEditingManuscript, setIsEditingManuscript] = useState(false);
  const [manuscriptFile, setManuscriptFile] = useState(null);
  const [pageNums, setPageNums] = useState(0); // State lưu số trang
  const [isUpdating, setIsUpdating] = useState(false);
  const manuscriptInputRef = useRef(null);
  const { showAlert } = useToast();

  const handleStartEditManuscript = () => setIsEditingManuscript(true);

  const handleCancelEditManuscript = () => {
    setIsEditingManuscript(false);
    setManuscriptFile(null); // Xóa file đã chọn nếu hủy
    setPageNums(0);
  };

  const handleManuscriptChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setManuscriptFile(file);

      // Xử lý đếm số trang nếu là file PDF
      if (file.type === "application/pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;
          setPageNums(pdf.numPages);
        } catch (error) {
          console.error("Lỗi khi đếm số trang PDF:", error);
          showAlert?.("Can't read PDF pages.", "warning");
        }
      }
    }
  };

  const handleSaveManuscript = async () => {
    if (!manuscriptFile) {
      showAlert?.("Please select a file to upload", "error");
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("ManuscriptFileUrl", manuscriptFile);
      // Bỏ trường Status đi để API không tưởng đây là hành động submit chapter

      // Append TotalPage để API không báo lỗi (nếu API vẫn bắt buộc)
      if (pageNums > 0) {
        formData.append("TotalPage", pageNums);
      }

      // Gọi API patch
      await chaptersService.updateChapterStatus(seriesId, chapterId, formData);

      showAlert?.("Updated manuscript successfully!", "success");
      setIsEditingManuscript(false);
      setManuscriptFile(null);
      setPageNums(0);

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Failed to update manuscript:", error);
      showAlert?.("Failed to update manuscript. Please try again.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditingManuscript,
    manuscriptFile,
    isUpdating,
    manuscriptInputRef,
    handleStartEditManuscript,
    handleCancelEditManuscript,
    handleManuscriptChange,
    handleSaveManuscript,
  };
}

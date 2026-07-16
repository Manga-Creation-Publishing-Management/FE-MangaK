import { useState, useEffect } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { taskService } from "../../../services/taskService";
import dayjs from "dayjs";

export function useUpdateTaskDeadline(taskId, initialDeadline, onUpdateSuccess) {
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [deadlineValue, setDeadlineValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { showAlert } = useToast();

  // Cập nhật dữ liệu ban đầu từ taskDetail khi có sự thay đổi
  useEffect(() => {
    if (initialDeadline) {
      setDeadlineValue(initialDeadline);
    }
  }, [initialDeadline]);

  const handleStartEditDeadline = () => setIsEditingDeadline(true);
  const handleCancelEditDeadline = () => {
    setIsEditingDeadline(false);
    setDeadlineValue(initialDeadline || ""); // Reset về giá trị cũ nếu hủy
  };

  const handleSaveDeadline = async () => {
    if (!deadlineValue) {
      showAlert?.("Deadline cannot be empty", "error");
      return;
    }

    setIsUpdating(true);
    try {
      // Chuyển đổi định dạng từ ô input thành chuỗi ISO string gửi cho backend
      const formattedDeadline = dayjs(deadlineValue).toISOString();

      // Gọi API với data đã chuẩn hóa đúng như Swagger yêu cầu
       await taskService.updateTaskDeadline(taskId, formattedDeadline);

      showAlert?.("Updated deadline successfully!", "success");
      setIsEditingDeadline(false);

      if (onUpdateSuccess) {
        onUpdateSuccess(formattedDeadline);
      }
    } catch (error) {
      console.error("Failed to update deadline:", error);
      showAlert?.("Failed to update deadline. Please try again.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditingDeadline,
    deadlineValue,
    setDeadlineValue,
    isUpdating,
    handleStartEditDeadline,
    handleCancelEditDeadline,
    handleSaveDeadline,
  };
}
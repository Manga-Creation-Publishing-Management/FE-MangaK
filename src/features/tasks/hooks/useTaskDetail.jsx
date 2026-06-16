import { useEffect, useState, useRef } from "react"
import { taskService } from "../../../services/taskService";

export function useTaskDetail(taskId) {
  
  const [taskDetail, setTaskDetail] = useState(null);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);


  const handleStoryChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStoryFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await taskService.getTaskDetail(taskId);
        setTaskDetail(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách task:", error);
      }
    }
    fetchApi();
  }, [])
  
  const handleGetTask = async () => {
    if (!taskId) {
      alert("TaskId không tồn tại");
      return;
    }

    setIsLoading(true);
    try {
      const response = await taskService.updateTaskStatus(taskId, "Processing");
      console.log("Update status thành công:", response);

      // Cập nhật state taskDetail với status mới
      setTaskDetail({
        ...taskDetail,
        status: "Processing"
      });

      alert("Bạn đã nhận task này!");
    } catch (error) {
      console.error("Lỗi khi cập nhật status:", error);
      alert("Cập nhật thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return {
    taskDetail,
    storyFile,
    storyInputRef,
    handleStoryChange,
    handleGetTask,      // ← Thêm hàm này
    isLoading
  }
}
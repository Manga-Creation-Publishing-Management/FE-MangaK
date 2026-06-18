import { useEffect, useState, useRef } from "react"
import { taskService } from "../../../services/taskService";
import { useToast } from "../../../shared/hooks/useToast";

export function useTaskDetail(taskId, role) {
  const { showAlert } = useToast();

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
      showAlert("TaskId không tồn tại", "error");
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

      showAlert("Bạn đã nhận task này!");
    } catch (error) {
      console.error("Lỗi khi cập nhật status:", error);
      showAlert("Cập nhật thất bại: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovedTask = async () => {
    if (!taskId) {
      alert("TaskId không tồn tại");
      return;
    }

    setIsLoading(true);
    try {
      const response = await taskService.approvedTask(taskId);
      console.log("Update status thành công:", response);

      // Cập nhật state taskDetail với status mới

      alert("Approved Task!")


    } catch (error) {
      console.error("Lỗi khi cập nhật status:", error);
      alert("Cập nhật thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTask = async () => {
    if (!taskId) {
      alert("TaskId không tồn tại");
      return;
    }
    if (!storyFile) {
      alert("Vui lòng chọn file trước khi nộp bài!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("TaskId", taskId);
      formData.append("SubmittedFileUrl", storyFile);
      const response = await taskService.submitTask(formData);
      console.log("Submit task thành công:", response);

      // Cập nhật lại status hiển thị thành "Submitted" (hoặc trạng thái tương ứng phía Backend)


      alert("Nộp bài (Submit task) thành công!");
      // setStoryFile(null); // Reset lại file đã chọn sau khi nộp thành công
    } catch (error) {
      console.error("Lỗi khi submit task:", error);
      alert("Nộp bài thất bại: " + error.message);
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
    isLoading,
    handleSubmitTask,
    handleApprovedTask
  }
}
import { useEffect, useState, useRef } from "react"
import { taskService } from "../../../services/taskService";
import { useToast } from "../../../shared/hooks/useToast";


export function useTaskDetail(taskId, role) {
  const { showAlert } = useToast();
  const [feedback, setFeedback] = useState("");

  const [taskDetail, setTaskDetail] = useState(null);

  const [storyFile, setStoryFile] = useState(null);

  const storyInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  }


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
  }, [taskId, reload])

  const handleGetTask = async () => {
    if (!taskId) {
      showAlert("Task ID does not exist", "error");
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

      showAlert("You have claimed this task!");
    } catch (error) {
      console.error("Lỗi khi cập nhật status:", error);
      showAlert("Update failed: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovedTask = async () => {
    if (!taskId) {
      showAlert("Task ID does not exist");
      return;
    }

    setIsLoading(true);
    try {
      const response = await taskService.approvedTask(taskId);
      console.log("Update status thành công:", response);

      // Cập nhật state taskDetail với status mới

      showAlert("Approved Task!")
      handleReload();


    } catch (error) {
      console.error("Lỗi khi cập nhật status:", error);
      showAlert("Update failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectTask = async () => {
    if (!taskId) {
      showAlert("Task ID does not exist");
      return;
    }

    setIsLoading(true);
    try {
      const response = await taskService.rejectTask(taskId, feedback);
      console.log("Update status thành công:", response);

      // Cập nhật state taskDetail với status mới

      showAlert("Reject Task!")
      handleReload();


    } catch (error) {
      console.error("Lỗi khi cập nhật status:", error);
      showAlert("Update failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTask = async () => {
    if (!taskId) {
      showAlert("Task ID does not exist");
      return;
    }
    if (!storyFile) {
      showAlert("Please select a file before submitting!");
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


      showAlert("Submitted task successfully!");
      handleReload();
      // setStoryFile(null); // Reset lại file đã chọn sau khi nộp thành công
    } catch (error) {
      console.error("Lỗi khi submit task:", error);
      showAlert("Failed to submit task: " + error.message);
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
    feedback,
    setFeedback,
    handleSubmitTask,
    handleApprovedTask,
    handleRejectTask
  }
}
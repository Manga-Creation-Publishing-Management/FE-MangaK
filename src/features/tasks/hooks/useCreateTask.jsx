import { use, useEffect, useState } from "react"
import { taskService } from "../../../services/taskService";
import { seriesService } from "../../../services/seriesService";
import { chaptersService } from "../../../services/chapterService";
import dayjs from 'dayjs';
import { useToast } from "../../../shared/hooks/useToast";

export function useCreateTask() {
  const { showAlert } = useToast();

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAssistantList, setShowAsssitantList] = useState([]);

  const [showSeriesApproval, setShowSeriesApproval] = useState([]);

  const [chapters, setChapters] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState('');

  const handleReload = () => {
    setReload(!reload);
  }



  const handleShowCreateTaskModal = () => {
    setShowCreateTaskModal(!showCreateTaskModal);
    if (showCreateTaskModal) {
      setSelectedSeriesId('');
      setSelectedChapterId('');
      setChapters([]);
    }
  }

  useEffect(() => {
    const fetchApi = async () => {
      const response = await taskService.getAssistantList("Assistant");
      setShowAsssitantList(response.data);
      console.log(response);
    }
    fetchApi();
  }, [])


  useEffect(() => {
    const fetchApi = async () => {

      let resultPublishing = [];
      let resultScheduled = [];
      // Gọi API Publishing bằng try-catch riêng biệt
      try {
        const seriesPublishing = await seriesService.getSeriesByStatus("Publishing");
        resultPublishing = seriesPublishing?.data ? seriesPublishing.data : [];
      } catch (error) {
        console.warn("Publishing series not found or an error occurred:", error);
      }

      // Gọi API Scheduled bằng try-catch riêng biệt
      try {
        const seriesScheduled = await seriesService.getSeriesByStatus("Scheduled");
        resultScheduled = seriesScheduled?.data ? seriesScheduled.data : [];
      } catch (error) {
        console.warn("Scheduled series not found or an error occurred:", error);
      }


      // Gộp 2 mảng lại thành một mảng duy nhất và cập nhật vào State
      setShowSeriesApproval([...resultPublishing, ...resultScheduled]);
    }
    fetchApi();
  }, [])

  useEffect(() => {
    if (selectedSeriesId) {
      const fetchChapters = async () => {
        try {
          const response = await chaptersService.getAllSeriesBySeriesId(selectedSeriesId);
          setChapters(response?.data?.filter(item => (item?.status?.toLowerCase() === "created" || item?.status?.toLowerCase() === "processing")) || []);
        } catch (error) {
          console.error("Lỗi khi load chapters:", error);
          setChapters([]);
        }
      };
      fetchChapters();
    }
  }, [selectedSeriesId]);

  const currentSelectedChapter = chapters.find(c => c.chapterId === selectedChapterId);
  const maxPagesAllowed = currentSelectedChapter ? currentSelectedChapter.totalPage : null;


  const handleSubmitCreateTask = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const allFields = Object.fromEntries(formData.entries());

    // Định dạng lại deadline sang ISO String
    const formattedDeadline = allFields.deadline ? dayjs(allFields.deadline).toISOString() : null;

    // Xây dựng Object JSON khớp hoàn toàn với cấu trúc Swagger
    const taskData = {
      seriesId: allFields.seriesId || null,
      taskTitle: allFields.taskTitle || null,
      from: allFields.fromPage ? Number(allFields.fromPage) : 0,
      to: allFields.toPage ? Number(allFields.toPage) : 0,
      deadline: formattedDeadline,
      chapterId: allFields.chapterId || null,
      assignedToId: allFields.assignedToId || null, // Nhận từ select name="assignedToId"
      amountIncome: allFields.amountIncome ? Number(allFields.amountIncome) : 0 // Gửi giá trị mặc định là số 0 theo yêu cầu Schema
    };

    // Log ra console để bạn kiểm tra kỹ trước khi bay lên server
    console.log("Dữ liệu chuẩn bị gửi đi:", taskData);

    // Kiểm tra nhanh các trường ID cốt lõi tránh gửi chuỗi rỗng lên DB
    if (!taskData.seriesId || !taskData.chapterId || !taskData.assignedToId || !taskData.deadline) {
      showAlert("Please choose all fields: Series, Chapter, Assistant, and Deadline!", "warning");
      return;
    }

    if (taskData.from < 1 || taskData.to < 1) {
      showAlert("Page numbers must be greater than 0!", "warning");
      setIsLoading(false);
      return;
    }

    if (taskData.from > taskData.to) {
      showAlert("'From Page' cannot be greater than 'To Page'!", "warning");
      setIsLoading(false);
      return;
    }

    if (maxPagesAllowed !== null && maxPagesAllowed !== undefined) {
      if (taskData.from > maxPagesAllowed || taskData.to > maxPagesAllowed) {
        showAlert(`Page numbers cannot exceed this chapter's limit (${maxPagesAllowed} pages)!`, "warning");
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await taskService.createTask(taskData);
      showAlert("Created task successfully!");
      handleReload();
      setShowCreateTaskModal(false);
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      showAlert("Create task failed, " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  }




  return {
    handleShowCreateTaskModal,
    showCreateTaskModal,
    showAssistantList,
    showSeriesApproval,
    chapters,
    selectedSeriesId,
    setSelectedSeriesId,
    selectedChapterId,
    setSelectedChapterId,
    maxPagesAllowed,
    handleSubmitCreateTask,
    handleReload,
    isLoading,
    reload
  }
}
import { use, useEffect, useState } from "react"
import { taskService } from "../../../services/taskService";
import { seriesService } from "../../../services/seriesService";
import { chaptersService } from "../../../services/chapterService";
import dayjs from 'dayjs';

export function useCreateTask() {

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAssistantList, setShowAsssitantList] = useState([]);

  const [showSeriesApproval, setShowSeriesApproval] = useState([]); 

  const [chapters, setChapters] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');

  const handleShowCreateTaskModal = () => {
    setShowCreateTaskModal(!showCreateTaskModal);
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

      let resultApproved = [];
      let resultPublishing = [];

      // Gọi API Approved bằng try-catch riêng biệt
      try {
        const seriesApproved = await seriesService.getSeriesByStatus("Approved");
        resultApproved = seriesApproved?.data ? seriesApproved.data : [];
      } catch (error) {
        console.warn("Không tìm thấy series Approved hoặc có lỗi xảy ra:", error);
      }

      // Gọi API Publishing bằng try-catch riêng biệt
      // try {
      //   const seriesPublishing = await seriesService.getSeriesByStatus("Publishing");
      //   resultPublishing = seriesPublishing?.data ? seriesPublishing.data : [];
      // } catch (error) {
      //   console.warn("Không tìm thấy series Publishing hoặc có lỗi xảy ra:", error);
      // }

      // Gộp 2 mảng lại thành một mảng duy nhất và cập nhật vào State
      setShowSeriesApproval([...resultApproved]);
    }
    fetchApi();
  }, [])

  useEffect(() => {
    if (selectedSeriesId) {
      const fetchChapters = async () => {
        try {
          const response = await chaptersService.getAllSeriesBySeriesId(selectedSeriesId);
          setChapters(response?.data || []);
        } catch (error) {
          console.error("Lỗi khi load chapters:", error);
          setChapters([]);
        }
      };
      fetchChapters();
    }
  }, [selectedSeriesId]);


  const handleSubmitCreateTask = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const allFields = Object.fromEntries(formData.entries());

    // Định dạng lại deadline sang ISO String
    const formattedDeadline = allFields.deadline ? dayjs(allFields.deadline).toISOString() : null;

    // Xây dựng Object JSON khớp hoàn toàn với cấu trúc Swagger
    const taskData = {
      seriesId: allFields.seriesId || null,
      taskTitle: "hehe",
      page_range: allFields.page_range || "",
      deadline: formattedDeadline,
      chapterId: allFields.chapterId || null,
      assignedToId: allFields.assignedToId || null, // Nhận từ select name="assignedToId"
      amountIncome: 20 // Gửi giá trị mặc định là số 0 theo yêu cầu Schema
    };

    // Log ra console để bạn kiểm tra kỹ trước khi bay lên server
    console.log("Dữ liệu chuẩn bị gửi đi:", taskData);

    // Kiểm tra nhanh các trường ID cốt lõi tránh gửi chuỗi rỗng lên DB
    if (!taskData.seriesId || !taskData.chapterId || !taskData.assignedToId || !taskData.deadline) {
      alert("Vui lòng chọn đầy đủ Series, Chapter, Assistant và Deadline!");
      return;
    }

    try {
      const response = await taskService.createTask(taskData);
      alert("Tạo task thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      alert("Tạo thất bại: " + error.message);
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
    handleSubmitCreateTask
  }
}
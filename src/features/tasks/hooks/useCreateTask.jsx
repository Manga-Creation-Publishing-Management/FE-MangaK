import { use, useEffect, useState } from "react"
import { taskService } from "../../../services/taskService";
import { seriesService } from "../../../services/seriesService";


export function useCreateTask() {

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAssistantList, setShowAsssitantList] = useState([]);

  const [showSeriesApproval, setShowSeriesApproval] = useState([]); 

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
      try {
        const seriesPublishing = await seriesService.getSeriesByStatus("Publishing");
        resultPublishing = seriesPublishing?.data ? seriesPublishing.data : [];
      } catch (error) {
        console.warn("Không tìm thấy series Publishing hoặc có lỗi xảy ra:", error);
      }

      // Gộp 2 mảng lại thành một mảng duy nhất và cập nhật vào State
      setShowSeriesApproval([...resultApproved, ...resultPublishing]);
    }
    fetchApi();
  }, [])



  return {
    handleShowCreateTaskModal,
    showCreateTaskModal,
    showAssistantList,
    showSeriesApproval
  }
}
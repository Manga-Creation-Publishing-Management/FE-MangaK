import { useEffect, useState } from "react"
import { taskService } from "../../../services/taskService";
import { useNavigate } from "react-router";

export function useTaskList(reload) {



  const [taskList, setTaskList] = useState([]);

  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await taskService.getTaskList();
        setTaskList(response.data || response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách task:", error);
      }
    }
    fetchApi();
  }, [reload])

  const handleNavigateToTask = (role, taskId) => {
    navigate(`/${role}/tasks/${taskId}`, { state: { role, taskId } });
  }

  return {
    taskList,
    handleNavigateToTask
  }
}
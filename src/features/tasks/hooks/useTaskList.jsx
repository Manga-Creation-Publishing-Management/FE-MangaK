import { useEffect, useState } from "react"
import { taskService } from "../../../services/taskService";

export function useTaskList() {



  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await taskService.getTaskList();
        console.log("response", response);
        setTaskList(response.data || response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách task:", error);
      }
    }
    fetchApi();
  }, [])

  return {
    taskList
  }
}
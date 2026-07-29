import { useEffect, useState } from "react";
import { taskService } from "../../../services/taskService";

export function useTaskListByAssistant(assistantId) {
  const [taskListByAssistant, setTaskListByAssistant] = useState([]);

  useEffect(() => {

    const fetchApi = async () => {
      const response = await taskService.getTaskListByAssistant();
      setTaskListByAssistant(response.data);
    }
    fetchApi();
  }, [])

  return {
    taskListByAssistant
  }
}
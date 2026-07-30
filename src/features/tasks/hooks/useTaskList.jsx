import { useEffect, useState } from 'react';
import { taskService } from '@/services/taskService';
import { useNavigate } from 'react-router';

export function useTaskList(reload) {

  const [taskList, setTaskList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      setIsLoadingList(true);
      try {
        const response = await taskService.getTaskList();
        setTaskList(response.data || response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách task:", error);
      } finally {
        setIsLoadingList(false);
      }
    }
    fetchApi();
  }, [reload])

  const handleNavigateToTask = (role, taskId) => {
    navigate(`/${role}/tasks/${taskId}`, { state: { role, taskId } });
  }

  return {
    taskList,
    handleNavigateToTask,
    isLoadingList
  }
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { taskService } from '@/services/taskService';

export function useAssistantDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [urgentTasks, setUrgentTasks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await taskService.getTaskListByAssistant();
        const taskList = response.data || [];

        let completed = 0;
        let pending = 0;
        let review = 0;

        taskList.forEach(task => {
          const status = task.status?.toLowerCase();
          if (status === "completed") {
            completed++;
          } else if (status === "pending") {
            pending++;
          } else if (status === "revising") {
            review++;
          }
        });

        setCompletedCount(completed);
        setPendingCount(pending);
        setReviewCount(review);

        const activeTasks = taskList.filter(task => {
          const status = task.status?.toLowerCase();
          return status === "processing";
        });

        if (activeTasks.length > 0) {
          
          const sorted = activeTasks.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
          });
          setUrgentTasks(sorted.slice(0, 2));
        } else {
          setUrgentTasks([]);
        }
      } catch (error) {
        console.error("Error loading Assistant Dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigateToTask = (taskId) => {
    const userString = localStorage.getItem('user');
    const role = userString ? JSON.parse(userString).role : 'assistant';
    navigate(`/assistant/tasks/${taskId}`, { state: { role: role.toLowerCase(), taskId } });
  };

  return {
    isLoading,
    completedCount,
    pendingCount,
    reviewCount,
    urgentTasks,
    handleNavigateToTask,
  };
}

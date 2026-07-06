import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { seriesService } from '@/services/seriesService';
import { chaptersService } from '@/services/chapterService';
import { taskService } from '@/services/taskService';

export function useMangakaDashboard() {
  const [totalSeries, setTotalSeries] = useState(0);
  const [pendingChaptersCount, setPendingChaptersCount] = useState(0);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [activeAssistants, setActiveAssistants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. Lấy danh sách truyện để đếm Total Series
        const seriesRes = await seriesService.getAllSeries();
        const seriesList = seriesRes.data || [];
        setTotalSeries(seriesList.length);

        // 2. Lấy danh sách chapter của từng truyện để đếm các chapter ở trạng thái Pending
        const chaptersPromises = seriesList.map(async (series) => {
          try {
            const chapRes = await chaptersService.getAllSeriesBySeriesId(series.seriesId);
            return chapRes.data || [];
          } catch (err) {
            console.error(`Error loading chapters for series ${series.seriesId}:`, err);
            return [];
          }
        });
        const allChaptersList = await Promise.all(chaptersPromises);
        const allChapters = allChaptersList.flat();
        const pendingChaps = allChapters.filter(ch => ch.status === "Pending");
        setPendingChaptersCount(pendingChaps.length);

        // 3. Lấy danh sách Task và lọc những Task ở trạng thái Pending
        const tasksRes = await taskService.getTaskList();
        const tasksList = tasksRes.data || tasksRes || [];
        const pTasks = tasksList.filter(t => t.status === "Pending");
        setPendingTasks(pTasks);

        // 4. Lấy danh sách Trợ lý và lọc những Trợ lý có tài khoản Active
        const assistantsRes = await taskService.getAssistantList("Assistant");
        const assistantsList = assistantsRes.data || [];
        const actAssistants = assistantsList.filter(user => {
          const isActive = user.isActive !== false;
          const status = user.status?.toLowerCase();
          return isActive && status !== 'suspended' && status !== 'inactive';
        });
        setActiveAssistants(actAssistants);
      } catch (error) {
        console.error("Error loading Mangaka dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigateToTask = (taskId) => {
    navigate(`/mangaka/tasks/${taskId}`, { state: { role: 'mangaka', taskId } });
  };

  return {
    totalSeries,
    pendingChaptersCount,
    pendingTasks,
    activeAssistants,
    isLoading,
    handleNavigateToTask,
  };
}

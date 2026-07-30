import { useEffect, useState } from 'react';
import { taskService } from '@/services/taskService';
import { seriesService } from '@/services/seriesService';
import { chaptersService } from '@/services/chapterService';
import { useToast } from '@/shared/hooks/useToast';
import dayjs from 'dayjs';

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
    }
    fetchApi();
  }, [])

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await seriesService.getAllSeries();
        const allSeries = response?.data || [];
        const filtered = allSeries.filter((item) => {
          const status = item?.status?.toLowerCase();
          return status === "publishing" || status === "scheduled";
        });
        setShowSeriesApproval(filtered);
      } catch (error) {
        console.error("Error fetching series list:", error);
        setShowSeriesApproval([]);
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    if (selectedSeriesId) {
      const fetchChapters = async () => {
        try {
          const response = await chaptersService.getAllSeriesBySeriesId(selectedSeriesId);
          setChapters(response?.data?.filter(item => (item?.status?.toLowerCase() === "created" || item?.status?.toLowerCase() === "processing")) || []);
        } catch (error) {
          console.error("Error fetching series list:", error);
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
    const formattedDeadline = allFields.deadline ? dayjs(allFields.deadline).toISOString() : null;
    const taskData = {
      seriesId: allFields.seriesId || null,
      taskTitle: allFields.taskTitle || null,
      from: allFields.fromPage ? Number(allFields.fromPage) : 0,
      to: allFields.toPage ? Number(allFields.toPage) : 0,
      deadline: formattedDeadline,
      chapterId: allFields.chapterId || null,
      assignedToId: allFields.assignedToId || null,
      amountIncome: allFields.amountIncome ? Number(allFields.amountIncome) : 0
    };

    if (!taskData.taskTitle || !taskData.seriesId || !taskData.chapterId || !taskData.assignedToId || !taskData.deadline) {
      showAlert("Please choose and fill in all required fields: Title, Series, Chapter, Assistant, and Deadline!", "warning");
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
import { useState, useEffect } from "react";
import { feedbackService } from "@/services/feedbackService";
import { useToast } from "@/shared/hooks/useToast";

export function useGetFeedbackDetail(seriesId = null, chapterId = null, taskId = null) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { showAlert } = useToast();

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    // Only fetch if at least one ID is present
    if (!seriesId && !chapterId && !taskId) return;

    let active = true;

    async function loadFeedbacks() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await feedbackService.getFeedbackDetail(seriesId, chapterId, taskId);
        const data = response?.data || response;
        
        if (!active) return;

        if (Array.isArray(data)) {
          setFeedbacks(data);
        } else if (data && Array.isArray(data.data)) {
          setFeedbacks(data.data);
        } else {
          setFeedbacks([]);
        }
      } catch (err) {
        console.error("Error fetching feedback details history:", err);
        if (active) {
          setError(err);
          showAlert(`Error loading feedback history: ${err.message || err}`, "fail");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadFeedbacks();

    return () => {
      active = false;
    };
  }, [seriesId, chapterId, taskId, refreshTrigger, showAlert]);

  return {
    feedbacks,
    isLoading,
    error,
    refetch,
  };
}

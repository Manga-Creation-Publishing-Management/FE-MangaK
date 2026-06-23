import { useState, useEffect } from 'react';
import { feedbackService } from '../../../services/feedbackService';

/**
 * useFeedback Hook - Manages feedback state by loading feedbacks.
 */
export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        const response = await feedbackService.getFeedbackList();
        setFeedbacks(response?.data || response || []);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return {
    feedbacks,
    isLoading,
    error,
    setFeedbacks,
  };
}

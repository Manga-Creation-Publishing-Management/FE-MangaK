import { useState, useEffect } from 'react';

/**
 * useFeedback Hook - Quản lý state của Feedback.
 * Hiện tại trả về một mảng rỗng để render trạng thái trống theo yêu cầu.
 */
export function useFeedback() {
  const [Feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        // Mô phỏng gọi API, tạm thời trả về mảng rỗng
        setFeedbacks([]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return {
    Feedbacks,
    isLoading,
    error,
    setFeedbacks,
  };
}

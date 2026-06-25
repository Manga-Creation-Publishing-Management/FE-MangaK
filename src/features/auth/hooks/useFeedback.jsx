import { useState, useEffect } from 'react';

/**
 * useFeedback Hook - Manages Feedback state.
 * Currently returns an empty array to render an empty state as requested.
 */
export function useFeedback() {
  const [Feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        // Emulating api fetch, returning empty array for now
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

import { useState, useEffect } from 'react';

/**
 * useNotification Hook - Manages notification state.
 * Currently returns an empty array to render an empty state as requested.
 */
export function useNotification() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Emulating api fetch, returning empty array for now
        setNotifications([]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return {
    notifications,
    isLoading,
    error,
    setNotifications,
  };
}

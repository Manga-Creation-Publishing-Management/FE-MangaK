import { useState, useEffect } from 'react';
import { leaderboardService } from '@/services/leaderboardService';
import { getPeriodOptionDetails, formatDateLabel } from '../utils/leaderboardUtils';

export function useLeaderboard() {
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchPeriods = async () => {
      setIsLoadingPeriods(true);
      try {
        const response = await leaderboardService.getPeriods(timePeriod);
        const list = Array.isArray(response)
          ? response
          : (response?.data || response?.result || response?.periods || []);

        if (isMounted) {
          setPeriods(list);
          if (list.length > 0) {
            const firstOption = getPeriodOptionDetails(list[0], 0);
            setSelectedPeriod(firstOption.value);
          } else {
            setSelectedPeriod('');
          }
        }
      } catch (err) {
        console.warn("Could not fetch periods:", err);
        if (isMounted) {
          setPeriods([]);
          setSelectedPeriod('');
        }
      } finally {
        if (isMounted) setIsLoadingPeriods(false);
      }
    };

    fetchPeriods();
    return () => { isMounted = false; };
  }, [timePeriod]);

  useEffect(() => {
    setCurrentPage(1);
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const firstOption = periods.length > 0 ? getPeriodOptionDetails(periods[0], 0) : null;
        const isFirstOrEmpty = !selectedPeriod || (firstOption && selectedPeriod === firstOption.value);
        const periodQueryParam = isFirstOrEmpty ? '' : selectedPeriod;

        const data = timePeriod === 'weekly'
          ? await leaderboardService.getWeeklyLeaderboard(periodQueryParam)
          : await leaderboardService.getMonthlyLeaderboard(periodQueryParam);

        const items = Array.isArray(data) ? data : (data?.data || data?.result || []);
        const filteredItems = items
          .filter(item => (item.votes ?? 0) >= 10)
          .map((item, index) => ({
            ...item,
            rank: index + 1
          }));
        setLeaderboardData(filteredItems);
      } catch (err) {
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timePeriod, selectedPeriod, periods]);

  const pageSize = 10;
  const totalPages = Math.ceil(leaderboardData.length / pageSize);
  const paginatedData = leaderboardData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getHeaderPeriodLabel = () => {
    if (!selectedPeriod) return '';
    if (selectedPeriod.includes(' - ')) {
      const [start, end] = selectedPeriod.split(' - ');
      return ` (${formatDateLabel(start)} - ${formatDateLabel(end)})`;
    }
    return ` (${formatDateLabel(selectedPeriod)})`;
  };

  const periodOptions = isLoadingPeriods
    ? [{ value: '', label: 'Loading periods...' }]
    : periods.length > 0
      ? periods.map((item, idx) => getPeriodOptionDetails(item, idx))
      : [{ value: '', label: 'Select Period' }];

  return {
    timePeriod,
    setTimePeriod,
    periods,
    selectedPeriod,
    setSelectedPeriod,
    isLoadingPeriods,
    leaderboardData,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    periodOptions,
    getHeaderPeriodLabel
  };
}

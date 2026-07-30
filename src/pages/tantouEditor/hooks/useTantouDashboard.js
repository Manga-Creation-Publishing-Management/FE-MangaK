import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { seriesService } from '@/services/seriesService';

const STATUS_COLORS = {
  processing: "#60a5fa",
  rejected: "#ef4444",
  pending: "#f59e0b",
  approved: "#10b981",
  publishing: "#3b82f6",
};

export function useTantouDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [processingCount, setProcessingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const [pendingSeries, setPendingSeries] = useState([]);

  const [statusDistribution, setStatusDistribution] = useState([]);

  const [recentlyReviewed, setRecentlyReviewed] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const seriesRes = await seriesService.getAllSeries();
        const allSeries = seriesRes.data || [];

        const allowedStatuses = ["processing", "rejected", "pending", "approved", "publishing"];
        const tantouSeries = allSeries.filter(s =>
          allowedStatuses.includes(s.status?.toLowerCase())
        );

        const processing = tantouSeries.filter(s => s.status?.toLowerCase() === "processing");
        const approved = tantouSeries.filter(s =>
          s.status?.toLowerCase() === "approved" || s.status?.toLowerCase() === "pending"
        );
        const rejected = tantouSeries.filter(s => s.status?.toLowerCase() === "rejected");

        setProcessingCount(processing.length);
        setApprovedCount(approved.length);
        setRejectedCount(rejected.length);

        const pendingList = processing
          .slice(0, 5)
          .map(s => ({
            id: s.seriesId || s.id,
            title: s.title,
            author: s.mangakaName,
            createdDate: s.createdAt || s.createdDate || null,
          }));
        setPendingSeries(pendingList);

        const statusMap = {};
        tantouSeries.forEach(s => {
          const status = s.status?.toLowerCase() || "unknown";
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        const distribution = Object.entries(statusMap).map(([status, count]) => ({
          status,
          count,
          color: STATUS_COLORS[status] || "#94a3b8",
        }));
        setStatusDistribution(distribution);

        const reviewed = tantouSeries
          .filter(s => {
            const st = s.status?.toLowerCase();
            return st === "approved" || st === "rejected" || st === "pending";
          })
          .slice(0, 5)
          .map(s => ({
            id: s.seriesId || s.id,
            name: s.title,
            author: s.mangakaName,
            chapters: s.totalChapters || 0,
            status: s.status?.toLowerCase(),
          }));
        setRecentlyReviewed(reviewed);
      } catch (error) {
        console.error("Error loading Tantou Dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigateToSeries = (seriesId) => {
    navigate(`/tantou/series/${seriesId}`, { state: { role: 'tantou' } });
  };

  const handleNavigateToSeriesList = () => {
    navigate('/tantou/series');
  };

  return {
    isLoading,
    processingCount,
    approvedCount,
    rejectedCount,
    pendingSeries,
    statusDistribution,
    recentlyReviewed,
    handleNavigateToSeries,
    handleNavigateToSeriesList,
  };
}

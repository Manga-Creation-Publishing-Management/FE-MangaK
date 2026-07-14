import { useEffect, useState } from "react";
import { seriesService } from "@/services/seriesService";
import { publishingScheduleService } from "@/services/publishingScheduleService";
import { updateSeries } from "@/services/updateSeriesService";
import { useSeriesManagement } from "@/features/series/hooks/useSeriesManagement";
import { useToast } from "@/shared/hooks/useToast";

const STATUS_COLORS = {
  processing: "#60a5fa",
  pending: "#f59e0b",
  approved: "#10b981",
  publishing: "#3b82f6",
  rejected: "#ef4444",
  cancelled: "#ef4444",
};

export function useEditorialDashboard() {
  const { handleNavigate } = useSeriesManagement();
  const { showAlert } = useToast();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [approvedSeries, setApprovedSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cancelledSeriesName, setCancelledSeriesName] = useState("");

  const [seriesStats, setSeriesStats] = useState({
    active: 0,
    thisMonthReleases: 0,
    total: 0,
    statusDistribution: [],
  });
  const [upcomingReleases, setUpcomingReleases] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [seriesResponse, schedulesResponse] = await Promise.all([
        seriesService.getAllSeries(),
        publishingScheduleService.getAllSchedules(),
      ]);

      const allSeries = seriesResponse.data || [];
      const allSchedules = schedulesResponse.data || [];

      const approvedCount = allSeries.filter(
        (s) =>
          s.status?.toLowerCase() === "approved" ||
          s.status?.toLowerCase() === "publishing"
      ).length;

      const now = new Date();
      const thisMonthCount = allSchedules.filter((s) => {
        if (!s.publishDate) return false;
        const date = new Date(s.publishDate);
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      }).length;

      const statusMap = {};
      allSeries.forEach((s) => {
        const status = s.status?.toLowerCase() || "unknown";
        statusMap[status] = (statusMap[status] || 0) + 1;
      });
      const statusDistribution = Object.entries(statusMap).map(
        ([status, count]) => ({
          status,
          count,
          color: STATUS_COLORS[status] || "#94a3b8",
        })
      );

      setSeriesStats({
        active: approvedCount,
        thisMonthReleases: thisMonthCount,
        total: allSeries.length,
        statusDistribution,
      });

      const filtered = allSeries.filter(
        (serie) =>
          serie.status?.toLowerCase() === "approved" ||
          serie.status?.toLowerCase() === "publishing"
      );
      const mapped = filtered.map((serie) => ({
        id: serie.seriesId || serie.id,
        name: serie.title,
        author: serie.mangakaName,
        chapters: serie.totalChapters || 0,
        status: serie.status?.toLowerCase(),
      }));
      setApprovedSeries(mapped);

      const upcoming = allSchedules
        .filter((s) => {
          if (!s.publishDate) return false;
          const date = new Date(s.publishDate);
          return date >= now;
        })
        .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
        .slice(0, 5)
        .map((s) => ({
          id: s.scheduleId,
          seriesName: s.seriesTitle,
          date: s.publishDate ? s.publishDate.split("T")[0] : "N/A",
          frequency: s.publishPeriod || "N/A",
        }));
      setUpcomingReleases(upcoming);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelClick = (item) => {
    setSelectedSeries(item);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelFeedback.trim()) {
      showAlert("Please provide feedback for cancellation", "warning");
      return;
    }

    try {
      await updateSeries.cancelSeries(selectedSeries.id, cancelFeedback);
      setCancelledSeriesName(selectedSeries.name);
      setShowCancelModal(false);
      setCancelFeedback("");
      setSelectedSeries(null);
      setShowSuccessModal(true);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to cancel series:", error);
      showAlert("Failed to cancel series. Please try again.", "error");
    }
  };

  return {
    showCancelModal,
    setShowCancelModal,
    selectedSeries,
    setSelectedSeries,
    cancelFeedback,
    setCancelFeedback,
    approvedSeries,
    isLoading,
    showSuccessModal,
    setShowSuccessModal,
    cancelledSeriesName,
    seriesStats,
    upcomingReleases,
    handleCancelClick,
    handleCancelConfirm,
    handleNavigate,
  };
}

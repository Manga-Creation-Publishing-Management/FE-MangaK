import { useEffect, useState } from "react";
import { WelcomeLine } from "@/shared/components/WelcomeLine";
import { seriesService } from "../../services/seriesService";
import { updateSeries } from "../../services/updateSeriesService";
import Feedback from "@/shared/components/Feedback";
import { useSeriesManagement } from "../../features/series/hooks/useSeriesManagement";
import { useToast } from "@/shared/hooks/useToast";

import { ApprovedSeriesCard } from "./components/ApprovedSeriesCard";
import { CancelSeriesModal } from "./components/CancelSeriesModal";
import { CancelSuccessModal } from "./components/CancelSuccessModal";

export function EditorialDashboard() {
  const { handleNavigate } = useSeriesManagement();
  const { showAlert } = useToast();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [approvedSeries, setApprovedSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cancelledSeriesName, setCancelledSeriesName] = useState("");

  const fetchApprovedSeries = async () => {
    try {
      const response = await seriesService.getAllSeries();
      const allSeries = response.data || [];

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
    } catch (error) {
      console.error("Failed to fetch approved series:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedSeries();
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
      fetchApprovedSeries();
    } catch (error) {
      console.error("Failed to cancel series:", error);
      showAlert("Failed to cancel series. Please try again.", "error");
    }
  };

  return (
    <div className="p-9 space-y-8">
      <WelcomeLine roleName="Editorial Board" />

      <div>
        <h2 className="text-xl font-semibold ml-3">Approved Series</h2>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground">Loading approved series...</p>
        ) : approvedSeries.length === 0 ? (
          <p className="text-muted-foreground">
            No approved series currently in publication.
          </p>
        ) : (
          approvedSeries.map((item) => (
            <ApprovedSeriesCard
              key={item.id}
              item={item}
              onCancelClick={handleCancelClick}
              onNavigate={handleNavigate}
            />
          ))
        )}
      </div>

      <CancelSeriesModal
        show={showCancelModal}
        selectedSeries={selectedSeries}
        cancelFeedback={cancelFeedback}
        onCancelFeedbackChange={setCancelFeedback}
        onConfirm={handleCancelConfirm}
        onClose={() => {
          setShowCancelModal(false);
          setCancelFeedback("");
          setSelectedSeries(null);
        }}
      />

      <CancelSuccessModal
        show={showSuccessModal}
        cancelledSeriesName={cancelledSeriesName}
        onClose={() => setShowSuccessModal(false)}
      />

      <div className="pb-10">
        <Feedback />
      </div>
    </div>
  );
}

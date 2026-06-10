import { useState } from "react";
import { useNavigate } from "react-router";
import { updateSeries } from "../../../services/updateSeriesService";

export function useUpdateSeries() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleApprove = async (id, roleFromState, currentStatus, setLocalStatus) => {
    const normalizedStatus = currentStatus?.toLowerCase();
    const normalizedRole = roleFromState?.toLowerCase();
    const isTantou = normalizedRole === "tantou" || normalizedRole === "tantoueditor";
    const isEditorial = normalizedRole === "editorial" || normalizedRole === "editorialboard";

    let newStatus;
    if (isTantou && normalizedStatus === "processing") {
      newStatus = "pending";
    } else if (isEditorial && normalizedStatus === "pending") {
      newStatus = "approved";
    } else {
      alert("You cannot approve this series in its current state.");
      return;
    }

    setIsLoading(true);
    try {
      const reviewPayload = {
        isApproved: true,
        note: feedback
      };

      if (isTantou) {
        await updateSeries.updateToPending(id, reviewPayload);
      } else {
        await updateSeries.updateToApprove(id, reviewPayload);
      }

      setLocalStatus(newStatus);
      alert(`Series has been approved! New status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
      navigate(-1);
    } catch (error) {
      console.error("Error approving series:", error);
      alert("Failed to approve series. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id, roleFromState, setLocalStatus) => {
    if (!feedback.trim()) {
      alert("Please provide feedback before rejecting.");
      return;
    }

    const normalizedRole = roleFromState?.toLowerCase();
    const isTantou = normalizedRole === "tantou" || normalizedRole === "tantoueditor";

    setIsLoading(true);
    try {
      const reviewPayload = {
        isApproved: false,
        note: feedback
      };

      if (isTantou) {
        await updateSeries.updateToPending(id, reviewPayload);
      } else {
        await updateSeries.updateToApprove(id, reviewPayload);
      }

      setLocalStatus("rejected");
      alert("Series has been rejected.");
      navigate(-1);
    } catch (error) {
      console.error("Error rejecting series:", error);
      alert("Failed to reject series. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    feedback,
    setFeedback,
    handleApprove,
    handleReject
  };
}

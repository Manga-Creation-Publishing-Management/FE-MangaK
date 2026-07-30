import { useState } from 'react';
import { useNavigate } from 'react-router';
import { updateSeries } from '@/services/updateSeriesService';
import { useToast } from '@/shared/hooks/useToast';

export function useUpdateSeries() {
  const { showAlert } = useToast();
  const [isLoading, setIsLoading] = useState(false); 
  const [feedback, setFeedback] = useState("");      
  const navigate = useNavigate();                    

  const handleApprove = async (id, roleFromState, currentStatus, setLocalStatus) => {
    
    const normalizedStatus = currentStatus?.toLowerCase();
    const normalizedRole = roleFromState?.toLowerCase();
    const isTantou = normalizedRole === "tantou";
    const isEditorial = normalizedRole === "editorial";

    let newStatus;
    
    if (isTantou && normalizedStatus === "processing") {
      newStatus = "pending";
    } else if (isEditorial && normalizedStatus === "pending") {
      newStatus = "approved";
    } else {
      
      showAlert("You cannot approve this series in its current state.", "error");
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
      showAlert(`Series has been approved! New status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);

      navigate(-1);
    } catch (error) {
      console.error("Error approving series:", error);
      showAlert("Failed to approve series. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id, roleFromState, setLocalStatus, overrideFeedback = null) => {
    
    const finalFeedback = overrideFeedback != null ? overrideFeedback : feedback;

    if (!finalFeedback.trim()) {
      showAlert("Please provide feedback before rejecting.", "warning");
      return;
    }

    const normalizedRole = roleFromState?.toLowerCase();
    const isTantou = normalizedRole === "tantou" || normalizedRole === "tantoueditor";

    setIsLoading(true);
    try {
      const reviewPayload = {
        isApproved: false, 
        note: finalFeedback
      };

      if (isTantou) {
        await updateSeries.updateToPending(id, reviewPayload);
      } else {
        await updateSeries.updateToApprove(id, reviewPayload);
      }

      setLocalStatus("rejected");
      showAlert("Series has been rejected.");

      navigate(-1);
    } catch (error) {
      console.error("Error rejecting series:", error);
      showAlert("Failed to reject series. Please try again.", "error");
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

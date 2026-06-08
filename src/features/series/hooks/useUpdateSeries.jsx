import { useState } from "react";
import { updateSeries } from "../../../services/updateSeriesService";

export function useUpdateSeries() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const reviewSeries = async (seriesId, role, isApproved) => {
    setIsLoading(true);
    try {
      const reviewPayload = {
        isApproved,
        note: feedback
      };

      let result;
      if (role === "tantou") {
        result = await updateSeries.updateToPending(seriesId, reviewPayload);
      } else if (role === "editorial") {
        result = await updateSeries.updateToApprove(seriesId, reviewPayload);
      } else {
        throw new Error("Invalid role for review operation");
      }

      return result;
    } catch (error) {
      console.error("Error in reviewSeries hook:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    feedback,
    setFeedback,
    reviewSeries
  };
}

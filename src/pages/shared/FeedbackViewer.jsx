import { useState, forwardRef, useImperativeHandle } from "react";
import { feedbackService } from "../../services/feedbackService";
import { useToast } from "@/shared/hooks/useToast";
import { TextFeedbackModal } from "./TextFeedbackModal";
import { AnnotationModal } from "./AnnotationModal";

export const FeedbackViewer = forwardRef(({
  seriesId = null,
  chapterId = null,
  taskId = null,
  fallbackFeedback,
  fallbackFeedbackType,
  fileUrl,
  role
}, ref) => {
  const [isViewAnnotationOpen, setIsViewAnnotationOpen] = useState(false);
  const [isTextFeedbackOpen, setIsTextFeedbackOpen] = useState(false);
  const [fetchedFeedback, setFetchedFeedback] = useState(null);
  const { showAlert } = useToast();

  useImperativeHandle(ref, () => ({
    viewFeedback: async () => {
      let annotationFailed = false;
      try {
        const response = await feedbackService.getFeedbackDetail(seriesId, chapterId, taskId);
        let feedbackData = response?.data;

        if (Array.isArray(feedbackData) && feedbackData.length > 0) {
          feedbackData = feedbackData[feedbackData.length - 1];
        }

        const extractedType = feedbackData?.data?.type || feedbackData?.type;
        const extractedContent = feedbackData?.data?.content || feedbackData?.content;
        console.log("extractedContent", extractedContent);

        if (feedbackData && (extractedContent || extractedType)) {
          setFetchedFeedback(extractedContent || fallbackFeedback);

          if (extractedType === "EditPDF") {
            setIsViewAnnotationOpen(true);
          } else {
            setFetchedFeedback(extractedContent || fallbackFeedback);
            setIsTextFeedbackOpen(true);
          }
          return;
        } else {
          annotationFailed = true;
        }
      } catch (error) {
        console.log("Error fetching annotation feedback, trying text detail feedback...", error);
        annotationFailed = true;
      }

      if (annotationFailed) {
        try {
          const detailResponse = await feedbackService.getFeedbackDetail(seriesId, chapterId, taskId);
          let detailDataResult = detailResponse?.data || detailResponse;

          if (Array.isArray(detailDataResult) && detailDataResult.length > 0) {
            detailDataResult = detailDataResult[detailDataResult.length - 1];
          }

          const textContent = detailDataResult?.data?.content;

          setFetchedFeedback(textContent || fallbackFeedback);
          setIsTextFeedbackOpen(true);
        } catch (error) {
          console.error("Error fetching text feedback detail:", error);
          showAlert("Could not fetch the latest feedback.", "fail");
          // Fallback
          setFetchedFeedback(fallbackFeedback);
          if (fallbackFeedbackType === "EditPDF") {
            setIsViewAnnotationOpen(true);
          } else {
            setIsTextFeedbackOpen(true);
          }
        }
      }
    }
  }));

  return (
    <>
      <TextFeedbackModal
        isOpen={isTextFeedbackOpen}
        onClose={() => setIsTextFeedbackOpen(false)}
        feedbackText={fetchedFeedback}
      />

      <AnnotationModal
        isOpen={isViewAnnotationOpen}
        onClose={() => setIsViewAnnotationOpen(false)}
        fileUrl={fileUrl}
        isReadOnly={true}
        initialFeedbackJson={fetchedFeedback}
        role={role}
      />
    </>
  );
});

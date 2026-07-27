import { feedbackService } from "../../services/feedbackService";

export function useMarkFeedbackAsRead() {
    const handleMarkAsRead = async (feedbackId) => {
        if (!feedbackId) return;
        try {
            const isSuccess = await feedbackService.putFeedbackAsRead(feedbackId);
            if (isSuccess) {
                console.log(`Marked feedback ${feedbackId} as read`);
            }
        } catch (error) {
            console.error("Failed to mark feedback as read:", error);
        }
    };
    return { handleMarkAsRead };
}
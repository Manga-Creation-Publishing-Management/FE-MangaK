import { useState } from "react";
import { useNavigate } from "react-router";
import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";

export function useUpdateChapter(seriesId, chapterId) {
    const { showAlert } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    const handleApprove = async (roleFromState, currentStatus, setLocalStatus) => {
        const normalizedStatus = currentStatus?.toLowerCase();
        const normalizedRole = roleFromState?.toLowerCase();
        const isTantou = normalizedRole === "tantou";

        let newStatus;
        if (isTantou && normalizedStatus === "pending") {
            newStatus = "publishing";
        } else {
            showAlert("Chapter cannot be approved in its current state.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("Status", newStatus);
        formData.append("Feedback", feedback);

        setIsLoading(true);
        try {
            await chaptersService.updateChapterStatus(seriesId, chapterId, formData);

            setLocalStatus(prev => ({ ...prev, status: "Publishing" }));
            showAlert(`Chapter has been approved! New status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
            navigate(-1);
        } catch (error) {
            console.error("Error approving chapter:", error);
            showAlert("Failed to approve chapter. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (roleFromState, currentStatus, setLocalStatus, overrideFeedback = null) => {
        //ưu tiên lấy feedback truyền vào
        const finalFeedback = overrideFeedback != null ? overrideFeedback : feedback;

        if (!finalFeedback.trim()) {
            showAlert("Please provide feedback before rejecting.", "warning");
            return;
        }

        const normalizedRole = roleFromState?.toLowerCase();
        const normalizedStatus = currentStatus?.toLowerCase();
        const isTantou = normalizedRole === "tantou";

        let newStatus;
        if (isTantou && normalizedStatus === "pending") {
            newStatus = "rejected";
        } else {
            showAlert("Chapter cannot be rejected in its current state.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("Status", newStatus);
        formData.append("Feedback", finalFeedback);

        setIsLoading(true);
        try {
            await chaptersService.updateChapterStatus(seriesId, chapterId, formData);

            setLocalStatus(prev => ({ ...prev, status: "Rejected" }));
            showAlert("Chapter has been rejected.");
            navigate(-1);
        } catch (error) {
            console.error("Error rejecting chapter:", error);
            showAlert("Failed to reject chapter. Please try again.", "error");
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

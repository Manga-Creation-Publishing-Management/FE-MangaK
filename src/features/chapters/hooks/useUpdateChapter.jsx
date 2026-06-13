import { useState } from "react";
import { useNavigate } from "react-router";
import { chaptersService } from "../../../services/chapterService";

export function useUpdateChapter(seriesId, chapterId) {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    const handleApprove = async (roleFromState, currentStatus, setLocalStatus) => {
        const normalizedStatus = currentStatus?.toLowerCase();
        const normalizedRole = roleFromState?.toLowerCase();
        const isTantou = normalizedRole === "tantou";

        let newStatus;
        if (isTantou && normalizedStatus === "processing") {
            newStatus = "publishing";
        } else {
            alert("Chapter cannot be approved in its current state.");
            return;
        }

        const formData = new FormData();
        formData.append("Status", newStatus);
        formData.append("Feedback", feedback);

        setIsLoading(true);
        try {
            await chaptersService.updateChapterStatus(seriesId, chapterId, formData);

            setLocalStatus(prev => ({ ...prev, status: "Publishing" }));
            alert(`Chapter has been approved! New status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
            navigate(-1);
        } catch (error) {
            console.error("Error approving chapter:", error);
            alert("Failed to approve chapter. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (roleFromState, currentStatus, setLocalStatus) => {
        if (!feedback.trim()) {
            alert("Please provide feedback before rejecting.");
            return;
        }

        const normalizedRole = roleFromState?.toLowerCase();
        const normalizedStatus = currentStatus?.toLowerCase();
        const isTantou = normalizedRole === "tantou";

        let newStatus;
        if (isTantou && normalizedStatus === "processing") {
            newStatus = "rejected";
        } else {
            alert("Chapter cannot be rejected in its current state.");
            return;
        }

        const formData = new FormData();
        formData.append("Status", newStatus);
        formData.append("Feedback", feedback);

        setIsLoading(true);
        try {
            await chaptersService.updateChapterStatus(seriesId, chapterId, formData);

            setLocalStatus(prev => ({ ...prev, status: "Rejected" }));
            alert("Chapter has been rejected.");
            navigate(-1);
        } catch (error) {
            console.error("Error rejecting chapter:", error);
            alert("Failed to reject chapter. Please try again.");
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

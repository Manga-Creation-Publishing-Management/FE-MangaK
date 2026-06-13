import { useState } from "react";
import { useNavigate } from "react-router";
import { chaptersService } from "../../../services/chapterService";

export function useUpdateChapter(seriesId, chapterId) {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    const handleApprove = async (id, roleFromState, currentStatus, setLocalStatus) => {
        const normalizedStatus = currentStatus?.toLowerCase();
        const normalizedRole = roleFromState?.toLowerCase();
        const isTantou = normalizedRole === "tantou";

        let newStatus;
        if (isTantou && normalizedStatus === "processing") {
            newStatus = "Publishing";
        }

        setIsLoading(true);
        try {
            const reviewPayload = {
                isApproved: true,
                note: feedback
            };

            await setChapterDetail(id, reviewPayload);

            setLocalStatus(prev => ({ ...prev, status: "Publishing" }));
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
        const isTantou = normalizedRole === "tantou";

        setIsLoading(true);
        try {
            const reviewPayload = {
                isApproved: false,
                note: feedback
            };

            await setChapterDetail(id, reviewPayload);

            setLocalStatus(prev => ({ ...prev, status: "Rejected" }));
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

import { feedbackService } from "../../../services/feedbackService";
import { useToast } from "../../../shared/hooks/useToast";
import { useState, useEffect, useCallback } from 'react';

export function useGetFeedback(enabled = true) {

    // State quản lý trạng thái loading (khi đang gọi API submit)
    const [feedbackData, setFeedbackData] = useState(null);
    const { showAlert } = useToast();

    useEffect(() => {
        if (!enabled) return;

        async function getFeedback() {
            try {
                const result = await feedbackService.getAllFeedback();
                setFeedbackData(result);
            }
            catch (error) {
                console.log("Error in get feedback: ", error);
                showAlert(`Error in get feedback: ${error}`);
            }
        }
        getFeedback();
    }, [enabled]);

    const feedbackList = feedbackData?.data || [];
    const unreadFeedbackCount = feedbackList?.filter(item => item.isRead === false).length;

    const markAsReadLocally = (feedbackId) => {
        setFeedbackData(prev => {
            if (!prev?.data) return prev;
            return {
                ...prev, //giữ lại các field khác của object, chỉ ghi đè mỗi data
                data: prev.data.map(item =>
                    item.id === feedbackId
                        ? { ...item, isRead: true }
                        : item
                )
            };
        });
    };

    return {
        unreadFeedbackCount,
        feedbackData,
        markAsReadLocally
    };
}
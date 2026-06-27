import { feedbackService } from "../../../services/feedbackService";
import { useToast } from "../../../shared/hooks/useToast";
import { useState, useEffect } from 'react';

export function useGetFeedback() {

    // State quản lý trạng thái loading (khi đang gọi API submit)
    const [feedbackData, setFeedbackData] = useState(null);
    const { showAlert } = useToast();

    useEffect(() => {
        async function getFeedback() {
            try {
                const result = await feedbackService.getAllFeedback();

                console.log(`Feedback result: ${result}`);
                setFeedbackData(result);
            }
            catch (error) {
                console.log("Error in get feedback: ", error);
                showAlert(`Error in get feedback: ${error}`);
            }
        }
        getFeedback();
    }, []);

    return {
        feedbackData
    };
}
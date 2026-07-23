import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";

// Hook xử lý việc gửi đánh giá (rating) của chương truyện lên server
export function useUpdateRateChapter() {
    const { showAlert } = useToast();

    const handleRateSubmit = async (chapterId, rateRange) => {
        try {
            const res = await chaptersService.updateChapterRate(chapterId, rateRange);

            // Backend trả về HTTP status 200 nhưng payload chứa success: false
            if (res && typeof res === 'object' && res.success === false) {
                showAlert(res.message || "You only change vote once");
                return false;
            }

            showAlert("Your rate submit successfully!");
            return true;
        } catch (error) {
            console.error("Cannot submit rate:", error);
            const errorMsg = error?.response?.data?.message || error?.message || "Error occurred when rating, please try again!";
            showAlert(errorMsg);
            return false;
        }
    }

    return {
        handleRateSubmit
    }
}
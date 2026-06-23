import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";

// Hook xử lý việc gửi đánh giá (rating) của chương truyện lên server
export function useUpdateRateChapter() {
    const { showAlert } = useToast();

    // Hàm gửi đánh giá của một chapter cụ thể với số sao tương ứng (rateRange)
    const handleRateSubmit = async (chapterId, rateRange) => {
        try {
            // Gọi API để cập nhật số sao đánh giá cho chapter
            await chaptersService.updateChapterRate(chapterId, rateRange);
            showAlert("Your rate submit successfully!");
        } catch (error) {
            console.log("Cannot submit rate", error);
            showAlert("Error occured when rating, pleasing try again!", error);
        }
    }

    return {
        handleRateSubmit
    }
}
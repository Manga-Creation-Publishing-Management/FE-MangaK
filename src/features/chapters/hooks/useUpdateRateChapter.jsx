import { chaptersService } from "../../../services/chapterService";
import { useToast } from "../../../shared/hooks/useToast";

export function useUpdateRateChapter() {
    const { showAlert } = useToast();
    const handleRateSubmit = async (chapterId, rateRange) => {
        try {
            await chaptersService.updateChapterRate(chapterId, rateRange);
            showAlert("Your rate submit successfully!");
        } catch (error) {
            console.log("Cannot submit rate", error);
            showAlert("Error occured when rating, pleasing try again!", "error");
        }
    }

    return {
        handleRateSubmit
    }
}
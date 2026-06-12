import { chaptersService } from "../../../services/chapterService";

export function useUpdateRateChapter() {
    const handleRateSubmit = async (chapterId, rateRange) => {
        try {
            await chaptersService.updateChapterRate(chapterId, rateRange);
            alert("Your rate submit successfully!");
        } catch (error) {
            console.log("Cannot submit rate", error);
            alert("Error occured when rating, pleasing try again!");
        }
    }

    return {
        handleRateSubmit
    }
}
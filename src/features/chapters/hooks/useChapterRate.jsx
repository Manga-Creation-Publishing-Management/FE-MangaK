import { useState } from "react";

export function useChapterRate() {
    const [activeChapterId, setActiveChapterId] = useState(null);

    const handlePopUp = (chapterId = null) => {
        setActiveChapterId(chapterId);
    }

    return {
        activeChapterId,
        setActiveChapterId,
        handlePopUp
    }
}
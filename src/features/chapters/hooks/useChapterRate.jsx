import { useState } from "react";

// Hook quản lý trạng thái hiển thị Popup đánh giá (Rate Panel) cho từng chapter
export function useChapterRate() {
    // Lưu ID của chapter đang được mở Popup đánh giá (null nếu không có popup nào mở)
    const [activeChapterId, setActiveChapterId] = useState(null);

    // Hàm đóng/mở popup: truyền chapterId để mở popup cho chapter đó, truyền null hoặc không truyền để đóng
    const handlePopUp = (chapterId = null) => {
        setActiveChapterId(chapterId);
    }

    return {
        activeChapterId,
        setActiveChapterId,
        handlePopUp
    }
}
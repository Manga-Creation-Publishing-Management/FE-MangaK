import { api } from "./api"

// Service dùng để cập nhật trạng thái của các bộ truyện (Series)
export const updateSeries = {
    // API để Tantou Editor chuyển truyện sang trạng thái PendingBoard (đã duyệt sơ bộ)
    async updateToPending(seriesId, data) {
        return api.patch(`/Series/tantou-review/${seriesId}`, data);
    },

    // API để Editorial Board duyệt truyện chính thức (chuyển sang Approved)
    async updateToApprove(seriesId, data) {
        return api.patch(`/Series/board-review/${seriesId}`, data);
    },

    // API để Hủy bỏ một bộ truyện (cần kèm theo lý do - reason)
    async cancelSeries(seriesId, reason) {
        return api.post(`/Series/${seriesId}/cancel`, { reason });
    }
};
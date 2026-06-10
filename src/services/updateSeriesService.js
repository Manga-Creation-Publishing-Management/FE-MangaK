import { api } from "./api"

export const updateSeries = {
    async updateToPending(seriesId, data) {
        return api.patch(`/Series/tantou-review/${seriesId}`, data);
    },

    async updateToApprove(seriesId, data) {
        return api.patch(`/Series/board-review/${seriesId}`, data);
    },

    async cancelSeries(seriesId, reason) {
        return api.post(`/Series/${seriesId}/cancel`, { reason });
    }
};
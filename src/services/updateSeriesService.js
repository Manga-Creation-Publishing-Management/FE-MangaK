import { api } from "./api"

export const updateSeries = {
    async updateToPending (seriesId, reviewData) {
        return api.patch(`/Series/tantou-review/${seriesId}`, reviewData);
    },

    async updateToApprove (seriesId, reviewData) {
        return api.patch(`/Series/board-review/${seriesId}`, reviewData);
    }
};
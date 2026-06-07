import { api } from "./api"

export const updateSeries = {
    async updateToPending (seriesId) {
        return api.patch(`/api/Series/tantou-review/${seriesId}`);
    },

    async updateToApprove (seriesId) {
        return api.patch(`/api/Series/board-review/${seriesId}`);
    }
};
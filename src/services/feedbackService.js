import { api } from "./api";

export const feedbackService = {
    async getAllFeedback () {
        return api.get('/Feedback/get-feedback-list');
    },

    async sendAnnotation (seriesId, chapterId, taskId, content, type) {
        return api.post(`/Feedback/send-feedback`, {
            seriesId: seriesId,
            chapterId: chapterId,
            mangaTaskId: taskId,
            content: content,
            type: type
        });
    }
}
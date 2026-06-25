import { api } from "./api";

export const feedbackService = {
    async getAllFeedback () {
        return api.get('/Feedback/get-feedback-list');
    }
}
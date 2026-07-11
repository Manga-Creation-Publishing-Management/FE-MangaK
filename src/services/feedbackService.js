import { api } from "./api";

export const feedbackService = {
  async getAllFeedback() {
    return api.get('/Feedback/get-feedback-list');
  },

  async sendAnnotation(seriesId, chapterId, taskId, content, type) {
    return api.post(`/Feedback/send-feedback`, {
      seriesId: seriesId,
      chapterId: chapterId,
      mangaTaskId: taskId,
      content: content,
      type: type
    });
  },

  async getFeedbackAnnotation(seriesId, chapterId, taskId) {
    const params = new URLSearchParams();
    if (seriesId) params.append('SeriesId', seriesId);
    if (chapterId) params.append('ChapterId', chapterId);
    if (taskId) params.append('MangaTaskId', taskId);
    
    return api.get(`/Feedback/get-feedback-annotation?${params.toString()}`);
  },

  async getFeedbackDetail(seriesId, chapterId, taskId) {
    const params = new URLSearchParams();
    if (seriesId) params.append('SeriesId', seriesId);
    if (chapterId) params.append('ChapterId', chapterId);
    if (taskId) params.append('MangaTaskId', taskId);
    
    return api.get(`/Feedback/get-feedback-detail?${params.toString()}`);
  }
}
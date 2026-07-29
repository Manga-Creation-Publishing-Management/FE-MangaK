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


  async getFeedbackDetail(seriesId, chapterId, taskId) {
    const params = new URLSearchParams();
    if (seriesId) params.append('SeriesId', seriesId);
    if (chapterId) params.append('ChapterId', chapterId);
    if (taskId) params.append('MangaTaskId', taskId);
    
    return api.get(`/Feedback/get-feedback-detail?${params.toString()}`);
  }, 


  async getLastFeedback(seriesId, chapterId, taskId) {
    const params = new URLSearchParams();
    if (seriesId != null) params.append('SeriesId', seriesId);
    if (chapterId != null) params.append('ChapterId', chapterId);
    if (taskId != null) params.append('MangaTaskId', taskId);
    
    return api.get(`/Feedback/get-latest-feedback?${params.toString()}`);
  },

  async putFeedbackAsRead(feedbackId) {
    return api.patch(`/Feedback/mark-as-read/${feedbackId}`)  
  }

  
}
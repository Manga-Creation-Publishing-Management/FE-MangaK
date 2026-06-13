import { api } from "./api";

export const chaptersService = {
  async getAllSeriesBySeriesId(seriesId) {
    return await await api.get(`/Chapter/get-all-chapters?seriesId=${seriesId}`);
  },

  async getChapterDetailById(seriesId,chapterId) {
    return await await api.get(`/Chapter/get-chapter-details?seriesId=${seriesId}&chapterId=${chapterId}`);
  },

  async createChapter(seriesId,formData) {
    return await api.post(`/Chapter/create-chapter?seriesId=${seriesId}`, formData);
  },
  
  async updateChapterStatus(seriesId, chapterId, data) {
    return await api.patch(`/chapter/${seriesId}/${chapterId}`, data);
  }

};
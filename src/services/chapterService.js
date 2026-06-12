import { api } from "./api";

export const chaptersService = {
  async getAllSeriesBySeriesId(seriesId) {
    return await await api.get(`/Chapter/get-all-chapters?seriesId=${seriesId}`);
  },

  async getChapterDetailById(seriesId,chapterId) {
    return await await api.get(`/Chapter/get-chapter-details?seriesId=${seriesId}&chapterId=${chapterId}`);
  },

  async createSeries(formData) {
    return await api.post("/Series/create-series", formData);
  },
  
  async updateChapterStatus(seriesId, chapterId, data) {
    return await api.patch(`/chapter/${seriesId}/${chapterId}`, data);
  }

};
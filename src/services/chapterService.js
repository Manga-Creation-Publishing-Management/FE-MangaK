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

  async updateChapterStatus(seriesId, chapterId, formData) {
    const url = seriesId ? `/Chapter/${chapterId}?seriesId=${seriesId}` : `/Chapter/${chapterId}`
    return await api.patch(url, formData);
  }

};
import { api } from '@/services/api';

export const chaptersService = {

  async getAllSeriesBySeriesId(seriesId) {
    return await api.get(`/Chapter/get-all-chapters?seriesId=${seriesId}`);
  },

  async getChapterDetailById(seriesId, chapterId) {
    return await api.get(`/Chapter/get-chapter-details?seriesId=${seriesId}&chapterId=${chapterId}`);
  },

  async createChapter(seriesId, formData) {
    return await api.post(`/Chapter/create-chapter?seriesId=${seriesId}`, formData);
  },

  async updateChapterStatus(seriesId, chapterId, data) {
    return await api.patch(`/Chapter/${chapterId}?seriesId=${seriesId}`, data);
  },
  async editManuscript(seriesId, chapterId, data) {
    return await api.patch(`/Chapter/${chapterId}?seriesId=${seriesId}`, data);
  },

  async updateChapterRate(chapterId, rate) {
    return await api.post(`/Vote/voting-chapter`, { chapterId, rate });
  },
  async submitChapter(seriesId, chapterId, formData) {
    return await api.patch(`/Chapter/${chapterId}?seriesId=${seriesId}`, formData);
  },

  async getProgressingChapter(chapterId, status) {
    return await api.get(`/MangaTask/process-task?ChapterId=${chapterId}&Status=${status}`);
  },

  async getReaderVote(chapterId) {
    return await api.get(`/Vote/${chapterId}`, { silent: true });
  },

};
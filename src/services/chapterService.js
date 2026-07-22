import { api } from "./api";

// Service xử lý các API liên quan đến Chapter (Chương truyện)
export const chaptersService = {

  // Lấy danh sách tất cả các chương của một bộ truyện dựa trên seriesId
  async getAllSeriesBySeriesId(seriesId) {
    // Lưu ý: Đang bị lặp chữ 'await' hai lần, đã giữ nguyên theo mã gốc. 
    return await await api.get(`/Chapter/get-all-chapters?seriesId=${seriesId}`);
  },

  // Lấy chi tiết thông tin của một chương cụ thể (để đọc hoặc sửa đổi)
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

  // Gửi số sao đánh giá (vote/rating) cho một chương truyện cụ thể
  async updateChapterRate(chapterId, rate) {
    return await api.post(`/Vote/voting-chapter`, { chapterId, rate });
  },
  async submitChapter(seriesId, chapterId, formData) {
    return await api.patch(`/Chapter/${chapterId}?seriesId=${seriesId}`, formData);
  },

  async getProgressingChapter(chapterId, status) {
    return await api.get(`/MangaTask/process-task?ChapterId=${chapterId}&Status=${status}`);
  },

  // Lấy số sao mà Reader đã đánh giá cho một chapter cụ thể
  async getReaderVote(chapterId, readerId) {
    return await api.get(`/Vote/${chapterId}/reader/${readerId}`);
  },

};
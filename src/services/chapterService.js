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
    return await await api.get(`/Chapter/get-chapter-details?seriesId=${seriesId}&chapterId=${chapterId}`);
  },

<<<<<<< HEAD
  // (Lưu ý: Hàm này có tên là createSeries nhưng nằm trong chaptersService, 
  // có thể đây là code nháp (placeholder) của người phát triển trước)
  async createSeries(formData) {
    return await api.post("/Series/create-series", formData);
=======
  async createChapter(seriesId,formData) {
    return await api.post(`/Chapter/create-chapter?seriesId=${seriesId}`, formData);
  },
  
  async updateChapterStatus(seriesId, chapterId, data) {
    return await api.patch(`/Chapter/${chapterId}?seriesId=${seriesId}`, data);
  },
  
  async updateChapterRate (chapterId, rate) {
    return await api.post(`/Vote/voting-chapter`, {chapterId, rate});
>>>>>>> 0b26e21b3b492525e93748e53e05227366a59d7f
  }


};
import { api } from "./api";

// Service chuyên gọi các API thao tác dữ liệu về Series (Bộ truyện)
export const seriesService = {
  
  // Hàm lấy toàn bộ danh sách các bộ truyện
  async getAllSeries() {
    return await await api.get("/Series/get-all-series");
  },
  
  // Hàm lấy danh sách các Thể loại truyện (Category / Genre)
  async getAllCategory() {
    return await await api.get("/Category/get-category");
  },

  // Hàm lấy dữ liệu chi tiết của 1 bộ truyện theo ID
  async getSeriesById(seriesId) {
    return await await api.get(`/Series/get-series-details?seriesId=${seriesId}`);
  },

  // Hàm tạo mới một bộ truyện
  // Thường sử dụng formData để gửi kèm file ảnh bìa (Thumbnail/Cover)
  async createSeries(formData) {
    return await api.post("/Series/create-series", formData);
  }
};
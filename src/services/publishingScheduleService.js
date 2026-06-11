import { api } from "./api";

// Service gọi các API quản lý Lịch Xuất Bản (Publishing Schedule)
export const publishingScheduleService = {
  
  // Hàm lấy danh sách toàn bộ các lịch xuất bản đang có trong hệ thống
  async getAllSchedules() {
    return await api.get("/PublishingSchedule/get-all-schedule");
  },

  // Hàm tạo mới một lịch xuất bản cho một bộ truyện cụ thể
  // Tham số: seriesId (ID truyện), payload gồm publishDate (ngày bắt đầu) và publishPeriod (chu kỳ xuất bản)
  async createSchedule(seriesId, { publishDate, publishPeriod }) {
    return await api.post(`/PublishingSchedule/create-schedule?seriesId=${seriesId}`, {
      publishDate,
      publishPeriod
    });
  },

  // Hàm cập nhật (sửa đổi) một lịch xuất bản đã tồn tại
  async updateSchedule(scheduleId, { publishDate, publishPeriod }) {
    return await api.patch(`/PublishingSchedule/update-schedule?scheduleId=${scheduleId}`, {
      publishDate,
      publishPeriod
    });
  },

  // Hàm xóa lịch xuất bản khỏi hệ thống
  async deleteSchedule(scheduleId) {
    return await api.delete(`/PublishingSchedule/delete-schedule?scheduleId=${scheduleId}`);
  }
};

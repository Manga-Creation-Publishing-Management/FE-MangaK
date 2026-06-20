import { api } from "./api";

// Service chuyên gọi các API liên quan đến Bảng Xếp Hạng (Leaderboard)
export const leaderboardService = {

  // Lấy dữ liệu bảng xếp hạng theo Tuần
  async getWeeklyLeaderboard() {
    return await api.get("/Leaderboard/weekly");
  },

  // Lấy dữ liệu bảng xếp hạng theo Tháng
  async getMonthlyLeaderboard() {
    return await api.get("/Leaderboard/monthly");
  },
};

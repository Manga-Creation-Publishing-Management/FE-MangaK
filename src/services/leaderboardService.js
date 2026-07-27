import { api } from "./api";

export const leaderboardService = {

  async getPeriods(type) {
    return await api.get(`/Leaderboard/periods?type=${encodeURIComponent(type)}`, { silent: true });
  },

  async getWeeklyLeaderboard(period) {
    const query = period ? `?period=${encodeURIComponent(period)}` : '';
    return await api.get(`/Leaderboard/weekly${query}`, { silent: true });
  },

  async getMonthlyLeaderboard(period) {
    const query = period ? `?period=${encodeURIComponent(period)}` : '';
    return await api.get(`/Leaderboard/monthly${query}`, { silent: true });
  },
};

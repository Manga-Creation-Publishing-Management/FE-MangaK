import { api } from "./api";

export const publishingScheduleService = {
  async getAllSchedules() {
    return await api.get("/PublishingSchedule/get-all-schedule");
  },

  async createSchedule(seriesId, { publishDate, publishPeriod }) {
    return await api.get(`/PublishingSchedule/create-schedule?seriesId=${seriesId}`, {
      body: {
        publishDate,
        publishPeriod
      }
    });
  },

  async updateSchedule(scheduleId, { publishDate, publishPeriod }) {
    return await api.patch(`/PublishingSchedule/update-schedule?scheduleId=${scheduleId}`, {
      publishDate,
      publishPeriod
    });
  },

  async deleteSchedule(scheduleId) {
    return await api.delete(`/PublishingSchedule/delete-schedule?scheduleId=${scheduleId}`);
  }
};

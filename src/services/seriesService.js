import { api } from "./api";

export const seriesService = {
  async getAllSeries() {
    return await await api.get("/Series/get-all-series");
  },
  
  async getAllCategory() {
    return await await api.get("/Category/get-category");
  },

  async getSeriesById(seriesId) {
    return await await api.get(`/Series/get-series-details?seriesId=${seriesId}`);
  },

  async createSeries(formData) {
    return await api.post("/Series/create-series", formData);
  }
};
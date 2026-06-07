import { api } from "./api";

export const seriesService = {
  async getAllSeries() {
    return await await api.get("/Series/get-all-series");
  }
};
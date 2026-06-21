import { api } from "./api";

export const incomeService = {
  async getIncomeTask(status) {
    return await api.get(`/IncomeTask/get-income-tasks?Status=${status}`);
  },
  async getMonthlyIncomesList() {
    return await api.get(`/IncomeTask/get-income-tasks-history`);
  }
}
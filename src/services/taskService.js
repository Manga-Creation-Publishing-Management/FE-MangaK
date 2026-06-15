import { api } from "./api";

export const taskService = {
  async getAssistantList(role) {
    return await  api.get(`/UserProfile/get-user-list-by-role?UserRole=${role}`);
  },

  async getTaskList() {
    return await api.get(`/MangaTask/get-tasks-list`)
  },

  async createTask(taskData) {
    return await api.post(`/MangaTask/create-tasks`, taskData);
  }
};
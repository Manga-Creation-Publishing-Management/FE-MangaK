import { api } from "./api";

export const authService = {
  async login(email, password) {
    return await api.post("/Auth/login", { email, password });
  },

  async logout() {
    try {
      await api.post("/Auth/logout");
    } catch (error) {
      console.error("Failed to perform logout on backend:", error);
    } finally {
      localStorage.removeItem('mangak-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }
};
import { api } from "./api";

export const authService = {
  async login(email, password) {
    return await api.post("/Auth/login", { email, password });
  },

  async logout() {
    try {
      await api.post("/Auth/logout", {refreshToken: localStorage.getItem('mangak-token')});
    } catch (error) {
      console.error("Failed to perform logout on backend:", error);
    } finally {
      localStorage.removeItem('mangak-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  async loginGoogle (idToken) {
    return await api.post("/Auth/google-login", {idTokenGoogle: idToken});
  }

};
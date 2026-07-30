import { api } from '@/services/api';

export const authService = {
  
  async login(email, password) {
    return await api.post("/Auth/login", { email, password });
  },

  async logout() {
    try {
      
      await api.post("/Auth/logout", {refreshToken: localStorage.getItem('refreshToken')});
    } catch (error) {
      
      console.error("Failed to perform logout on backend:", error);
    } finally {
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async loginGoogle (idToken) {
    return await api.post("/Auth/google-login", {idTokenGoogle: idToken});
  },

  async forgotPassword (email) {
    return await api.post("/Auth/forgot-password", {email});
  },

  async resetPassword (code, newPassword) {
    return await api.post("/Auth/change-password", {code, newPassword});
  }

};
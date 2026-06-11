import { api } from "./api";

// Service xử lý các nghiệp vụ liên quan đến Xác thực (Authentication)
export const authService = {
  
  // Hàm gọi API đăng nhập, gửi email và password lên server để nhận về token
  async login(email, password) {
    return await api.post("/Auth/login", { email, password });
  },

  // Hàm xử lý nghiệp vụ đăng xuất
  async logout() {
    try {
      // Báo cho server biết user muốn đăng xuất, gửi kèm refreshToken để server huỷ hiệu lực
      await api.post("/Auth/logout", {refreshToken: localStorage.getItem('mangak-token')});
    } catch (error) {
      // Dù API thất bại thì vẫn bắt lỗi để tiến trình xóa bộ nhớ ở dưới không bị chặn
      console.error("Failed to perform logout on backend:", error);
    } finally {
      // Dọn dẹp: Xóa toàn bộ thông tin phiên đăng nhập khỏi Local Storage
      localStorage.removeItem('mangak-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }
};
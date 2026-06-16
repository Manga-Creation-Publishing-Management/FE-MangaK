import { api } from "./api"

// Service dùng để xử lý các chức năng liên quan đến tài khoản người dùng
export const userService = {
    // Lấy danh sách toàn bộ người dùng (thường dành cho Admin)
    async getUserList() {
        return api.get('/UserProfile/get-user-list');
    },

    // Lấy thông tin hồ sơ cá nhân của người dùng đang đăng nhập
    async getProfile() {
        return api.get('/UserProfile/get-profile');
    },

    // Cập nhật thông tin hồ sơ cá nhân (avatar, tên, thông tin giới thiệu...)
    async updateProfile(formData) {
        return api.put('/UserProfile/update-profile', formData);
    },

    // API để Admin tạo tài khoản mới cho các role khác nhau
    // Tham số role truyền trên URL query, thông tin user truyền trong body
    async createUser(role, userData) {
        return api.post(`/Auth/register?role=${role}`, userData);
    },

    // Cập nhật trạng thái người dùng (Active / Inactive)
    async updateUserStatus(userId, status) {
        return api.put(`/UserProfile/update-user-status?userId=${userId}&status=${status}`);
    }
};


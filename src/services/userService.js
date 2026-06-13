import { api } from "./api"

export const userService = {
    async getUserList() {
        return api.get('/UserProfile/get-user-list');
    },

    async getProfile() {
        return api.get('/UserProfile/get-profile');
    },

    async updateProfile(formData) {
        return api.put('/UserProfile/update-profile', formData);
    },

    async createUser(role, userData) {
        return api.post(`/Auth/register?role=${role}`, userData);
    }
};

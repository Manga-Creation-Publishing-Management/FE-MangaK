import { api } from '@/services/api';

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
    },

    async updateUserStatus(userId, status, supervisorId = null) {
        let url = `/UserProfile/update-user-status?userId=${userId}&status=${status}`;
        if (supervisorId !== null && supervisorId !== undefined) {
            url += `&supervisorId=${supervisorId}`;
        }
        return api.put(url);
    },

    async getTantouList() {
        return api.get('/UserProfile/get-tantou-list');
    },

    async getReaderList() {
        return api.get('/UserProfile/get-reader-list');
    }
};

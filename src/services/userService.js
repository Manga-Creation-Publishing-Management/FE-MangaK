import { api } from "./api"

export const userService = {
    async getUserList() {
        return api.get('/UserProfile/get-user-list');
    },

    async createUser(role, userData) {
        return api.post(`/Auth/register?role=${role}`, userData);
    }
};

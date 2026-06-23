import { api } from "./api";

// Service xử lý các API liên quan đến Feedback (Phản hồi)
export const feedbackService = {
  // Lấy danh sách feedback từ database
  async getFeedbackList() {
    return await api.get("/Feedback/get-feedback-list");
  }
};

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
  },
  async getTaskListByAssistant() {
    return await api.get(`/MangaTask/get-tasks-list`)
  },
  async getTaskDetail(taskId) {
    return await api.get(`/MangaTask/get-tasks-details?TaskId=${taskId}`)
  },

  //api dùng để claim, deny task
  async updateTaskStatus(taskId, status) {
    return await api.put('/MangaTask/update-task-status', {
      taskId: taskId,
      status: status
    });
  },
  async updateTaskDeadline(taskId, deadline) {
    return await api.put('/MangaTask/update-manga-task', {
      taskId: taskId,
      deadline: deadline
    });
  },
  //api dung de approve task
  async approvedTask(taskId, feedbackContent) {
    return await api.put('/MangaTask/review-task',   {
  taskId: taskId,
  status: "Completed",
  feedbackContent: feedbackContent,
  salaryPercentage: ""});
  },
  //api dung de reject task
  async rejectTask(taskId, feedbackContent) {
    return await api.put('/MangaTask/review-task', 
    {
      taskId: taskId,
      status: "Revising",
      feedbackContent: feedbackContent,
      salaryPercentage: ""
    });
  },

  //api dung de unsatisfied task
  async unsatisfiedTask(taskId, feedbackContent, percentage) {
    return await api.put('/MangaTask/review-task', 
    {
      taskId: taskId,
      status: "Unsatisfied",
      feedbackContent: feedbackContent,
      salaryPercentage: percentage
    });
  },

  async submitTask(formData) {
    return await api.put('/MangaTask/submit-task', formData);
  }
};
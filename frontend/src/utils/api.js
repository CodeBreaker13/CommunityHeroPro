import axios from "axios";

const api = axios.create({ baseURL: "/api", timeout: 20000 });

export const getIssues = (params = {}) => api.get("/issues", { params });
export const getIssue = (id) => api.get(`/issues/${id}`);
export const createIssue = (data) => api.post("/issues", data);
export const voteIssue = (id) => api.post(`/issues/${id}/vote`);
export const resolveIssue = (id) => api.post(`/issues/${id}/resolve`);

export const getStats = () => api.get("/stats");
export const getLeaderboard = () => api.get("/leaderboard");
export const getHeatmap = () => api.get("/map/heatmap");

// AI endpoints
export const categorizeImage = (image_base64) =>
  api.post("/ai/categorize-image", { image_base64 });

export const getAIInsights = () => api.get("/ai/insights");

export const aiChat = (message) => api.post("/ai/chat", { message });

export const summarizeIssue = (issue) =>
  api.post("/ai/summarize", { issue });

export default api;

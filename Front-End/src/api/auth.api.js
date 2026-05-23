import api from "./axios";

export const login             = (data) => api.post("/auth/login", data);
export const getMe             = ()     => api.get("/auth/me");
export const changePassword    = (data) => api.patch("/auth/change-password", data);
// export const registerStaff     = (data) => api.post("/auth/register", data);
// export const resetUserPassword = (userId, data) => api.patch(`/auth/reset-password/${userId}`, data);
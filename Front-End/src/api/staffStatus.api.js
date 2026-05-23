import api from "./axios";

export const changeStatus      = (data)   => api.patch("/staff-status/change", data);
export const getCurrentStatus  = ()       => api.get("/staff-status/current");
export const getAllActiveStatuses = ()     => api.get("/staff-status/all");
export const getStatusHistory  = (params) => api.get("/staff-status/history", { params });
export const getStaffHistory   = (userId, params) => api.get(`/staff-status/history/${userId}`, { params });
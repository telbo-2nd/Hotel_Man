import api from "./axios";

export const getStaff = (params) => {
    return api.get("/staff", { params });
};

export const getStaffById = (id) => {
    return api.get(`/staff/${id}`);
};

export const createStaff = (data) => {
    return api.post("/staff/register", data);
};

export const updateStaff = (id, data) => {
    return api.patch(`/staff/${id}`, data);
};

export const terminateStaff = (id) => {
    return api.patch(`/staff/${id}/terminate`);
};

export const resetUserPassword = (id, data) => {
    return api.patch(`/auth/reset-password/${id}`, data);
};
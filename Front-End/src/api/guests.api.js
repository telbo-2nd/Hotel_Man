import api from "./axios";

export const getGuests    = (params) => api.get("/guests", { params });
export const getGuestById = (id)     => api.get(`/guests/${id}`);
export const createGuest  = (data)   => api.post("/guests", data);
export const updateGuest  = (id, data) => api.patch(`/guests/${id}`, data);
export const deleteGuest  = (id)     => api.delete(`/guests/${id}`);
import api from "./axios";

export const getRoomTypes    = (params)   => api.get("/room-types", { params });
export const getRoomTypeById = (id)       => api.get(`/room-types/${id}`);
export const createRoomType  = (data)     => api.post("/room-types", data);
export const updateRoomType  = (id, data) => api.patch(`/room-types/${id}`, data);
export const deleteRoomType  = (id)       => api.delete(`/room-types/${id}`);
import api from "./axios";

export const getHotelConfigs  = ()     => api.get("/hotel-config");
export const updateHotelConfig = (data) => api.patch("/hotel-config", data);
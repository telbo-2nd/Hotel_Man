import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard, getReceptionistDashboard } from "../api/dashboard.api";

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ["dashboard", "admin"],
        queryFn:  () => getAdminDashboard().then((res) => res.data.data),
    });
};

export const useReceptionistDashboard = () => {
    return useQuery({
        queryKey: ["dashboard", "receptionist"],
        queryFn:  () => getReceptionistDashboard().then((res) => res.data.data),
    });
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { changeStatus, getCurrentStatus, getAllActiveStatuses, getStatusHistory } from "../api/staffStatus.api";
import { useSocket } from "../context/SocketContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useCurrentStatus = () => {
    return useQuery({
        queryKey: ["staffStatus", "current"],
        queryFn:  () => getCurrentStatus().then((res) => res.data.record),
    });
};

export const useAllActiveStatuses = () => {
    const queryClient        = useQueryClient();
    const { liveStatuses }   = useSocket();

    // when socket pushes a new status — update query cache
    useEffect(() => {
        if (Object.keys(liveStatuses).length > 0) {
            queryClient.invalidateQueries({ queryKey: ["staffStatus", "all"] });
        }
    }, [liveStatuses]);

    return useQuery({
        queryKey: ["staffStatus", "all"],
        queryFn:  () => getAllActiveStatuses().then((res) => res.data.records),
        refetchInterval: 30000, // refetch every 30s as fallback
    });
};

export const useChangeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => changeStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staffStatus"] });
            toast.success("Status updated");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update status");
        },
    });
};

export const useStatusHistory = (params) => {
    return useQuery({
        queryKey: ["staffStatus", "history", params],
        queryFn:  () => getStatusHistory(params).then((res) => res.data.records),
    });
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms, getRoomById, getAvailableRooms, createRoom, updateRoom, deleteRoom } from "../api/rooms.api";
import toast from "react-hot-toast";

export const useRooms = (params) => {
    return useQuery({
        queryKey: ["rooms", params],
        queryFn:  () => getRooms(params).then((res) => res.data),
    });
};

export const useRoom = (id) => {
    return useQuery({
        queryKey: ["rooms", id],
        queryFn:  () => getRoomById(id).then((res) => res.data),
        enabled:  !!id,
    });
};

export const useAvailableRooms = (params, enabled = false) => {
    return useQuery({
        queryKey: ["rooms", "available", params],
        queryFn:  () => getAvailableRooms(params).then((res) => res.data),
        enabled,
    });
};

export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createRoom(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Room created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useUpdateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateRoom(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Room updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteRoom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Room deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};
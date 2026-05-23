import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoomTypes, getRoomTypeById, createRoomType, updateRoomType, deleteRoomType } from "../api/roomTypes.api";
import toast from "react-hot-toast";

export const useRoomTypes = (params) => {
    return useQuery({
        queryKey: ["roomTypes", params],
        queryFn:  () => getRoomTypes(params).then((res) => res.data),
    });
};

export const useRoomType = (id) => {
    return useQuery({
        queryKey: ["roomTypes", id],
        queryFn:  () => getRoomTypeById(id).then((res) => res.data),
        enabled:  !!id,
    });
};

export const useCreateRoomType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createRoomType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
            toast.success("Room type created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useUpdateRoomType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateRoomType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
            toast.success("Room type updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useDeleteRoomType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteRoomType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
            toast.success("Room type deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};
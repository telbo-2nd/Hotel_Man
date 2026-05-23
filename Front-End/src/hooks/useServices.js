import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices, getServiceById, createService, updateService, deleteService } from "../api/services.api";
import toast from "react-hot-toast";

export const useServices = (params) => {
    return useQuery({
        queryKey: ["services", params],
        queryFn:  () => getServices(params).then((res) => res.data),
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            toast.success("Service created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            toast.success("Service updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
            toast.success("Service deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};
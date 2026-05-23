    import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
    import { getGuests, getGuestById, createGuest, updateGuest, deleteGuest } from "../api/guests.api";
    import toast from "react-hot-toast";

    export const useGuests = (params) => {
        return useQuery({
            queryKey: ["guests", params],
            queryFn:  () => getGuests(params).then((res) => res.data),
        });
    };

    export const useGuest = (id) => {
        return useQuery({
            queryKey: ["guests", id],
            queryFn:  () => getGuestById(id).then((res) => res.data),
            enabled:  !!id,
        });
    };

    export const useCreateGuest = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (data) => createGuest(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["guests"] });
                toast.success("Guest created successfully");
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    };

    export const useUpdateGuest = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, data }) => updateGuest(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["guests"] });
                toast.success("Guest updated successfully");
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    };

    export const useDeleteGuest = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id) => deleteGuest(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["guests"] });
                toast.success("Guest deleted successfully");
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || "Something went wrong");
            },
        });
    };
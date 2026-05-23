import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookings, getBookingById, createBooking, updateBooking, deleteBooking } from "../api/bookings.api";
import toast from "react-hot-toast";

export const useBookings = (params) => {
    return useQuery({
        queryKey: ["bookings", params],
        queryFn:  () => getBookings(params).then((res) => res.data),
    });
};

export const useBooking = (id) => {
    return useQuery({
        queryKey: ["bookings", id],
        queryFn:  () => getBookingById(id).then((res) => res.data),
        enabled:  !!id,
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Booking created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateBooking(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Booking updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Booking deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getStaff,
    getStaffById,
    createStaff,
    updateStaff,
    terminateStaff,
    resetUserPassword,
} from "../api/staff.api";

import toast from "react-hot-toast";


// GET ALL
export const useStaff = (params) => {
    return useQuery({
        queryKey: ["staff", params],
        queryFn: () =>
            getStaff(params).then((res) => res.data),
    });
};


// GET ONE
export const useStaffMember = (id) => {
    return useQuery({
        queryKey: ["staff", id],
        queryFn: () =>
            getStaffById(id).then((res) => res.data.staff),
        enabled: !!id,
    });
};


// CREATE
export const useCreateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createStaff(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["staff"],
            });

            toast.success(
                "Staff member created successfully"
            );
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        },
    });
};


// UPDATE
export const useUpdateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) =>
            updateStaff(id, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["staff"],
            });

            queryClient.invalidateQueries({
                queryKey: ["staff", variables.id],
            });

            toast.success(
                "Staff updated successfully"
            );
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        },
    });
};


// TERMINATE
export const useTerminateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) =>
            terminateStaff(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["staff"],
            });

            toast.success(
                "Staff terminated successfully"
            );
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        },
    });
};


// RESET PASSWORD
export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ id, newPassword }) =>
            resetUserPassword(id, { newPassword }),
        onSuccess: () => {
            toast.success("Password reset successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};
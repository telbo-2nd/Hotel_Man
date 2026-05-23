import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHotelConfigs, updateHotelConfig } from "../api/hotelConfig.api";
import toast from "react-hot-toast";

export const useHotelConfig = () => {
    return useQuery({
        queryKey: ["hotelConfig"],
        queryFn:  () => getHotelConfigs().then((res) => res.data),
    });
};

export const useUpdateHotelConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateHotelConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hotelConfig"] });
            toast.success("Setting updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        },
    });
};
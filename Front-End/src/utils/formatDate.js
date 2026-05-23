export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year:  "numeric",
        month: "short",
        day:   "numeric",
    });
};

export const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day:   "numeric",
    });
};
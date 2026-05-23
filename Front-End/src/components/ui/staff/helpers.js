export const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const STATUS_COLOR = {
    active:     "bg-green-100 text-green-700",
    terminated: "bg-red-100   text-red-700",
};

export const AUX_LABEL = {
    working:    "Working",
    break:      "On Break",
    management: "Management",
    off_duty:   "Off Duty",
    on_leave:   "On Leave",
};

export function initials(first, last) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });
}

export function weeklyHours(schedule = []) {
    return schedule.reduce((total, s) => {
        const [sh, sm] = s.startTime.split(":").map(Number);
        const [eh, em] = s.endTime.split(":").map(Number);
        return total + (eh * 60 + em - sh * 60 - sm) / 60;
    }, 0);
}
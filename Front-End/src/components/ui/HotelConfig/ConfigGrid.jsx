import {
    Hotel, Layers, DollarSign,
    CalendarDays, LogIn, LogOut,
} from "lucide-react";
import ConfigCard from "./ConfigCard";

const CONFIG_ICONS = {
    hotel_name:       Hotel,
    hotel_floors:     Layers,
    currency:         DollarSign,
    max_booking_days: CalendarDays,
    check_in_time:    LogIn,
    check_out_time:   LogOut,
};

const CONFIG_ORDER = [
    "hotel_name",
    "hotel_floors",
    "currency",
    "max_booking_days",
    "check_in_time",
    "check_out_time",
];

export default function ConfigGrid({ configs, onSave, isSaving }) {
    // sort by our defined order
    const sorted = [...configs].sort((a, b) => {
        return CONFIG_ORDER.indexOf(a.key) - CONFIG_ORDER.indexOf(b.key);
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map((config) => (
                <ConfigCard
                    key={config.key}
                    config={config}
                    icon={CONFIG_ICONS[config.key] || Hotel}
                    onSave={onSave}
                    isSaving={isSaving}
                />
            ))}
        </div>
    );
}
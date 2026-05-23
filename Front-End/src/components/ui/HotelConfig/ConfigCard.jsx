import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

export default function ConfigCard({ config, icon: Icon, onSave, isSaving }) {
    const [editing, setEditing] = useState(false);
    const [value,   setValue]   = useState(config.value);

    const handleSave = () => {
        onSave({ key: config.key, value }, {
            onSuccess: () => setEditing(false),
        });
    };

    const handleCancel = () => {
        setValue(config.value);
        setEditing(false);
    };

    const labels = {
        hotel_name:       "Hotel Name",
        hotel_floors:     "Total Floors",
        currency:         "System Currency",
        max_booking_days: "Max Booking Length",
        check_in_time:    "Standard Check-in",
        check_out_time:   "Standard Check-out",
    };

    const descriptions = {
        hotel_name:       "The public-facing name used in all guest communications.",
        hotel_floors:     "Used for mapping room clusters and floor validation.",
        currency:         "Base currency for all folios, billing, and tax calculations.",
        max_booking_days: "Maximum duration for a single reservation before requiring re-check-in.",
        check_in_time:    "Time when rooms are guaranteed available for new arrivals.",
        check_out_time:   "Deadline for room vacancy before late fees may apply.",
    };

    const suffixes = {
        hotel_floors:     "Levels in structure",
        max_booking_days: "Nights",
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">

            {/* header */}
            <div className="flex items-start justify-between">
                <div className="bg-blue-50 p-2.5 rounded-lg">
                    <Icon className="w-5 h-5 text-[#1a3a6e]" />
                </div>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="text-xs font-medium text-[#1a3a6e] hover:underline flex items-center gap-1"
                    >
                        <Pencil className="w-3 h-3" /> Edit
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="text-xs font-medium text-green-600 hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                            <Check className="w-3 h-3" />
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="text-xs font-medium text-gray-400 hover:underline flex items-center gap-1"
                        >
                            <X className="w-3 h-3" /> Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* label */}
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                    {labels[config.key] || config.key}
                </p>

                {/* value / input */}
                {!editing ? (
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-gray-800">{config.value}</p>
                        {suffixes[config.key] && (
                            <p className="text-sm text-gray-400">{suffixes[config.key]}</p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {config.key === "check_in_time" || config.key === "check_out_time" ? (
                            <input
                                type="time"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            />
                        ) : config.key === "hotel_floors" || config.key === "max_booking_days" ? (
                            <>
                                <input
                                    type="number"
                                    min="1"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                                />
                                {suffixes[config.key] && (
                                    <p className="text-sm text-gray-400">{suffixes[config.key]}</p>
                                )}
                            </>
                        ) : config.key === "currency" ? (
                            <select
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] bg-white"
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="EGP">EGP - Egyptian Pound</option>
                                <option value="SAR">SAR - Saudi Riyal</option>
                                <option value="AED">AED - UAE Dirham</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* description */}
            <p className="text-xs text-gray-400 leading-relaxed">
                {descriptions[config.key] || config.description || ""}
            </p>
        </div>
    );
}
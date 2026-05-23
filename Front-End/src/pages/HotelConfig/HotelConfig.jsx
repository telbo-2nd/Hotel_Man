import { Settings } from "lucide-react";
import { useHotelConfig, useUpdateHotelConfig } from "../../hooks/useHotelConfig";
import Spinner           from "../../components/ui/Spinner";
import ConfigGrid        from "../../components/ui/HotelConfig/ConfigGrid";
import ConfigAuditBanner from "../../components/ui/HotelConfig/ConfigAuditBanner";

export default function HotelConfig() {
    const { data, isLoading } = useHotelConfig();
    const { mutate: updateConfig, isPending: isSaving } = useUpdateHotelConfig();

    const configs = data?.configs || [];

    return (
        <div className="space-y-5">

            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hotel Configuration</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Global parameters and operational settings for GrandStay Pro
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-lg">
                    <Settings className="w-4 h-4" />
                    System Settings
                </div>
            </div>

            {/* audit banner */}
            <ConfigAuditBanner />

            {/* config grid */}
            {isLoading ? (
                <Spinner />
            ) : configs.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">
                    No configurations found. Run the hotel config seeder first.
                </div>
            ) : (
                <ConfigGrid
                    configs={configs}
                    onSave={updateConfig}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}
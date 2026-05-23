import { Info } from "lucide-react";

export default function ConfigAuditBanner() {
    return (
        <div className="bg-white rounded-xl border-l-4 border-l-[#1a3a6e] border border-gray-100 p-5 flex items-center justify-between">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#1a3a6e] flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-gray-800">Configuration Audit</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Changes to hotel configuration take effect immediately across all system modules.
                        Each setting is saved individually when you click Save.
                    </p>
                </div>
            </div>
        </div>
    );
}
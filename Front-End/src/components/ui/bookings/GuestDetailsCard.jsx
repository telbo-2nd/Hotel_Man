import { Mail, Phone } from "lucide-react";

export default function GuestDetailsCard({ guest, onViewProfile }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Guest Details
            </h3>

            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white font-bold">
                    {guest?.Firstname?.[0]}{guest?.Lastname?.[0]}
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{guest?.Firstname} {guest?.Lastname}</p>
                    <p className="text-xs text-gray-400">Primary Guest</p>
                </div>
            </div>

            <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {guest?.email}
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {guest?.phone}
                </div>
            </div>

            <button
                onClick={onViewProfile}
                className="mt-4 w-full py-2 text-sm text-[#1a3a6e] border border-[#1a3a6e] rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
                View Guest Profile
            </button>
        </div>
    );
}
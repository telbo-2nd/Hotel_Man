import { Phone } from "lucide-react";

export default function ContactInfoCard({ staff }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-[#1a3a6e]" />
                <h3 className="font-semibold text-gray-800 text-base">Contact Information</h3>
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email Address</p>
                    <p className="mt-1 text-[#1a3a6e] font-medium">{staff.email}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone Number</p>
                    <p className="mt-1 text-gray-800 font-medium">{staff.phone || "—"}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">National ID</p>
                    <p className="mt-1 text-gray-800 font-medium">
                        {staff.nationalId ? `XXXX-XXXX-${staff.nationalId.slice(-4)}` : "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}
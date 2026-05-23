import { Mail, Phone, CreditCard, Pencil, Trash2 } from "lucide-react";
import Button from "../Button";

export default function GuestProfileCard({ guest, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 rounded-xl bg-[#1a3a6e] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {guest.Firstname?.[0]}{guest.Lastname?.[0]}
            </div>
            <h2 className="text-lg font-bold text-gray-900">
                {guest.Firstname} {guest.Lastname}
            </h2>

            <div className="mt-5 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {guest.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {guest.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {guest.nationalId}
                </div>
            </div>

            <div className="mt-5 space-y-2">
                <Button icon={Pencil} className="w-full" onClick={onEdit}>
                    Edit Guest
                </Button>
                <Button icon={Trash2} variant="danger" className="w-full" onClick={onDelete}>
                    Delete Guest
                </Button>
            </div>
        </div>
    );
}
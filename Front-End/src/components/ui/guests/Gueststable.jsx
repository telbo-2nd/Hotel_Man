import { Eye, Pencil, Trash2, Plus, Users } from "lucide-react";
import Button     from "../Button";
import EmptyState from "../EmptyState";
import Spinner    from "../Spinner";
import Pagination from "../Pagination";

export default function GuestsTable({ data, isLoading, page, onPageChange, onView, onEdit, onDelete, onAdd }) {
    if (isLoading) return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <Spinner />
        </div>
    );

    if (!data?.guests?.length) return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <EmptyState
                icon={Users}
                title="No guests found"
                description="Register your first guest to get started"
                action={<Button icon={Plus} onClick={onAdd}>Register Guest</Button>}
            />
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        {["Guest Information", "Email Address", "Phone Number", "National ID", "Actions"].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {data.guests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {guest.Firstname?.[0]}{guest.Lastname?.[0]}
                                    </div>
                                    <p className="font-medium text-gray-800">
                                        {guest.Firstname} {guest.Lastname}
                                    </p>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-gray-600">{guest.email}</td>
                            <td className="px-5 py-4 text-gray-600">{guest.phone}</td>
                            <td className="px-5 py-4 text-gray-600">{guest.nationalId}</td>
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onView(guest.id)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3a6e] hover:bg-blue-50 transition-colors"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(guest)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(guest)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="px-5 border-t border-gray-100">
                <Pagination
                    page={page}
                    totalPages={data.totalPages || 1}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}
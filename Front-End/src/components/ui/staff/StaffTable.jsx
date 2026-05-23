import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Plus, Users } from "lucide-react";
import Button     from "../Button";
import Pagination from "../Pagination";
import EmptyState from "../EmptyState";
import Spinner    from "../Spinner";
import StatusTimer from "../StatusTimer";
import { useSocket } from "../../../context/SocketContext";

const ROLE_STYLES = {
    admin:        "bg-blue-50 text-blue-700 border border-blue-200",
    receptionist: "bg-teal-50 text-teal-700 border border-teal-200",
};

const STATUS_DOT = {
    active:     "bg-green-500",
    terminated: "bg-red-400",
};

const AUX_LABEL = {
    working:    "Working",
    break:      "On Break",
    management: "Management",
    off_duty:   "Off Duty",
    on_leave:   "On Leave",
};

const Aux_COLOR = {
    working:    "bg-green-500",
    break:      "bg-yellow-500",
    management: "bg-blue-500",
    off_duty:   "bg-gray-400",
    on_leave:   "bg-red-400",
};

function initials(first, last) {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

export default function StaffTable({
    data,
    isLoading,
    page,
    onPageChange,
    onAddClick,
    onTerminate,
}) {
    const navigate = useNavigate();
    const { liveStatuses, onlineStaff } = useSocket();

    if (isLoading) return <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><Spinner /></div>;

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {data?.staff?.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No staff members found"
                    description="Register your first staff member to get started"
                    action={
                        <Button icon={Plus} onClick={onAddClick}>
                            Add Staff
                        </Button>
                    }
                />
            ) : (
                <>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Name & Identification", "Role", "Join Date", "Status", "Actions"].map((h) => (
                                    <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data?.staff?.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">

                                    {/* Name */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {initials(member.Firstname, member.Lastname)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {member.Firstname} {member.Lastname}
                                                </p>
                                                <p className="text-xs text-gray-400">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role */}
                                    <td className="px-5 py-4">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[member.role] ?? ""}`}>
                                            {member.role}
                                        </span>
                                    </td>

                                    {/* Join Date */}
                                    <td className="px-5 py-4 text-gray-600">
                                        {member.joinDate
                                            ? new Date(member.joinDate).toLocaleDateString("en-US", {
                                                month: "short", day: "2-digit", year: "numeric",
                                            })
                                            : "—"}
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                {/* online/offline dot */}
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                    onlineStaff[member.id] ? "bg-green-500" : "bg-gray-300"
                                                }`} />
                                                {/* aux status label */}
                                                <span className="text-gray-700 text-sm">
                                                    {member.employmentStatus === "active"
                                                        ? (AUX_LABEL[liveStatuses[member.id]?.status || member.auxStatus] ?? "Active")
                                                        : "Terminated"
                                                    }
                                                </span>
                                            </div>
                                            {/* live timer */}
                                            {member.employmentStatus === "active" && onlineStaff[member.id] && (
                                                <StatusTimer
                                                    startedAt={
                                                        liveStatuses[member.id]?.startedAt ||
                                                        member.auxStatusChangedAt
                                                    }
                                                    className="text-gray-400 pl-3.5"
                                                />
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/staff/${member.id}`)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3a6e] hover:bg-blue-50 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {member.employmentStatus !== "terminated" && (
                                                <button
                                                    onClick={() => onTerminate(member)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Terminate"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="px-5 border-t border-gray-100">
                        <Pagination
                            page={page}
                            totalPages={data?.totalPages || 1}
                            onPageChange={onPageChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
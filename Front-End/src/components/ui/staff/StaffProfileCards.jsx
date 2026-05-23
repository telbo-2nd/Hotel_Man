import { Pencil, RotateCcw } from "lucide-react";
import Button from "../Button";
import { initials, STATUS_COLOR, AUX_LABEL } from "./helpers";
import StatusTimer from "../StatusTimer";
import { useSocket } from "../../../context/SocketContext";
export default function StaffProfileCard({ staff, liveStatus, onEdit, onResetPassword, onTerminate }) {
    const isTerminated = staff.employmentStatus === "terminated";
    const { onlineStaff } = useSocket();
    const isOnline = !!onlineStaff[staff.id];
    const currentAux   = liveStatus?.status || staff.auxStatus;
    
    // map to color — add this inside the component
    const STATUS_DOT = {
        working:    "bg-green-500",
        break:      "bg-yellow-500",
        management: "bg-blue-500",
        off_duty:   "bg-gray-400",
        on_leave:   "bg-red-400",
    };
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
                {staff.profileImage ? (
                    <img
                        src={staff.profileImage}
                        alt={`${staff.Firstname} ${staff.Lastname}`}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-2xl font-bold">
                        {initials(staff.Firstname, staff.Lastname)}
                    </div>
                )}
                {!isTerminated && isOnline &&(
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                )}
            </div>

            <h2 className="text-lg font-bold text-gray-900">
                {staff.Firstname} {staff.Lastname}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{staff.jobTitle || "Staff Member"}</p>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[currentAux] || "bg-gray-400"}`} />
                {isTerminated ? "Terminated" : (AUX_LABEL[currentAux] ?? "Active")}
                {!isTerminated && liveStatus?.startedAt && (
                    <>
                        <span className="text-gray-400">·</span>
                        <StatusTimer startedAt={liveStatus.startedAt} className="text-gray-500" />
                    </>
                )}
            </div>

            {!isTerminated && (
                <div className="w-full mt-5 space-y-2">
                    <Button icon={Pencil} className="w-full justify-center" onClick={onEdit}>
                        Edit Profile
                    </Button>
                    <Button icon={RotateCcw} variant="secondary" className="w-full justify-center" onClick={onResetPassword}>
                        Reset Password
                    </Button>
                    <button
                        onClick={onTerminate}
                        className="w-full text-sm font-medium text-red-600 hover:text-red-700 transition-colors py-2"
                    >
                        Deactivate Account
                    </button>
                </div>
            )}
        </div>
    );
}
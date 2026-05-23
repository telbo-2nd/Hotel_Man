import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useCurrentStatus, useChangeStatus } from "../../hooks/useStaffStatus";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, CreditCard, Briefcase, Wifi, WifiOff } from "lucide-react";
import StatusTimer from "../../components/ui/StatusTimer";
import Modal  from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input  from "../../components/ui/Input";
import { changePassword } from "../../api/auth.api";
import toast from "react-hot-toast";
import { useStatusHistory } from "../../hooks/useStaffStatus";

const STATUS_OPTIONS = [
    { value: "working",    label: "Working",    color: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50  border-green-200" },
    { value: "break",      label: "On Break",   color: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
    { value: "management", label: "Management", color: "bg-blue-500",   text: "text-blue-700",   bg: "bg-blue-50   border-blue-200" },
    { value: "off_duty",   label: "Off Duty",   color: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-50   border-gray-200" },
    { value: "on_leave",   label: "On Leave",   color: "bg-red-400",    text: "text-red-700",    bg: "bg-red-50    border-red-200" },
];

export default function Profile() {
    const { user }     = useAuth();
    const { connected } = useSocket();
    const { data: currentStatus, isLoading } = useCurrentStatus();
    const { mutate: changeStatusFn, isPending: changingStatus } = useChangeStatus();

    const [pwModal, setPwModal] = useState(false);
    const [changingPw, setChangingPw] = useState(false);
    const pwForm = useForm();

    const liveAuxStatus = currentStatus?.status || user?.auxStatus;
    const activeStatus  = STATUS_OPTIONS.find((s) => s.value === liveAuxStatus) || STATUS_OPTIONS[0];

    const handleStatusChange = (newStatus) => {
        if (newStatus === user?.auxStatus) return;
        changeStatusFn({ status: newStatus });
    };

    const handleChangePassword = async (data) => {
        setChangingPw(true);
        try {
            await changePassword(data);
            toast.success("Password changed successfully");
            setPwModal(false);
            pwForm.reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setChangingPw(false);
        }
    };

    const initials = `${user?.Firstname?.[0] || ""}${user?.Lastname?.[0] || ""}`.toUpperCase();

    return (
        <div className="space-y-5 max-w-4xl">

            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage your account and current status
                    </p>
                </div>
                {/* connection indicator */}
                <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
                    connected
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-600"
                }`}>
                    {connected
                        ? <><Wifi className="w-3.5 h-3.5" /> Live</>
                        : <><WifiOff className="w-3.5 h-3.5" /> Offline</>
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* left — profile card */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">

                        {/* avatar */}
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <div className="w-20 h-20 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-2xl font-bold">
                                {initials}
                            </div>
                            {/* live status dot */}
                            <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white ${activeStatus.color}`} />
                        </div>

                        <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-sm text-gray-500 capitalize">{user?.jobTitle || user?.role}</p>

                        {/* current status badge */}
                        <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${activeStatus.bg} ${activeStatus.text}`}>
                            <span className={`w-2 h-2 rounded-full ${activeStatus.color}`} />
                            {activeStatus.label}
                            {currentStatus && (
                                <>
                                    <span className="text-gray-400">·</span>
                                    <StatusTimer
                                        startedAt={currentStatus.startedAt}
                                        className={activeStatus.text}
                                    />
                                </>
                            )}
                        </div>

                        {/* contact info */}
                        <div className="mt-5 space-y-2.5 text-left">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {user?.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {user?.phone || "—"}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="capitalize">{user?.role}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {user?.nationalId
                                    ? `XXXX-XXXX-${user.nationalId.slice(-4)}`
                                    : "—"}
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full mt-5"
                            onClick={() => setPwModal(true)}
                        >
                            Change Password
                        </Button>
                    </div>
                </div>

                {/* right — status switcher */}
                <div className="lg:col-span-2 space-y-4">

                    {/* status switcher */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="text-base font-semibold text-gray-800 mb-1">
                            Current Status
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            Your status is visible to admin in real-time
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {STATUS_OPTIONS.map((option) => {
                                const isActive = user?.auxStatus === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleStatusChange(option.value)}
                                        disabled={changingStatus}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                                            ${isActive
                                                ? `${option.bg} border-current ${option.text} shadow-sm`
                                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                            } disabled:opacity-50`}
                                    >
                                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${option.color}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{option.label}</p>
                                            {isActive && currentStatus && (
                                                <StatusTimer
                                                    startedAt={currentStatus.startedAt}
                                                    className="text-xs opacity-70"
                                                />
                                            )}
                                        </div>
                                        {isActive && (
                                            <span className="text-xs font-semibold">Active</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* today's status timeline */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">
                            Today's Activity
                        </h3>
                        <TodayTimeline />
                    </div>
                </div>
            </div>

            {/* change password modal */}
            <Modal isOpen={pwModal} onClose={() => { setPwModal(false); pwForm.reset(); }} title="Change Password" size="sm">
                <form onSubmit={pwForm.handleSubmit(handleChangePassword)} className="space-y-4">
                    <Input
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        placeholder="Your current password"
                        register={pwForm.register}
                        required
                    />
                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="Min 6 characters"
                        register={pwForm.register}
                        required
                    />
                    <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Repeat new password"
                        register={pwForm.register}
                        required
                    />
                    <div className="flex gap-3 pt-1">
                        <Button type="button" variant="secondary" className="flex-1"
                            onClick={() => { setPwModal(false); pwForm.reset(); }}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" loading={changingPw}>
                            Change Password
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}



function TodayTimeline() {
    const { data: history, isLoading } = useStatusHistory({
        date: new Date().toISOString().split("T")[0],
    });

    const STATUS_COLORS = {
        working:    "bg-green-500",
        break:      "bg-yellow-500",
        management: "bg-blue-500",
        off_duty:   "bg-gray-400",
        on_leave:   "bg-red-400",
    };

    const STATUS_LABELS = {
        working:    "Working",
        break:      "On Break",
        management: "Management",
        off_duty:   "Off Duty",
        on_leave:   "On Leave",
    };

    if (isLoading) return <p className="text-sm text-gray-400">Loading...</p>;
    if (!history?.length) return (
        <p className="text-sm text-gray-400 text-center py-6">No activity recorded today</p>
    );

    return (
        <div className="space-y-2">
            {history.map((record) => {
                const start    = new Date(record.startedAt);
                const end      = record.endedAt ? new Date(record.endedAt) : new Date();
                const duration = Math.round((end - start) / (1000 * 60));

                return (
                    <div key={record.id} className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_COLORS[record.status]}`} />
                        <div className="flex-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">
                                {STATUS_LABELS[record.status]}
                            </span>
                            <span className="text-gray-400 text-xs">
                                {start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                {" → "}
                                {record.endedAt
                                    ? end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                                    : "now"
                                }
                                {" · "}
                                <span className="font-medium text-gray-600">
                                    {duration < 60
                                        ? `${duration}m`
                                        : `${Math.floor(duration / 60)}h ${duration % 60}m`
                                    }
                                </span>
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
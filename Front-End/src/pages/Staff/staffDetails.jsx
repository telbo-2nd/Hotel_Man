import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ChevronRight } from "lucide-react";
import { useAllActiveStatuses } from "../../hooks/useStaffStatus";

import {
    useStaffMember,
    useUpdateStaff,
    useTerminateStaff,
    useResetPassword,
} from "../../hooks/useStaff";
import Spinner from "../../components/ui/Spinner";

import EmploymentInfoCard  from "../../components/ui/staff/EmploymentInfoCard";
import ContactInfoCard     from "../../components/ui/staff/ContactInfoCard";
import ScheduleCard        from "../../components/ui/staff/Schedulecard";
import EditProfileModal    from "../../components/ui/staff/EditProfileModal";
import ResetPasswordModal  from "../../components/ui/staff/ResetPasswordModal";
import TerminateModal      from "../../components/ui/staff/TerminateModal";
import StaffProfileCards   from "../../components/ui/staff/StaffProfileCards";

export default function StaffDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: staff, isLoading } = useStaffMember(id);

    const { mutate: updateStaff,    isPending: updating }    = useUpdateStaff();
    const { mutate: terminateStaff, isPending: terminating } = useTerminateStaff();
    const { mutate: resetPassword,  isPending: resettingPw } = useResetPassword();

    const [editModal,      setEditModal]      = useState(false);
    const [pwModal,        setPwModal]        = useState(false);
    const [terminateModal, setTerminateModal] = useState(false);

    const editForm = useForm({ defaultValues: { schedule: [] } });
    const pwForm   = useForm();
    
    const { data: allStatuses } = useAllActiveStatuses();

    if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;
    if (!staff)    return <div className="text-center py-16 text-gray-400">Staff member not found.</div>;
    
    const handleEdit = (data) => {
        updateStaff({ id, data }, { onSuccess: () => setEditModal(false) });
    };

    const handleResetPw = ({ newPassword }) => {
        resetPassword({ id, newPassword }, {
            onSuccess: () => { setPwModal(false); pwForm.reset(); },
        });
    };

    const handleTerminate = () => {
        terminateStaff(id, { onSuccess: () => setTerminateModal(false) });
    };

    const openEditModal = () => {
        editForm.reset({
            Firstname:       staff.Firstname,
            Lastname:        staff.Lastname,
            phone:           staff.phone,
            jobTitle:        staff.jobTitle,
            salary:          staff.salary,
            auxStatus:       staff.auxStatus,
            specializations: staff.specializations?.join(", "),
            schedule:        staff.schedule || [],
        });
        setEditModal(true);
    };
    const liveStatus = allStatuses?.find((s) => s.staffId === id) 
    || { status: staff.auxStatus, startedAt: staff.auxStatusChangedAt };

    return (
        <div className="space-y-5">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-gray-500">
                <button onClick={() => navigate("/staff")} className="hover:text-[#1a3a6e] transition-colors">
                    Staff
                </button>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#1a3a6e] font-medium">
                    {staff.Firstname} {staff.Lastname}
                </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">

                {/* Left column */}
                <div className="space-y-4">
                    <StaffProfileCards
                        staff={staff}
                        liveStatus={liveStatus} 
                        onEdit={openEditModal}
                        onResetPassword={() => setPwModal(true)}
                        onTerminate={() => setTerminateModal(true)}
                    />
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    <EmploymentInfoCard staff={staff} />
                    <ContactInfoCard   staff={staff} />
                    <ScheduleCard      schedule={staff.schedule} />
                </div>
            </div>

            <EditProfileModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                form={editForm}
                onSubmit={handleEdit}
                updating={updating}
            />

            <ResetPasswordModal
                isOpen={pwModal}
                onClose={() => { setPwModal(false); pwForm.reset(); }}
                form={pwForm}
                onSubmit={handleResetPw}
                resettingPw={resettingPw}
            />

            <TerminateModal
                isOpen={terminateModal}
                onClose={() => setTerminateModal(false)}
                staff={staff}
                onConfirm={handleTerminate}
                terminating={terminating}
            />
        </div>
    );
}
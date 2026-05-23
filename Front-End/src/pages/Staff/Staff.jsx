import { useState } from "react";
import { Plus } from "lucide-react";
import { useStaff, useCreateStaff, useTerminateStaff } from "../../hooks/useStaff";
import Button          from "../../components/ui/Button";
import StaffTable      from "../../components/ui/staff/StaffTable";
import StaffFilters    from "../../components/ui/staff/StaffFilters";
import AddStaffModal   from "../../components/ui/staff/AddStaffModal";
import TerminateModal  from "../../components/ui/staff/TerminateModal";

export default function Staff() {
    const [page,       setPage]       = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [addModal,       setAddModal]       = useState(false);
    const [terminateModal, setTerminateModal] = useState(false);
    const [selected,       setSelected]       = useState(null);

    const { data, isLoading } = useStaff({
        page, limit: 10,
        search: searchTerm || undefined,
        role:   roleFilter || undefined,
    });

    const { mutate: registerStaff, isPending: registering } = useCreateStaff();
    const { mutate: terminateStaff, isPending: terminating } = useTerminateStaff();

    const handleTerminate = () => {
        terminateStaff(selected.id, {
            onSuccess: () => { setTerminateModal(false); setSelected(null); },
        });
    };

    return (
        <div className="space-y-5">

            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Active Directory — manage your team permissions and access levels
                    </p>
                </div>
                <Button icon={Plus} onClick={() => setAddModal(true)}>
                    + Add Staff
                </Button>
            </div>

            <StaffFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                setPage={setPage}
            />

            <StaffTable
                data={data}
                isLoading={isLoading}
                page={page}
                onPageChange={setPage}
                onAddClick={() => setAddModal(true)}
                onTerminate={(member) => { setSelected(member); setTerminateModal(true); }}
            />

            <AddStaffModal
                isOpen={addModal}
                onClose={() => setAddModal(false)}
                onSubmit={registerStaff}
                isLoading={registering}
            />

            <TerminateModal
                isOpen={terminateModal}
                onClose={() => setTerminateModal(false)}
                staff={selected}
                onConfirm={handleTerminate}
                terminating={terminating}
            />

        </div>
    );
}
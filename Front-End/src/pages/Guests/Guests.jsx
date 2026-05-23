import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { useGuests, useCreateGuest, useUpdateGuest, useDeleteGuest } from "../../hooks/useGuests";
import Button from "../../components/ui/Button";

import GuestsSearch      from "../../components/ui/guests/GuestsSearch";
import GuestsTable       from "../../components/ui/guests/GuestsTable";
import AddGuestModal     from "../../components/ui/guests/AddGuestModal";
import EditGuestModal    from "../../components/ui/guests/EditGuestModal";
import GuestDeleteModal  from "../../components/ui/guests/GuestDeleteModal";

export default function Guests() {
    const navigate = useNavigate();

    const [page,        setPage]        = useState(1);
    const [searchTerm,  setSearchTerm]  = useState("");
    const [addModal,    setAddModal]    = useState(false);
    const [editModal,   setEditModal]   = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selected,    setSelected]    = useState(null);

    const { data, isLoading } = useGuests({ page, limit: 10, searchTerm });

    const { mutate: createGuest, isPending: creating } = useCreateGuest();
    const { mutate: updateGuest, isPending: updating } = useUpdateGuest();
    const { mutate: deleteGuest, isPending: deleting } = useDeleteGuest();

    const addForm  = useForm();
    const editForm = useForm();

    const handleAdd = (data) => {
        createGuest(data, {
            onSuccess: () => { setAddModal(false); addForm.reset(); },
        });
    };

    const handleEdit = (data) => {
        updateGuest({ id: selected.id, data }, {
            onSuccess: () => { setEditModal(false); setSelected(null); },
        });
    };

    const handleDeleteConfirm = () => {
        deleteGuest(selected.id, {
            onSuccess: () => { setDeleteModal(false); setSelected(null); },
        });
    };

    const openEdit = (guest) => {
        setSelected(guest);
        editForm.setValue("Firstname", guest.Firstname);
        editForm.setValue("Lastname",  guest.Lastname);
        editForm.setValue("phone",     guest.phone);
        editForm.setValue("email",     guest.email);
        setEditModal(true);
    };

    const openDelete = (guest) => { setSelected(guest); setDeleteModal(true); };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Central registry for managing guest profiles
                    </p>
                </div>
                <Button icon={Plus} onClick={() => setAddModal(true)}>Register Guest</Button>
            </div>

            <GuestsSearch
                searchTerm={searchTerm}
                onSearch={(val) => { setSearchTerm(val); setPage(1); }}
            />

            <GuestsTable
                data={data}
                isLoading={isLoading}
                page={page}
                onPageChange={setPage}
                onView={(id) => navigate(`/guests/${id}`)}
                onEdit={openEdit}
                onDelete={openDelete}
                onAdd={() => setAddModal(true)}
            />

            <AddGuestModal
                isOpen={addModal}
                onClose={() => { setAddModal(false); addForm.reset(); }}
                form={addForm}
                onSubmit={handleAdd}
                creating={creating}
            />

            <EditGuestModal
                isOpen={editModal}
                onClose={() => { setEditModal(false); setSelected(null); }}
                form={editForm}
                onSubmit={handleEdit}
                updating={updating}
            />

            <GuestDeleteModal
                isOpen={deleteModal}
                onClose={() => { setDeleteModal(false); setSelected(null); }}
                onConfirm={handleDeleteConfirm}
                guest={selected}
                deleting={deleting}
            />
        </div>
    );
}
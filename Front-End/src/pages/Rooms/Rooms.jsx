import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useRoomTypes } from "../../hooks/useRoomTypes";
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from "../../hooks/useRooms";


import RoomsFilters    from "../../components/ui/room/RoomsFilters";
import Button from "../../components/ui/Button";
import RoomsGrid       from "../../components/ui/room/RoomsGrid";
import AddRoomModal    from "../../components/ui/room/AddRoomModal";
import EditRoomModal   from "../../components/ui/room/EditRoomModal";
import DeleteRoomModal from "../../components/ui/room/DeleteRoomModal";
import Pagination from "../../components/ui/Pagination";

export default function Rooms() {
    const [searchTerm,   setSearchTerm]   = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [floorFilter,  setFloorFilter]  = useState("");
    const [addModal,     setAddModal]     = useState(false);
    const [editModal,    setEditModal]    = useState(false);
    const [deleteModal,  setDeleteModal]  = useState(false);
    const [selected,     setSelected]     = useState(null);
    const [page, setPage] = useState(1);

    const { data, isLoading } = useRooms({ searchTerm, status: statusFilter, floor: floorFilter, page, limit: 12 });

    const { data: roomTypesData } = useRoomTypes({ limit: 100 });
    const roomTypes = roomTypesData?.roomTypes || [];

    const { mutate: createRoom, isPending: creating } = useCreateRoom();
    const { mutate: updateRoom, isPending: updating } = useUpdateRoom();
    const { mutate: deleteRoom, isPending: deleting } = useDeleteRoom();

    const addForm  = useForm();
    const editForm = useForm();

    const handleAdd = (data) => {
        createRoom({ ...data, floor: Number(data.floor) }, {
            onSuccess: () => { setAddModal(false); addForm.reset(); },
        });
    };

    const handleEdit = (data) => {
        updateRoom({ id: selected.id, data: { ...data, floor: Number(data.floor) } }, {
            onSuccess: () => { setEditModal(false); setSelected(null); },
        });
    };

    const handleDeleteConfirm = () => {
        deleteRoom(selected.id, {
            onSuccess: () => { setDeleteModal(false); setSelected(null); },
        });
    };

    const openEdit = (room) => {
        setSelected(room);
        editForm.setValue("roomNumber", room.roomNumber);
        editForm.setValue("floor",      room.floor);
        editForm.setValue("roomTypeId", room.roomTypeId);
        editForm.setValue("status",     room.status);
        setEditModal(true);
    };

    const openDelete = (room) => { setSelected(room); setDeleteModal(true); };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage all hotel rooms and their current status
                    </p>
                </div>
                <Button icon={Plus} onClick={() => setAddModal(true)}>Add Room</Button>
            </div>

            <RoomsFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                floorFilter={floorFilter}
                onSearch={(val) => { setSearchTerm(val); setPage(1); }}
                onStatusChange={(val) => { setStatusFilter(val); setPage(1); }}
                onFloorChange={(val) => { setFloorFilter(val); setPage(1); }}
            />

            <RoomsGrid
                data={data}
                isLoading={isLoading}
                onAdd={() => setAddModal(true)}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            <AddRoomModal
                isOpen={addModal}
                onClose={() => { setAddModal(false); addForm.reset(); }}
                form={addForm}
                onSubmit={handleAdd}
                roomTypes={roomTypes}
                creating={creating}
            />

            <EditRoomModal
                isOpen={editModal}
                onClose={() => { setEditModal(false); setSelected(null); }}
                form={editForm}
                onSubmit={handleEdit}
                roomTypes={roomTypes}
                updating={updating}
            />

            <DeleteRoomModal
                isOpen={deleteModal}
                onClose={() => { setDeleteModal(false); setSelected(null); }}
                room={selected}
                onConfirm={handleDeleteConfirm}
                deleting={deleting}
            />
            <Pagination page={page} totalPages={data?.totalPages} onPageChange={setPage} />
        </div>
    );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tag, Plus, Pencil, Trash2, Minus } from "lucide-react";
import { useRoomTypes, useCreateRoomType, useUpdateRoomType, useDeleteRoomType } from "../../hooks/useRoomTypes";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatCurrency";

export default function RoomTypes() {
    const [addModal,    setAddModal]    = useState(false);
    const [editModal,   setEditModal]   = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selected,    setSelected]    = useState(null);
    const [capacity,    setCapacity]    = useState(2);
    const [editCapacity, setEditCapacity] = useState(2);

    const { data, isLoading } = useRoomTypes({ limit: 100 });
    const roomTypes = data?.roomTypes || [];

    const { mutate: createRoomType, isPending: creating } = useCreateRoomType();
    const { mutate: updateRoomType, isPending: updating } = useUpdateRoomType();
    const { mutate: deleteRoomType, isPending: deleting } = useDeleteRoomType();

    const addForm  = useForm();
    const editForm = useForm();

    const handleAdd = (data) => {
        createRoomType({ ...data, price: Number(data.price), capacity }, {
            onSuccess: () => { setAddModal(false); addForm.reset(); setCapacity(2); },
        });
    };

    const handleEdit = (data) => {
        updateRoomType({ id: selected.id, data: { ...data, price: Number(data.price), capacity: editCapacity } }, {
            onSuccess: () => { setEditModal(false); setSelected(null); },
        });
    };

    const openEdit = (rt) => {
        setSelected(rt);
        editForm.setValue("name",  rt.name);
        editForm.setValue("price", rt.price);
        setEditCapacity(rt.capacity);
        setEditModal(true);
    };

    return (
        <div className="space-y-5">

            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Room Types</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Define and manage room categories and pricing
                    </p>
                </div>
                <Button icon={Plus} onClick={() => setAddModal(true)}>
                    Add Room Type
                </Button>
            </div>

            {/* table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <Spinner />
                ) : roomTypes.length === 0 ? (
                    <EmptyState
                        icon={Tag}
                        title="No room types yet"
                        description="Add your first room type to get started"
                        action={<Button icon={Plus} onClick={() => setAddModal(true)}>Add Room Type</Button>}
                    />
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {["Room Type Name", "Price Per Night", "Capacity", "Actions"].map((h) => (
                                    <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {roomTypes.map((rt) => (
                                <tr key={rt.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg">
                                                <Tag className="w-4 h-4 text-[#1a3a6e]" />
                                            </div>
                                            <p className="font-medium text-gray-800">{rt.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-gray-800">
                                        {formatCurrency(rt.price)}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {rt.capacity} guests
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(rt)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setSelected(rt); setDeleteModal(true); }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* add modal */}
            <Modal isOpen={addModal} onClose={() => { setAddModal(false); addForm.reset(); setCapacity(2); }} title="Add Room Type">
                <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Room Type Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            placeholder="e.g. Junior Suite"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...addForm.register("name", { required: true })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Price Per Night <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                                    {...addForm.register("price", { required: true })}
                                />
                            </div>
                        </div>

                        {/* capacity stepper */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Capacity</label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setCapacity(Math.max(1, capacity - 1))}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="flex-1 text-center text-sm font-medium">{capacity}</span>
                                <button
                                    type="button"
                                    onClick={() => setCapacity(capacity + 1)}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" className="flex-1" onClick={() => { setAddModal(false); addForm.reset(); }}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" loading={creating}>
                            Save Room Type
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* edit modal */}
            <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null); }} title="Edit Room Type">
                <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Room Type Name</label>
                        <input
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...editForm.register("name")}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Price Per Night</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                                    {...editForm.register("price")}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Capacity</label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setEditCapacity(Math.max(1, editCapacity - 1))}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="flex-1 text-center text-sm font-medium">{editCapacity}</span>
                                <button
                                    type="button"
                                    onClick={() => setEditCapacity(editCapacity + 1)}
                                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" className="flex-1" onClick={() => { setEditModal(false); setSelected(null); }}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" loading={updating}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* delete modal */}
            <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null); }} title="Delete Room Type" size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">{selected?.name}</span>?
                        This will fail if rooms are still assigned to this type.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => { setDeleteModal(false); setSelected(null); }}>
                            Cancel
                        </Button>
                        <button
                            onClick={() => deleteRoomType(selected.id, { onSuccess: () => { setDeleteModal(false); setSelected(null); } })}
                            disabled={deleting}
                            className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
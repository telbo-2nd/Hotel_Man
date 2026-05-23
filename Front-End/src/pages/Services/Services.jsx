import { useState } from "react";
import { useForm } from "react-hook-form";
import { ConciergeBell, Plus, Search, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useServices, useCreateService, useUpdateService, useDeleteService } from "../../hooks/useServices";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatCurrency";

const STATUS_COLORS = {
    available:   "bg-green-500",
    unavailable: "bg-red-500",  
    maintenance: "bg-yellow-500",
};

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop";

export default function Services() {
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice,   setMinPrice]   = useState("");
    const [maxPrice,   setMaxPrice]   = useState("");
    const [addModal,    setAddModal]    = useState(false);
    const [editModal,   setEditModal]   = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selected,    setSelected]    = useState(null);
    const [openMenu,    setOpenMenu]    = useState(null);

    const { data, isLoading } = useServices({ searchTerm, minPrice, maxPrice, limit: 100 });
    const services = data?.services || [];

    const { mutate: createService, isPending: creating } = useCreateService();
    const { mutate: updateService, isPending: updating } = useUpdateService();
    const { mutate: deleteService, isPending: deleting } = useDeleteService();

    const addForm  = useForm();
    const editForm = useForm();

    const handleAdd = (data) => {
        createService({ ...data, price: Number(data.price) }, {
            onSuccess: () => { setAddModal(false); addForm.reset(); },
        });
    };

    const handleEdit = (data) => {
        updateService({ id: selected.id, data: { ...data, price: Number(data.price) } }, {
            onSuccess: () => { setEditModal(false); setSelected(null); },
        });
    };

    const openEdit = (service) => {
    setSelected(service);
    editForm.setValue("name",        service.name);
    editForm.setValue("description", service.description);
    editForm.setValue("price",       service.price);
    editForm.setValue("imageUrl",    service.imageUrl || ""); 
    editForm.setValue("status",      service.status);
    setEditModal(true);
    setOpenMenu(null);
    };

    return (
        <div className="space-y-5">

            {/* header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage additional services offered to guests
                    </p>
                </div>
                <Button icon={Plus} onClick={() => setAddModal(true)}>
                    Add Service
                </Button>
            </div>

            {/* filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Price Range</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e]"
                        />
                        <span className="text-gray-400">—</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e]"
                        />
                    </div>
                </div>
            </div>

            {/* services grid */}
            {isLoading ? (
                <Spinner />
            ) : services.length === 0 ? (
                <EmptyState
                    icon={ConciergeBell}
                    title="No services yet"
                    description="Add your first service to offer guests"
                    action={<Button icon={Plus} onClick={() => setAddModal(true)}>Add Service</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all relative"
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={service.imageUrl || DEFAULT_PHOTO}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = DEFAULT_PHOTO; }}
                                />
                                {/* overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                {/* three dot menu — moved to top right of image */}
                                <div className="absolute top-3 right-3">
                                    <button
                                        onClick={() => setOpenMenu(openMenu === service.id ? null : service.id)}
                                        className="p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                    {openMenu === service.id && (
                                        <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-lg shadow-lg z-10 w-32 overflow-hidden">
                                            <button
                                                onClick={() => openEdit(service)}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={() => { setSelected(service); setDeleteModal(true); setOpenMenu(null); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* card content */}
                            <div className="p-4">
                                <h3 className="text-base font-bold text-gray-900 mb-1">{service.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-bold text-[#1a3a6e]">
                                        {formatCurrency(service.price)}
                                    </span>
                                    <span className={`text-xs ${STATUS_COLORS[service.status]} text-white bg-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1`}>
                                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* add new card */}
                    <button
                        onClick={() => setAddModal(true)}
                        className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-[#1a3a6e] hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 min-h-[280px]"
                    >
                        <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">New Service</p>
                        <p className="text-xs text-gray-400">Expand your guest offerings</p>
                    </button>
                </div>
            )}

            {/* add modal */}
            <Modal isOpen={addModal} onClose={() => { setAddModal(false); addForm.reset(); }} title="Add New Service">
                <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            placeholder="e.g. Room Service"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...addForm.register("name", { required: true })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Describe the service..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100 resize-none"
                            {...addForm.register("description", { required: true })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Price <span className="text-red-500">*</span>
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
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Photo URL <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...addForm.register("imageUrl")}
                        />
                        {/* live preview */}
                        {addForm.watch("imageUrl") && (
                            <div className="mt-2 rounded-lg overflow-hidden h-32 border border-gray-200">
                                <img
                                    src={addForm.watch("imageUrl")}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            </div>
                        )}
                        <p className="text-xs text-gray-400">
                            Paste any image URL. Leave empty to use default photo.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...addForm.register("status")}
                        >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" className="flex-1" onClick={() => { setAddModal(false); addForm.reset(); }}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" loading={creating}>
                            Add Service
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* edit modal */}
            <Modal isOpen={editModal} onClose={() => { setEditModal(false); setSelected(null); }} title="Edit Service">
                <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Service Name</label>
                        <input
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...editForm.register("name")}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100 resize-none"
                            {...editForm.register("description")}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Price</label>
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
                        <label className="text-sm font-medium text-gray-700">Photo URL</label>

                        {/* current photo */}
                        {selected?.imageUrl && (
                            <div className="rounded-lg overflow-hidden h-32 border border-gray-200 mb-2">
                                <img
                                    src={selected.imageUrl}
                                    alt="Current"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...editForm.register("imageUrl")}
                        />

                        {/* new preview if URL changed */}
                        {editForm.watch("imageUrl") && editForm.watch("imageUrl") !== selected?.imageUrl && (
                            <div className="mt-2 rounded-lg overflow-hidden h-32 border border-gray-200">
                                <img
                                    src={editForm.watch("imageUrl")}
                                    alt="New Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            </div>
                        )}
                        <p className="text-xs text-gray-400">
                            Paste a new URL to replace the current photo
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...editForm.register("status")}
                        >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
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
            <Modal isOpen={deleteModal} onClose={() => { setDeleteModal(false); setSelected(null); }} title="Delete Service" size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">{selected?.name}</span>?
                    </p>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => { setDeleteModal(false); setSelected(null); }}>
                            Cancel
                        </Button>
                        <button
                            onClick={() => deleteService(selected.id, { onSuccess: () => { setDeleteModal(false); setSelected(null); } })}
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
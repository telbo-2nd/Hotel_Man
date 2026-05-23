import Modal  from "../Modal";
import Button from "../Button";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function EditRoomModal({ isOpen, onClose, form, onSubmit, roomTypes, updating }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Room">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Room Number</label>
                        <input
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...form.register("roomNumber")}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Floor</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                            {...form.register("floor")}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Room Type</label>
                    <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] bg-white"
                        {...form.register("roomTypeId")}
                    >
                        {roomTypes.map((rt) => (
                            <option key={rt.id} value={rt.id}>
                                {rt.name} — {formatCurrency(rt.price)}/night
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] bg-white"
                        {...form.register("status")}
                    >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="flex-1" loading={updating}>Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
}
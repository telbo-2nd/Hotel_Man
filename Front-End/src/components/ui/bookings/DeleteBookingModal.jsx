import Modal  from "../Modal";
import Button from "../Button";

export default function DeleteBookingModal({ isOpen, onClose, onConfirm, deleting }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Booking" size="sm">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Are you sure you want to permanently delete this cancelled booking?
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
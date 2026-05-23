import Modal  from "../Modal";
import Button from "../Button";

export default function TerminateModal({ isOpen, onClose, staff, onConfirm, terminating }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Deactivate Account" size="sm">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Are you sure you want to deactivate{" "}
                    <span className="font-semibold text-gray-800">
                        {staff?.Firstname} {staff?.Lastname}
                    </span>
                    {"'"}s account? They will immediately lose all system access.
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <button
                        onClick={onConfirm}
                        disabled={terminating}
                        className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                        {terminating ? "Deactivating..." : "Deactivate"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
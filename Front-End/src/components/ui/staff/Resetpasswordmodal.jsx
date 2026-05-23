import Modal  from "../Modal";
import Button from "../Button";
import Input  from "../Input";

export default function ResetPasswordModal({ isOpen, onClose, form, onSubmit, resettingPw }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Reset Password" size="sm">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    placeholder="Min 8 characters"
                    register={form.register}
                    required
                />
                <div className="flex gap-3 pt-1">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" loading={resettingPw}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </Modal>
    );
}   
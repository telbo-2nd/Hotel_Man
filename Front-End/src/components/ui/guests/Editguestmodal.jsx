import Modal  from "../Modal";
import Button from "../Button";
import Input  from "../Input";

export default function EditGuestModal({ isOpen, onClose, form, onSubmit, updating }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Guest">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" name="Firstname"
                        register={form.register} error={form.formState.errors.Firstname} />
                    <Input label="Last Name"  name="Lastname"
                        register={form.register} error={form.formState.errors.Lastname} />
                </div>
                <Input label="Phone" name="phone"
                    register={form.register} error={form.formState.errors.phone} />

                    <Input label="Email" name="email"
                        register={form.register} error={form.formState.errors.email} />

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" loading={updating}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
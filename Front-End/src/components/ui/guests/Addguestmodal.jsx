import Modal  from "../Modal";
import Button from "../Button";
import Input  from "../Input";

export default function AddGuestModal({ isOpen, onClose, form, onSubmit, creating }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Register New Guest">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" name="Firstname" placeholder="John"
                        register={form.register} error={form.formState.errors.Firstname} required />
                    <Input label="Last Name"  name="Lastname"  placeholder="Doe"
                        register={form.register} error={form.formState.errors.Lastname}  required />
                </div>
                <Input label="Email"       name="email"      type="email" placeholder="john@example.com"
                    register={form.register} error={form.formState.errors.email}      required />
                <Input label="Phone"       name="phone"      placeholder="01012345678"
                    register={form.register} error={form.formState.errors.phone}      required />
                <Input label="National ID" name="nationalId" placeholder="29801011234567"
                    register={form.register} error={form.formState.errors.nationalId} required />

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" loading={creating}>
                        Register Guest
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
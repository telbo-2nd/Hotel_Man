import { useForm, useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";
import Modal  from "../Modal";
import Button from "../Button";
import Input  from "../Input";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function AddStaffModal({ isOpen, onClose, onSubmit, isLoading }) {
    const form = useForm({ defaultValues: { schedule: [] } });

    const {
        fields: scheduleFields,
        append: appendShift,
        remove: removeShift,
    } = useFieldArray({ control: form.control, name: "schedule" });

    const handleSubmit = (data) => {
        onSubmit(data, {
            onSuccess: () => { onClose(); form.reset(); },
        });
    };

    const handleClose = () => { onClose(); form.reset(); };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Register New Staff Member" size="lg">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" name="Firstname" placeholder="Sarah"
                        register={form.register} error={form.formState.errors.Firstname} required />
                    <Input label="Last Name" name="Lastname" placeholder="Jenkins"
                        register={form.register} error={form.formState.errors.Lastname} required />
                </div>

                <Input label="Email" name="email" type="email" placeholder="s.jenkins@hotel.com"
                    register={form.register} error={form.formState.errors.email} required />
                <Input label="Password" name="password" type="password" placeholder="Min 6 characters"
                    register={form.register} error={form.formState.errors.password} required />
                <Input label="National ID" name="nationalId" placeholder="29801011234567"
                    register={form.register} error={form.formState.errors.nationalId} required />
                <Input label="Phone" name="phone" placeholder="+20 10 1234 5678"
                    register={form.register} />

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Job Title" name="jobTitle" placeholder="Lead Receptionist"
                        register={form.register} />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <select
                            {...form.register("role")}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a3a6e] bg-white"
                        >
                            <option value="receptionist">Receptionist</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Join Date" name="joinDate" type="date" register={form.register} />
                    <Input label="Salary" name="salary" type="number" placeholder="5000" register={form.register} />
                </div>

                {/* schedule */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            Work Schedule
                            <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => appendShift({ day: "MON", startTime: "08:00", endTime: "16:00" })}
                            className="text-xs text-[#1a3a6e] font-medium hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Add Shift
                        </button>
                    </div>

                    {scheduleFields.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">
                            No shifts added yet — click "Add Shift" to build the schedule
                        </p>
                    )}

                    {scheduleFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                            <select
                                {...form.register(`schedule.${index}.day`)}
                                className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a3a6e] bg-white"
                            >
                                {DAYS.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <input
                                type="time"
                                {...form.register(`schedule.${index}.startTime`)}
                                className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a3a6e]"
                            />
                            <input
                                type="time"
                                {...form.register(`schedule.${index}.endTime`)}
                                className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a3a6e]"
                            />
                            <button
                                type="button"
                                onClick={() => removeShift(index)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {scheduleFields.length > 0 && (
                        <p className="text-xs text-gray-400">
                            Total weekly hours:{" "}
                            <span className="font-semibold text-[#1a3a6e]">
                                {form.watch("schedule")?.reduce((total, s) => {
                                    if (!s?.startTime || !s?.endTime) return total;
                                    const [sh, sm] = s.startTime.split(":").map(Number);
                                    const [eh, em] = s.endTime.split(":").map(Number);
                                    return total + (eh * 60 + em - sh * 60 - sm) / 60;
                                }, 0).toFixed(1)}h
                            </span>
                        </p>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" loading={isLoading}>
                        Register Staff
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
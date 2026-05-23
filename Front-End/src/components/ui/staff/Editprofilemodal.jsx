import { Plus, X } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import Modal  from "../Modal";
import Button from "../Button";
import Input  from "../Input";
import { DAYS } from "./helpers";

export default function EditProfileModal({ isOpen, onClose, form, onSubmit, updating }) {
    const { fields: scheduleFields, append, remove } = useFieldArray({
        control: form.control,
        name: "schedule",
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Staff Profile" size="lg">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" name="Firstname" register={form.register} error={form.formState.errors.Firstname} />
                    <Input label="Last Name"  name="Lastname"  register={form.register} error={form.formState.errors.Lastname} />
                </div>

                <Input label="Phone"     name="phone"    placeholder="+20 10 1234 5678" register={form.register} />
                <Input label="Job Title" name="jobTitle" placeholder="Lead Receptionist" register={form.register} />
                <Input label="Salary"    name="salary"   type="number" register={form.register} />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Current Status</label>
                    <select
                        {...form.register("auxStatus")}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a3a6e] bg-white"
                    >
                        <option value="working">Working</option>
                        <option value="break">On Break</option>
                        <option value="management">Management</option>
                        <option value="off_duty">Off Duty</option>
                        <option value="on_leave">On Leave</option>
                    </select>
                </div>

                {/* Schedule */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            Work Schedule
                            <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => append({ day: "MON", startTime: "08:00", endTime: "16:00" })}
                            className="text-xs text-[#1a3a6e] font-medium hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Add Shift
                        </button>
                    </div>

                    {scheduleFields.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">
                            No shifts added yet
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
                                onClick={() => remove(index)}
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
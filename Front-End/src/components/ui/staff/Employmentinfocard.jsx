import { Briefcase } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
export default function EmploymentInfoCard({ staff }) {
    const isTerminated = staff.employmentStatus === "terminated";

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-[#1a3a6e]" />
                <h3 className="font-semibold text-gray-800 text-base">Employment Information</h3>
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">First Name</p>
                    <p className="mt-1 text-gray-800 font-medium">{staff.Firstname}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Last Name</p>
                    <p className="mt-1 text-gray-800 font-medium">{staff.Lastname}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Employee ID</p>
                    <p className="mt-1 text-[#1a3a6e] font-semibold">{staff.employeeId || "—"}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Role</p>
                    <p className="mt-1 text-gray-800 font-medium capitalize">{staff.jobTitle || staff.role}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Employment Date</p>
                    <p className="mt-1 text-gray-800 font-medium">{formatDate(staff.joinDate)}</p>
                </div>
                {staff.salary && (
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Salary</p>
                        <p className="mt-1 text-gray-800 font-medium">
                            {Number(staff.salary).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </p>
                    </div>
                )}
                {isTerminated && staff.terminatedAt && (
                    <div>
                        <p className="text-xs font-medium text-red-400 uppercase tracking-wide">Terminated At</p>
                        <p className="mt-1 text-red-600 font-medium">{formatDate(staff.terminatedAt)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
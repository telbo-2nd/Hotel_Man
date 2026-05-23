import { DAYS, weeklyHours } from "./helpers";

export default function ScheduleCard({ schedule }) {
    if (!schedule?.length) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-base">Schedule Overview</h3>
                <span className="text-xs bg-blue-50 text-[#1a3a6e] font-semibold px-3 py-1 rounded-full">
                    Weekly Hours: {weeklyHours(schedule).toFixed(1)}
                </span>
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day) => {
                    const slot = schedule.find((s) => s.day === day);
                    return (
                        <div
                            key={day}
                            className={`rounded-lg p-3 text-center text-xs ${
                                slot
                                    ? "bg-gray-50 border border-gray-200 text-gray-700"
                                    : "bg-gray-50 border border-dashed border-gray-200 text-gray-300"
                            }`}
                        >
                            <p className="font-semibold mb-1">{day}</p>
                            {slot ? (
                                <>
                                    <p>{slot.startTime} -</p>
                                    <p>{slot.endTime}</p>
                                </>
                            ) : (
                                <p>Off</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
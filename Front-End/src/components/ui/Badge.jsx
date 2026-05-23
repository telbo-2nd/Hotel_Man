const variants = {
    pending:     "bg-yellow-100 text-yellow-800",
    confirmed:   "bg-blue-100 text-blue-800",
    "checked-in":  "bg-green-100 text-green-800",
    "checked-out": "bg-gray-100 text-gray-700",
    cancelled:   "bg-red-100 text-red-700",
    available:   "bg-green-100 text-green-700",
    occupied:    "bg-red-100 text-red-700",
    maintenance: "bg-yellow-100 text-yellow-800",
    admin:       "bg-purple-100 text-purple-800",
    receptionist:"bg-blue-100 text-blue-800",
};

export default function Badge({ status }) {
    const style = variants[status] || "bg-gray-100 text-gray-700";
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style}`}>
            {status}
        </span>
    );
}
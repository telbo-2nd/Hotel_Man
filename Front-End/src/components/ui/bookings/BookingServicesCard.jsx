import { formatCurrency } from "../../../utils/formatCurrency";

export default function BookingServicesCard({ services }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Additional Services</h2>

            {services.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                    No additional services for this booking
                </p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {["Service Description", "Quantity", "Unit Price", "Amount"].map((h, i) => (
                                <th
                                    key={h}
                                    className={`text-xs font-medium text-gray-400 uppercase tracking-wide pb-3
                                        ${i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {services.map((service) => {
                            const qty = service.BookingService?.quantity || 1;
                            return (
                                <tr key={service.id}>
                                    <td className="py-3 font-medium text-gray-800">{service.name}</td>
                                    <td className="py-3 text-center text-gray-600">{qty}</td>
                                    <td className="py-3 text-right text-gray-600">{formatCurrency(service.price)}</td>
                                    <td className="py-3 text-right font-semibold text-gray-800">
                                        {formatCurrency(service.price * qty)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
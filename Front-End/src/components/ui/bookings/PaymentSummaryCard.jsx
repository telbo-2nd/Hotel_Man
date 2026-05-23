import { formatCurrency } from "../../../utils/formatCurrency";

export default function PaymentSummaryCard({ nights, roomType, roomTotal, servicesTotal, totalPrice }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Payment Summary</h2>
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        Room Rate ({nights} nights × {formatCurrency(roomType?.price || 0)})
                    </span>
                    <span className="font-medium text-gray-800">{formatCurrency(roomTotal)}</span>
                </div>

                {servicesTotal > 0 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Additional Services Total</span>
                        <span className="font-medium text-gray-800">{formatCurrency(servicesTotal)}</span>
                    </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Grand Total</span>
                    <span className="text-2xl font-bold text-[#1a3a6e]">{formatCurrency(totalPrice)}</span>
                </div>
            </div>
        </div>
    );
}
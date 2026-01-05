///app/components/dashboard/TransactionHistory.tsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description?: string | null;
  createdAt: any;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Transaction History ({transactions.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 backdrop-blur-sm transition-colors duration-300">
            <tr>
              {["Date", "Description", "Type", "Amount", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide transition-colors duration-300"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 backdrop-blur-xl transition-colors duration-300">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {new Date(tx.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  {tx.description || "-"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit transition-colors duration-300 ${
                      tx.type === "credit"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {tx.type === "credit" ? "Incoming" : "Contribution"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {tx.type === "credit" ? "+" : "-"}KES{" "}
                  {tx.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
                      tx.status === "completed"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        : tx.status === "pending"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React from "react";

const Dashboard = ({ setActivePage }) => {
  // ဥទាហរណ៍ទិន្នន័យគំរូ (Mock Data) សម្រាប់បង្ហាញលើ Dashboard
  const recentInvoices = [
    {
      id: "INV-001",
      customer: "ក្រុមហ៊ុន សេង សុខា",
      date: "2026-08-15",
      amount: 1250.0,
      status: "បានបង់",
    },
    {
      id: "INV-002",
      customer: "សំណង់ ភ្នំពេញ ថៅវើ",
      date: "2026-08-14",
      amount: 3400.5,
      status: "មិនទាន់បង់",
    },
    {
      id: "INV-003",
      customer: "លោក ហេង ចាន់ថន",
      date: "2026-08-12",
      amount: 890.0,
      status: "បានបង់",
    },
    {
      id: "INV-004",
      customer: "ក្រុមហ៊ុន ប៉េងហ៊ួត",
      date: "2026-08-10",
      amount: 5600.0,
      status: "បានបង់",
    },
    {
      id: "INV-005",
      customer: "គម្រោង បូរី អរិយក្សត្រ",
      date: "2026-08-08",
      amount: 2150.0,
      status: "មិនទាន់បង់",
    },
  ];

  const topCustomers = [
    { name: "ក្រុមហ៊ុន ប៉េងហ៊ួត", totalSpent: "$18,500.00", orders: 6 },
    { name: "សំណង់ ភ្នំពេញ ថៅវើ", totalSpent: "$14,200.00", orders: 4 },
    { name: "ក្រុមហ៊ុន សេង សុខា", totalSpent: "$9,800.00", orders: 3 },
  ];

  const topMarketings = [
    { name: "លាង សុខេង (Leam Seakngeng)", sales: "$24,500.00", deals: 12 },
    { name: "ចាន់ ដារ៉ា", sales: "$18,000.00", deals: 9 },
  ];

  return (
    <div className="space-y-6 text-gray-100">
      {/* ផ្នែកចំណងជើង */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold text-orange-400">
            📊 Dashboard - ទិដ្ឋភាពទូទៅ
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            ទិន្នន័យចំណូល វិក្កយបត្រ និងសកម្មភាពអាជីវកម្មប្រចាំខែ និងឆ្នាំ ២០26
          </p>
        </div>
        <button
          onClick={() => setActivePage("invoice")}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs sm:text-sm shadow transition flex items-center gap-2"
        >
          <span>📄</span> ចេញវិក្កយបត្រថ្មី
        </button>
      </div>

      {/* Summary Cards: ចំណូលប្រចាំខែ ឆ្នាំ និងសរុប */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg space-y-1">
          <p className="text-xs text-gray-400 font-bold">
            💰 ចំណូលខែនេះ (August)
          </p>
          <h3 className="text-2xl font-extrabold text-green-400">$12,490.50</h3>
          <p className="text-[10px] text-green-500">↑ 15% ធៀបនឹងខែមុន</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg space-y-1">
          <p className="text-xs text-gray-400 font-bold">
            📈 ចំណូលប្រចាំឆ្នាំ (2026)
          </p>
          <h3 className="text-2xl font-extrabold text-orange-400">
            $84,250.00
          </h3>
          <p className="text-[10px] text-gray-400">ទិន្នន័យបច្ចុប្បន្ន</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg space-y-1">
          <p className="text-xs text-gray-400 font-bold">📄 វិក្កយបត្រសរុប</p>
          <h3 className="text-2xl font-extrabold text-blue-400">42 ជើង</h3>
          <p className="text-[10px] text-blue-300">ខែសីហា</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg space-y-1">
          <p className="text-xs text-gray-400 font-bold">🤝អតិថិជនសរុប</p>
          <h3 className="text-2xl font-extrabold text-purple-400">
            18 ក្រុមហ៊ុន
          </h3>
          <p className="text-[10px] text-purple-300">active partners</p>
        </div>
      </div>

      {/* វិក្កយបត្រ 5 ចុងក្រោយ */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h2 className="text-base font-bold text-orange-400">
            📄 វិក្កយបត្រ 5 ចុងក្រោយ (Recent Invoices)
          </h2>
          <button
            onClick={() => setActivePage("invoice")}
            className="text-xs text-orange-400 hover:underline font-bold"
          >
            មើលទាំងអស់ ➡️
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="p-3">ល.រ (ID)</th>
                <th className="p-3">អតិថិជន (Customer)</th>
                <th className="p-3">កាលបរិច្ឆេទ</th>
                <th className="p-3">ទឹកប្រាក់</th>
                <th className="p-3">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentInvoices.map((inv, index) => (
                <tr key={index} className="hover:bg-gray-750">
                  <td className="p-3 font-mono font-bold text-orange-400">
                    {inv.id}
                  </td>
                  <td className="p-3">{inv.customer}</td>
                  <td className="p-3 text-gray-400">{inv.date}</td>
                  <td className="p-3 font-bold text-green-400">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${inv.status === "បានបង់" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Customers & Top Marketing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-orange-400 border-b border-gray-700 pb-3">
            🏆 អតិថិជនសំខាន់ៗប្រចាំខែ (Top Customers)
          </h2>
          <div className="space-y-3">
            {topCustomers.map((cust, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-750 p-3 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center font-bold text-xs text-white">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {cust.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      ចំនួនបញ្ជាទិញ: {cust.orders} ជើង
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-400 text-sm">
                    {cust.totalSpent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Marketing */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-orange-400 border-b border-gray-700 pb-3">
            🌟 ផ្នែកលក់ / Marketing កំពូល (Top Marketing)
          </h2>
          <div className="space-y-3">
            {topMarketings.map((mkt, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-750 p-3 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center font-bold text-xs text-white">
                    ⭐
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{mkt.name}</h4>
                    <p className="text-xs text-gray-400">
                      កិច្ចការសម្រេចបាន: {mkt.deals} វិក្កយបត្រ
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-orange-400 text-sm">
                    {mkt.sales}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

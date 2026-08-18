import React from "react";

const Dashboard = () => {
  const recentInvoices = [
    {
      id: "INV-001",
      customer: "ក្រុមហ៊ុន សេង សុខា",
      amount: 1250.0,
      status: "បានបង់",
    },
    {
      id: "INV-002",
      customer: "សំណង់ ភ្នំពេញ",
      amount: 3400.5,
      status: "ជំពាក់",
    },
    { id: "INV-003", customer: "លោក ហេង", amount: 890.0, status: "បានបង់" },
  ];

  return (
    <div className="space-y-6 text-gray-100 max-w-lg mx-auto pb-4">
      {/* Total Revenue Card */}
      <div className="bg-orange-600 p-6 rounded-3xl shadow-xl shadow-orange-900/50 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <p className="text-orange-200 text-xs font-bold uppercase tracking-wider mb-2">
          ចំណូលខែនេះ
        </p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          $12,490<span className="text-xl text-orange-200">.50</span>
        </h1>
        <div className="mt-4 inline-block bg-black/20 px-3 py-1 rounded-full text-[10px] text-white font-bold backdrop-blur-sm">
          ↑ កើនឡើង 15% ធៀបនឹងខែមុន
        </div>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
          <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm mb-2">
            📄
          </div>
          <p className="text-[10px] text-gray-400 font-bold mb-1">
            វិក្កយបត្រសរុប
          </p>
          <h3 className="text-lg font-bold text-white">42 ជើង</h3>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
          <div className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-sm mb-2">
            🤝
          </div>
          <p className="text-[10px] text-gray-400 font-bold mb-1">
            អតិថិជនសកម្ម
          </p>
          <h3 className="text-lg font-bold text-white">18 ក្រុមហ៊ុន</h3>
        </div>
      </div>

      {/* Recent List */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3 px-2">
          វិក្កយបត្រថ្មីៗ
        </h3>
        <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden divide-y divide-gray-700/50">
          {recentInvoices.map((inv, idx) => (
            <div
              key={idx}
              className="p-4 flex justify-between items-center hover:bg-gray-750 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${inv.status === "បានបង់" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {inv.id.replace("INV-", "")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {inv.customer}
                  </h4>
                  <p className="text-[10px] text-gray-500">{inv.status}</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-sm font-bold text-white">
                  ${inv.amount.toFixed(2)}
                </h4>
                <span className="text-gray-500 text-lg">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

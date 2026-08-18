import React, { useState } from "react";

const Report = ({ searchQuery }) => {
  const [reportType, setReportType] = useState("company"); // 'company' or 'personal'

  // ឧទាហរណ៍ទិន្នន័យ
  const reportData = [
    {
      id: 1,
      date: "01-06-2026",
      strength: "C28",
      qty: 11.5,
      unitPrice: 56.0,
      pumpFee: 0,
      deliveryFee: 0,
      note: "ទូទាត់រួច",
      location: "សន្តិភាព 2",
      supplierPrice: 50.0,
    },
    {
      id: 2,
      date: "01-06-2026",
      strength: "C25",
      qty: 3.0,
      unitPrice: 55.0,
      pumpFee: 0,
      deliveryFee: 0,
      note: "ទូទាត់រួច",
      location: "ចោមចៅ",
      supplierPrice: 48.0,
    },
    {
      id: 3,
      date: "02-06-2026",
      strength: "C25",
      qty: 45.0,
      unitPrice: 55.0,
      pumpFee: 0,
      deliveryFee: 0,
      note: "ទូទាត់រួច",
      location: "ដង្កោថ្មី",
      supplierPrice: 48.0,
    },
  ];

  const filteredData = reportData.filter(
    (item) =>
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.strength.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.note.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className="space-y-6 pb-16 max-w-lg mx-auto"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      {/* Page Title */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-extrabold text-white">
            📊 របាយការណ៍ (Reports)
          </h1>
          <p className="text-xs text-gray-400">
            ទិដ្ឋភាពទូទៅនៃកិច្ចការដឹកជញ្ជូនបេតុង
          </p>
        </div>
      </div>

      {/* Tab Switcher បែប Modern App */}
      <div className="bg-gray-800 p-1.5 rounded-2xl border border-gray-700 flex gap-2 shadow-lg">
        <button
          onClick={() => setReportType("company")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            reportType === "company"
              ? "bg-orange-600 text-white shadow-md shadow-orange-900/50"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <span>🏢</span> សម្រាប់ក្រុមហ៊ុន
        </button>
        <button
          onClick={() => setReportType("personal")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            reportType === "personal"
              ? "bg-orange-600 text-white shadow-md shadow-orange-900/50"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <span>🔒</span> សម្រាប់ខ្លួនឯង
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold mb-1">ជើងដឹកសរុប</p>
          <h3 className="text-lg font-extrabold text-white">
            {filteredData.length} ជើង
          </h3>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold mb-1">បរិមាណសរុប</p>
          <h3 className="text-lg font-extrabold text-orange-400">
            {filteredData.reduce((acc, item) => acc + item.qty, 0).toFixed(2)}{" "}
            m³
          </h3>
        </div>
      </div>

      {/* Data Cards List (Mobile Optimized View) */}
      <div className="space-y-3">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            const amount =
              item.qty * item.unitPrice + item.pumpFee + item.deliveryFee;
            const totalCost =
              item.qty * item.supplierPrice + item.pumpFee + item.deliveryFee;
            const profit = amount - totalCost;

            return (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-md space-y-3"
              >
                <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                  <span className="text-xs font-bold text-orange-400">
                    ជើងទី {index + 1} ({item.date})
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {item.strength}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      ទីតាំង:
                    </span>
                    <span className="font-semibold text-white">
                      {item.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      បរិមាណ:
                    </span>
                    <span className="font-semibold text-white">
                      {item.qty} m³
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      តម្លៃលក់:
                    </span>
                    <span className="font-semibold text-white">
                      $ {item.unitPrice.toFixed(2)} /m³
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      សរុបទឹកប្រាក់:
                    </span>
                    <span className="font-extrabold text-red-400">
                      $ {amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* ព័ត៌មានបន្ថែមបង្ហាញតែពេលជ្រើសរើស "សម្រាប់ខ្លួនឯង" */}
                {reportType === "personal" && (
                  <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-between items-center bg-gray-900/40 p-2.5 rounded-xl text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px]">
                        ថ្លៃដើម:{" "}
                      </span>
                      <span className="text-red-400 font-bold">
                        $ {totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px]">
                        ចំណេញសុទ្ធ:{" "}
                      </span>
                      <span className="text-green-400 font-extrabold">
                        +$ {profit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-gray-800 p-8 rounded-2xl text-center text-gray-400 text-xs">
            មិនមានទិន្នន័យត្រូវបង្ហាញទេ
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => window.print()}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-xs"
      >
        🖨️ បោះពុម្ព / Save PDF របាយការណ៍
      </button>
    </div>
  );
};

export default Report;

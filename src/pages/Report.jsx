import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { ref, onValue } from "firebase/database";

const Report = ({ searchQuery }) => {
  const [reportType, setReportType] = useState("company"); // 'company' or 'personal'
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ទាញយកទិន្នន័យពី Firebase Realtime Database (path: 'invoices')
  useEffect(() => {
    const invoicesRef = ref(db, "invoices");
    const unsubscribe = onValue(invoicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // បំលែង Object ទៅជា Array និងដាក់ ID ចូល
        const loadedInvoices = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // រៀបចំពីថ្មីទៅចាស់
        setInvoices(loadedInvoices.reverse());
      } else {
        setInvoices([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // បំលែងទិន្នន័យ Invoice នីមួយៗចេញជារៀងរាល់ជើងដឹក (Delivery Row) សម្រាប់បង្ហាញក្នុងតារាង/កាត
  const allRows = [];
  invoices.forEach((inv) => {
    if (inv.items && Array.isArray(inv.items)) {
      inv.items.forEach((item, index) => {
        allRows.push({
          uniqueKey: `${inv.id}-${index}`,
          customerName: inv.customerName || "អតិថិជនទូទៅ",
          siteLocation: inv.siteLocation || "មិនកំណត់",
          issueDate: item.deliveryDate || inv.issueDate || "",
          strength: item.concreteType || "C25",
          qty: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.sellingPrice) || 0,
          supplierPrice: parseFloat(item.supplierPrice) || 0,
          pumpFee: parseFloat(item.pumpFee) || 0,
          deliveryFee: parseFloat(item.deliveryFee) || 0,
          note: item.note || inv.generalNote || "",
        });
      });
    }
  });

  // មុខងារ Filter តាម searchQuery (ស្វែងរកតាមទីតាំង កម្លាំងបេតុង ឈ្មោះអតិថិជន ឬចំណាំ)
  const filteredRows = allRows.filter(
    (row) =>
      row.siteLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.strength.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.note.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // គណនាសរុបរួម
  const totalQuantity = filteredRows.reduce((acc, row) => acc + row.qty, 0);
  const totalAmount = filteredRows.reduce(
    (acc, row) => acc + row.qty * row.unitPrice + row.pumpFee + row.deliveryFee,
    0,
  );
  const totalCost = filteredRows.reduce(
    (acc, row) =>
      acc + row.qty * row.supplierPrice + row.pumpFee + row.deliveryFee,
    0,
  );
  const totalProfit = totalAmount - totalCost;

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64 text-gray-400 text-xs"
        style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
      >
        កំពុងទាញយកទិន្នន័យ...
      </div>
    );
  }

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
            ទិដ្ឋភាពទូទៅនៃកិច្ចការដឹកជញ្ជូនបេតុងពី Firebase
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
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
            {filteredRows.length} ជើង
          </h3>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold mb-1">បរិមាណសរុប</p>
          <h3 className="text-lg font-extrabold text-orange-400">
            {totalQuantity.toFixed(2)} m³
          </h3>
        </div>
      </div>

      {/* Data Cards List */}
      <div className="space-y-3">
        {filteredRows.length > 0 ? (
          filteredRows.map((row, index) => {
            const amount =
              row.qty * row.unitPrice + row.pumpFee + row.deliveryFee;
            const rowCost =
              row.qty * row.supplierPrice + row.pumpFee + row.deliveryFee;
            const profit = amount - rowCost;

            return (
              <div
                key={row.uniqueKey}
                className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-md space-y-3"
              >
                <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                  <span className="text-xs font-bold text-orange-400">
                    ជើងទី {index + 1} ({row.issueDate || "មិនកំណត់"})
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {row.strength}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      អតិថិជន / ទីតាំង:
                    </span>
                    <span className="font-semibold text-white">
                      {row.customerName} ({row.siteLocation})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      បរិមាណ:
                    </span>
                    <span className="font-semibold text-white">
                      {row.qty} m³
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      តម្លៃលក់:
                    </span>
                    <span className="font-semibold text-white">
                      $ {row.unitPrice.toFixed(2)} /m³
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
                        $ {rowCost.toFixed(2)}
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

      {/* Total Amount Footer */}
      <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex justify-between items-center text-xs font-bold">
        <span className="text-gray-300">ទឹកប្រាក់សរុបរួម:</span>
        <span className="text-orange-400 text-sm">
          $ {totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Print Button */}
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

import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { ref, onValue } from "firebase/database";

const Dashboard = ({ searchQuery }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ទាញយកទិន្នន័យពី Firebase Realtime Database
  useEffect(() => {
    const invoicesRef = ref(db, "invoices");
    const unsubscribe = onValue(invoicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
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

  // Filter តាម searchQuery
  const filteredInvoices = invoices.filter(
    (inv) =>
      (inv.customerName &&
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.siteLocation &&
        inv.siteLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.market &&
        inv.market.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // គណនាសរុបផ្សេងៗ
  const totalInvoicesCount = filteredInvoices.length;
  const totalRevenue = filteredInvoices.reduce(
    (acc, inv) => acc + (parseFloat(inv.totalInvoiceAmount) || 0),
    0,
  );
  const totalProfit = filteredInvoices.reduce(
    (acc, inv) => acc + (parseFloat(inv.netProfit) || 0),
    0,
  );
  const totalQuantity = filteredInvoices.reduce(
    (acc, inv) => acc + (parseFloat(inv.totalQuantity) || 0),
    0,
  );

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64 text-gray-400 text-xs"
        style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
      >
        កំពុងផ្ទុកទិន្នន័យ Dashboard...
      </div>
    );
  }

  return (
    <div
      className="space-y-6 pb-20 max-w-lg mx-auto"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-extrabold text-white">
            📊 ទិដ្ឋភាពរួម (Dashboard)
          </h1>
          <p className="text-xs text-gray-400">
            ទិន្នន័យសង្ខេបពីប្រព័ន្ធ AppBetong
          </p>
        </div>
      </div>

      {/* Main Revenue Card */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 rounded-3xl shadow-xl shadow-orange-950/50 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
        <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">
          ចំណូលសរុប (Total Revenue)
        </p>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          $ {totalRevenue.toFixed(2)}
        </h2>
        <div className="mt-4 flex gap-4 text-[11px] text-orange-100 font-bold">
          <span>📦 បរិមាណ: {totalQuantity.toFixed(2)} m³</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-sm space-y-1">
          <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-sm mb-2">
            📄
          </div>
          <p className="text-[10px] text-gray-400 font-bold">វិក្កយបត្រសរុប</p>
          <h3 className="text-lg font-extrabold text-white">
            {totalInvoicesCount} វិក្កយបត្រ
          </h3>
        </div>

        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-sm space-y-1">
          <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center text-sm mb-2">
            💰
          </div>
          <p className="text-[10px] text-gray-400 font-bold">
            ប្រាក់ចំណេញសុទ្ធ
          </p>
          <h3 className="text-lg font-extrabold text-green-400">
            $ {totalProfit.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* Recent Invoices List */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 mb-3 px-1">
          វិក្កយបត្រ récent ថ្មីៗ
        </h3>
        <div className="space-y-3">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((inv, index) => (
              <div
                key={inv.id || index}
                className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-md flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-extrabold">
                    #{filteredInvoices.length - index}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {inv.customerName || "អតិថិជនមិនស្គាល់"}
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      {inv.siteLocation || "គ្មានទីតាំង"} • {inv.issueDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-extrabold text-red-400">
                    $ {(parseFloat(inv.totalInvoiceAmount) || 0).toFixed(2)}
                  </h4>
                  <span className="text-[10px] text-green-400 font-bold">
                    ចំណេញ: ${(parseFloat(inv.netProfit) || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-8 rounded-2xl text-center text-gray-400 text-xs border border-gray-700">
              រកមិនឃើញទិន្នន័យវិក្កយបត្រទេ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

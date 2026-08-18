import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { ref, onValue, remove, update } from "firebase/database";

const Report = ({ searchQuery }) => {
  const [reportType, setReportType] = useState("company"); // 'company' or 'personal'
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // State សម្រាប់ Preview Invoice Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // State សម្រាប់ Edit Invoice Modal
  const [editingInvoice, setEditingInvoice] = useState(null);

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
        setInvoices(loadedInvoices.reverse());
      } else {
        setInvoices([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // មុខងារលុបវិក្កយបត្រ
  const handleDeleteInvoice = async (id) => {
    if (window.confirm("តើអ្នកពិតជាចង់លុបវិក្កយបត្រនេះមែនទេ?")) {
      try {
        await remove(ref(db, `invoices/${id}`));
        alert("✅ លុបវិក្កយបត្រជោគជ័យ!");
      } catch (error) {
        alert("❌ មានបញ្ហាក្នុងការលុប: " + error.message);
      }
    }
  };

  // មុខងាររក្សាទុកការកែប្រែវិក្កយបត្រ (Update to Firebase)
  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    if (!editingInvoice) return;

    try {
      // គណនាសរុបថ្មីឡើងវិញ
      let totalInvoiceAmount = 0;
      let totalSupplierCost = 0;
      let totalQuantity = 0;

      editingInvoice.items.forEach((item) => {
        const qty = parseFloat(item.quantity) || 0;
        const sellPrice = parseFloat(item.sellingPrice) || 0;
        const suppPrice = parseFloat(item.supplierPrice) || 0;
        const pump = parseFloat(item.pumpFee) || 0;
        const delivery = parseFloat(item.deliveryFee) || 0;

        totalInvoiceAmount += qty * sellPrice + pump + delivery;
        totalSupplierCost += qty * suppPrice + pump + delivery;
        totalQuantity += qty;
      });

      const netProfit = totalInvoiceAmount - totalSupplierCost;

      const updatedData = {
        customerName: editingInvoice.customerName,
        siteLocation: editingInvoice.siteLocation,
        market: editingInvoice.market,
        issueDate: editingInvoice.issueDate,
        generalNote: editingInvoice.generalNote,
        items: editingInvoice.items,
        totalInvoiceAmount,
        totalSupplierCost,
        totalQuantity,
        netProfit,
      };

      await update(ref(db, `invoices/${editingInvoice.id}`), updatedData);
      alert("✅ កែប្រែវិក្កយបត្រជោគជ័យ!");
      setEditingInvoice(null);
    } catch (error) {
      alert("❌ មានបញ្ហាក្នុងការកែប្រែ: " + error.message);
    }
  };

  // Filter តាម searchQuery
  const filteredInvoices = invoices.filter(
    (inv) =>
      (inv.customerName &&
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.siteLocation &&
        inv.siteLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.issueDate &&
        inv.issueDate.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const totalRevenue = filteredInvoices.reduce(
    (acc, inv) => acc + (parseFloat(inv.totalInvoiceAmount) || 0),
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
          <p className="text-[10px] text-gray-400 font-bold mb-1">
            វិក្កយបត្រសរុប
          </p>
          <h3 className="text-lg font-extrabold text-white">
            {filteredInvoices.length} វិក្កយបត្រ
          </h3>
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-sm">
          <p className="text-[10px] text-gray-400 font-bold mb-1">បរិមាណសរុប</p>
          <h3 className="text-lg font-extrabold text-orange-400">
            {totalQuantity.toFixed(2)} m³
          </h3>
        </div>
      </div>

      {/* Invoice Cards List */}
      <div className="space-y-3">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((inv) => {
            const amount = parseFloat(inv.totalInvoiceAmount) || 0;
            const profit = parseFloat(inv.netProfit) || 0;
            const qty = parseFloat(inv.totalQuantity) || 0;
            const firstItem = inv.items && inv.items[0] ? inv.items[0] : {};

            return (
              <div
                key={inv.id}
                className="bg-gray-800 p-4 rounded-2xl border border-gray-700/80 shadow-md space-y-3"
              >
                {/* Header: Date & Strength */}
                <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                  <span className="text-xs font-bold text-orange-400">
                    📅 {inv.issueDate || "មិនកំណត់"}
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {firstItem.concreteType || "C25"}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      អតិថិជន / ទីតាំង:
                    </span>
                    <span className="font-semibold text-white">
                      {inv.customerName} ({inv.siteLocation})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      បរិមាណសរុប:
                    </span>
                    <span className="font-semibold text-white">{qty} m³</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">
                      ទីផ្សារ:
                    </span>
                    <span className="font-semibold text-white">
                      {inv.market}
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

                {reportType === "personal" && (
                  <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-between items-center bg-gray-900/40 p-2.5 rounded-xl text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px]">
                        ថ្លៃដើម:{" "}
                      </span>
                      <span className="text-red-400 font-bold">
                        $ {(parseFloat(inv.totalSupplierCost) || 0).toFixed(2)}
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

                {/* Action Buttons: Preview PDF, Edit, Delete */}
                <div className="flex gap-2 pt-2 border-t border-gray-700/50">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>👁️</span> Preview
                  </button>
                  <button
                    onClick={() =>
                      setEditingInvoice(JSON.parse(JSON.stringify(inv)))
                    }
                    className="flex-1 bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>✏️</span> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteInvoice(inv.id)}
                    className="px-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 rounded-xl text-xs font-bold transition"
                    title="លុប"
                  >
                    🗑️
                  </button>
                </div>
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
          $ {totalRevenue.toFixed(2)}
        </span>
      </div>

      {/* ========================================== */}
      {/* MODAL EDIT INVOICE                         */}
      {/* ========================================== */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 text-white p-6 rounded-3xl max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto border border-gray-700 text-xs">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h2 className="text-sm font-bold text-orange-400">
                ✏️ កែប្រែវិក្កយបត្រ
              </h2>
              <button
                onClick={() => setEditingInvoice(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateInvoice} className="space-y-3">
              <div>
                <label className="block text-gray-400 mb-1">ឈ្មោះអតិថិជន</label>
                <input
                  type="text"
                  value={editingInvoice.customerName || ""}
                  onChange={(e) =>
                    setEditingInvoice({
                      ...editingInvoice,
                      customerName: e.target.value,
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">
                  ទីតាំងការដ្ឋាន
                </label>
                <input
                  type="text"
                  value={editingInvoice.siteLocation || ""}
                  onChange={(e) =>
                    setEditingInvoice({
                      ...editingInvoice,
                      siteLocation: e.target.value,
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">ទីផ្សារ</label>
                  <input
                    type="text"
                    value={editingInvoice.market || ""}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        market: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">
                    ថ្ងៃខែឆ្នាំ
                  </label>
                  <input
                    type="date"
                    value={editingInvoice.issueDate || ""}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        issueDate: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Items list inside edit modal */}
              <div className="border-t border-gray-800 pt-3 space-y-3">
                <span className="font-bold text-orange-400 block">
                  បញ្ជីជើងដឹកបេតុង
                </span>
                {editingInvoice.items &&
                  editingInvoice.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 p-3 rounded-xl border border-gray-700 space-y-2"
                    >
                      <div className="flex justify-between">
                        <span className="font-bold">ជើងទី {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = editingInvoice.items.filter(
                              (_, i) => i !== idx,
                            );
                            setEditingInvoice({
                              ...editingInvoice,
                              items: newItems,
                            });
                          }}
                          className="text-red-400 font-bold"
                        >
                          លុប ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400">
                            កម្លាំងបេតុង
                          </label>
                          <input
                            type="text"
                            value={item.concreteType || ""}
                            onChange={(e) => {
                              const newItems = [...editingInvoice.items];
                              newItems[idx].concreteType = e.target.value;
                              setEditingInvoice({
                                ...editingInvoice,
                                items: newItems,
                              });
                            }}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400">
                            បរិមាណ (m³)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.quantity || ""}
                            onChange={(e) => {
                              const newItems = [...editingInvoice.items];
                              newItems[idx].quantity = e.target.value;
                              setEditingInvoice({
                                ...editingInvoice,
                                items: newItems,
                              });
                            }}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400">
                            តម្លៃលក់ ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.sellingPrice || ""}
                            onChange={(e) => {
                              const newItems = [...editingInvoice.items];
                              newItems[idx].sellingPrice = e.target.value;
                              setEditingInvoice({
                                ...editingInvoice,
                                items: newItems,
                              });
                            }}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400">
                            តម្លៃក្រុមហ៊ុន ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.supplierPrice || ""}
                            onChange={(e) => {
                              const newItems = [...editingInvoice.items];
                              newItems[idx].supplierPrice = e.target.value;
                              setEditingInvoice({
                                ...editingInvoice,
                                items: newItems,
                              });
                            }}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1.5 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 py-2.5 rounded-xl font-bold transition"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-500 py-2.5 rounded-xl font-bold transition shadow-lg"
                >
                  រក្សាទុកការកែប្រែ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL PREVIEW INVOICE PDF                  */}
      {/* ========================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-black p-6 rounded-3xl max-w-2xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-700 transition"
            >
              ✕
            </button>

            <div className="text-center pb-2 border-b border-gray-200">
              <h2
                className="text-sm font-bold"
                style={{ fontFamily: '"Khmer OS Muol Light", serif' }}
              >
                ក្រុមហ៊ុនបេតុង ជី.ស៊ី.អិម ខនគ្រីត
              </h2>
              <h3
                className="text-xs font-bold"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                GCM CONCRETE MIXING CO.,LTD
              </h3>
            </div>

            <div
              className="text-xs font-bold"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              INVOICE
            </div>

            <div
              className="flex justify-between text-xs"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <div>
                <p>
                  <span className="font-bold">To :</span>{" "}
                  {selectedInvoice.customerName}
                </p>
                <p>
                  <span className="font-bold">Location :</span>{" "}
                  {selectedInvoice.siteLocation}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  Date Issue : {selectedInvoice.issueDate}
                </p>
              </div>
            </div>

            <div
              className="overflow-x-auto"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <table className="w-full border-collapse border border-gray-800 text-[10px]">
                <thead>
                  <tr className="bg-gray-100 text-center">
                    <th className="border border-gray-800 p-1">No</th>
                    <th className="border border-gray-800 p-1">Date</th>
                    <th className="border border-gray-800 p-1">
                      Concrete Strength
                    </th>
                    <th className="border border-gray-800 p-1">Quantity</th>
                    <th className="border border-gray-800 p-1">Unite Price</th>
                    <th className="border border-gray-800 p-1">Pump fee</th>
                    <th className="border border-gray-800 p-1">Delivery fee</th>
                    <th className="border border-gray-800 p-1">Amount</th>
                    <th className="border border-gray-800 p-1">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items &&
                    selectedInvoice.items.map((item, idx) => {
                      const qty = parseFloat(item.quantity) || 0;
                      const price = parseFloat(item.sellingPrice) || 0;
                      const pump = parseFloat(item.pumpFee) || 0;
                      const delivery = parseFloat(item.deliveryFee) || 0;
                      const rowAmount = qty * price + pump + delivery;

                      return (
                        <tr key={idx} className="text-center">
                          <td className="border border-gray-800 p-1">
                            {idx + 1}
                          </td>
                          <td className="border border-gray-800 p-1">
                            {item.deliveryDate}
                          </td>
                          <td className="border border-gray-800 p-1 font-bold">
                            {item.concreteType}
                          </td>
                          <td className="border border-gray-800 p-1">
                            {item.quantity}m³
                          </td>
                          <td className="border border-gray-800 p-1">
                            $ {price.toFixed(2)}
                          </td>
                          <td className="border border-gray-800 p-1">
                            $ {pump.toFixed(2)}
                          </td>
                          <td className="border border-gray-800 p-1">
                            $ {delivery.toFixed(2)}
                          </td>
                          <td className="border border-gray-800 p-1 font-bold text-red-600">
                            $ {rowAmount.toFixed(2)}
                          </td>
                          <td className="border border-gray-800 p-1">
                            {item.note}
                          </td>
                        </tr>
                      );
                    })}
                  <tr className="font-bold text-center">
                    <td
                      colSpan="3"
                      className="border border-gray-800 p-1 text-center"
                    >
                      Total
                    </td>
                    <td className="border border-gray-800 p-1">
                      {selectedInvoice.totalQuantity}m³
                    </td>
                    <td className="border border-gray-800 p-1" colSpan="3"></td>
                    <td className="border border-gray-800 p-1 text-red-600">
                      ${" "}
                      {(
                        parseFloat(selectedInvoice.totalInvoiceAmount) || 0
                      ).toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {selectedInvoice.generalNote && (
              <div
                className="text-xs"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                <span className="font-bold">Note: </span>{" "}
                {selectedInvoice.generalNote}
              </div>
            )}

            <div
              className="flex justify-between pt-6 text-[10px]"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <div className="text-center">
                <div className="h-10 flex items-center justify-center">
                  {selectedInvoice.signatureUrl ? (
                    <img
                      src={selectedInvoice.signatureUrl}
                      alt="Sign"
                      className="max-h-10 object-contain"
                    />
                  ) : (
                    <div className="h-8"></div>
                  )}
                </div>
                <div className="border-t border-black w-32 pt-1 font-bold">
                  MARKETING SIGNATURE
                </div>
                <p className="mt-1 text-[9px]">
                  ABA: 500 208 793: LEAM SEAKNGENG
                </p>
              </div>
              <div className="text-center">
                <div className="h-10"></div>
                <div className="border-t border-black w-32 pt-1 font-bold">
                  CHECK / FINANCE
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition text-xs shadow-lg print:hidden"
            >
              🖨️ បោះពុម្ពវិក្កយបត្រនេះ (Print PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;

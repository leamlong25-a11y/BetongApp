import React, { useState } from "react";
import { db } from "../services/firebase";
import { ref, push, set } from "firebase/database";

const NewInvoice = ({ companySettings }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    siteLocation: "",
    market: "ទីផ្សារ ក",
    issueDate: new Date().toISOString().split("T")[0],
    generalNote: "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      deliveryDate: "",
      concreteType: "C25",
      quantity: "",
      sellingPrice: "",
      supplierPrice: "",
      pumpFee: "",
      deliveryFee: "",
      note: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        deliveryDate: "",
        concreteType: "C25",
        quantity: "",
        sellingPrice: "",
        supplierPrice: "",
        pumpFee: "",
        deliveryFee: "",
        note: "",
      },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // មុខងារគណនា និងរក្សាទុកទិន្នន័យទៅ Firebase
  const handleSaveAndPrint = async () => {
    if (!formData.customerName) {
      alert("សូមបញ្ចូលឈ្មោះអតិថិជនជាមុនសិន!");
      return;
    }

    try {
      setLoading(true);
      const invoicesRef = ref(db, "invoices");
      const newInvoiceRef = push(invoicesRef);

      const invoiceData = {
        ...formData,
        items,
        totalInvoiceAmount,
        totalSupplierCost,
        totalQuantity,
        netProfit,
        createdAt: new Date().toISOString(),
      };

      await set(newInvoiceRef, invoiceData);
      alert("✅ រក្សាទុកទិន្នន័យចូល Firebase ជោគជ័យ!");

      // បន្ទាប់ពីរಕ್ಷាទុក រួចបើក Print Dialog
      window.print();
    } catch (error) {
      alert("❌ មានបញ្ហាในการរក្សាទុក: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  let totalInvoiceAmount = 0;
  let totalSupplierCost = 0;
  let totalQuantity = 0;

  items.forEach((item) => {
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

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto pb-16"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      {/* ផ្នែកទី១៖ INPUT FORM */}
      <div className="lg:col-span-5 bg-gray-800 p-4 sm:p-6 rounded-3xl border border-gray-700 shadow-xl print:hidden space-y-4">
        <h2 className="text-base sm:text-lg font-extrabold text-orange-400 border-b border-gray-700 pb-2">
          📝 ទម្រង់បំពេញវិក្កយបត្រ
        </h2>

        <div>
          <label className="block text-xs font-bold mb-1 text-gray-300">
            ឈ្មោះអតិថិជន (To)
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleFormChange}
            placeholder="ឈ្មោះអតិថិជន..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1 text-gray-300">
            ទីតាំងការដ្ឋាន (Location)
          </label>
          <input
            type="text"
            name="siteLocation"
            value={formData.siteLocation}
            onChange={handleFormChange}
            placeholder="ទីតាំង..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-300">
              ទីផ្សារ (Market)
            </label>
            <select
              name="market"
              value={formData.market}
              onChange={handleFormChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              {companySettings.markets?.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-300">
              ថ្ងៃចេញវិក្កយបត្រ
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleFormChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-orange-400">
              បញ្ជីជើងដឹកបេតុង (Delivery Rows)
            </span>
            <button
              type="button"
              onClick={addItemRow}
              className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition shadow"
            >
              + បន្ថែមជើងដឹក
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 p-3.5 rounded-2xl border border-gray-700 space-y-3 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-300">
                    ជើងទី {index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold"
                    >
                      លុប ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      ថ្ងៃដឹក
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={item.deliveryDate}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      ប្រភេទបេតុង
                    </label>
                    <select
                      name="concreteType"
                      value={item.concreteType}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white"
                    >
                      {companySettings.concreteTypes?.map((c, idx) => (
                        <option key={idx} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      ចំនួន (m³)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      តម្លៃលក់ ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="sellingPrice"
                      value={item.sellingPrice}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-green-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      តម្លៃក្រុមហ៊ុន ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="supplierPrice"
                      value={item.supplierPrice}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-red-400 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      ថ្លៃបូម ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="pumpFee"
                      value={item.pumpFee}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      ថ្លៃដឹក ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="deliveryFee"
                      value={item.deliveryFee}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="0"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      ចំណាំ
                    </label>
                    <input
                      type="text"
                      name="note"
                      value={item.note}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1 text-gray-300">
            ចំណាំរួម (General Note)
          </label>
          <input
            type="text"
            name="generalNote"
            value={formData.generalNote}
            onChange={handleFormChange}
            placeholder="ចំណាំរួមសម្រាប់វិក្កយបត្រ..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="p-3.5 bg-gray-900 rounded-2xl border border-gray-700 text-xs space-y-1.5">
          <div className="flex justify-between text-gray-400">
            <span>សរុបថ្លៃដើមក្រុមហ៊ុន:</span>
            <span className="text-red-400 font-bold">
              ${totalSupplierCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>ប្រាក់ចំណេញសុទ្ធ (Net Profit):</span>
            <span className="text-green-400 font-bold text-sm">
              ${netProfit.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveAndPrint}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-2xl font-bold shadow-xl transition flex items-center justify-center gap-2 text-sm"
        >
          {loading ? "กำลังរក្សាទុក..." : "🖨️ រក្សាទុក & បោះពុម្ព (Save & PDF)"}
        </button>
      </div>

      {/* ផ្នែកទី២៖ INVOICE PREVIEW */}
      <div className="lg:col-span-7 bg-white text-black p-4 sm:p-8 rounded-3xl shadow-2xl overflow-x-hidden print:w-full print:shadow-none print:p-0">
        <div className="text-center pb-2 mb-4">
          <h1
            className="text-xs sm:text-base font-bold text-black mb-1"
            style={{ fontFamily: '"Khmer OS Muol Light", serif' }}
          >
            {companySettings.companyKhmerName}
          </h1>
          <h2
            className="text-[10px] sm:text-sm font-bold text-black"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {companySettings.companyEnglishName}
          </h2>
        </div>

        <div
          className="mb-3"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <h3 className="font-bold text-xs sm:text-sm tracking-wider">
            INVOICE
          </h3>
        </div>

        <div
          className="flex flex-col sm:flex-row justify-between mb-4 text-[11px] sm:text-xs gap-1"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div>
            <p className="mb-0.5">
              <span className="font-bold">To :</span> {formData.customerName}
            </p>
            <p>
              <span className="font-bold">Location :</span>{" "}
              {formData.siteLocation}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-bold">Date Issue : {formData.issueDate}</p>
          </div>
        </div>

        <div
          className="w-full overflow-x-auto"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <table className="w-full border-collapse border border-gray-800 mb-4 text-[10px] sm:text-xs">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-800 p-1.5">No</th>
                <th className="border border-gray-800 p-1.5">Date</th>
                <th className="border border-gray-800 p-1.5">
                  Concrete Strength
                </th>
                <th className="border border-gray-800 p-1.5">Quantity</th>
                <th className="border border-gray-800 p-1.5">Unite Price</th>
                <th className="border border-gray-800 p-1.5">Pump fee</th>
                <th className="border border-gray-800 p-1.5">Delivery fee</th>
                <th className="border border-gray-800 p-1.5">Amount</th>
                <th className="border border-gray-800 p-1.5">Note</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const qty = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.sellingPrice) || 0;
                const pump = parseFloat(item.pumpFee) || 0;
                const delivery = parseFloat(item.deliveryFee) || 0;
                const rowAmount = qty * price + pump + delivery;

                return (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-800 p-1.5">
                      {index + 1}
                    </td>
                    <td className="border border-gray-800 p-1.5">
                      {item.deliveryDate || ""}
                    </td>
                    <td className="border border-gray-800 p-1.5 font-bold">
                      {item.concreteType}
                    </td>
                    <td className="border border-gray-800 p-1.5">
                      {item.quantity ? `${item.quantity}m³` : ""}
                    </td>
                    <td className="border border-gray-800 p-1.5">
                      $ {price.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1.5">
                      $ {pump.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1.5">
                      $ {delivery.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1.5 font-bold text-red-600">
                      $ {rowAmount.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1.5">
                      {item.note || ""}
                    </td>
                  </tr>
                );
              })}

              <tr className="font-bold bg-white text-center">
                <td
                  colSpan="3"
                  className="border border-gray-800 p-1.5 text-center"
                >
                  Total
                </td>
                <td className="border border-gray-800 p-1.5">
                  {totalQuantity > 0 ? `${totalQuantity.toFixed(2)}m³` : ""}
                </td>
                <td className="border border-gray-800 p-1.5"></td>
                <td className="border border-gray-800 p-1.5"></td>
                <td className="border border-gray-800 p-1.5"></td>
                <td className="border border-gray-800 p-1.5 text-red-600 font-bold">
                  {totalInvoiceAmount > 0
                    ? `$ ${totalInvoiceAmount.toFixed(2)}`
                    : ""}
                </td>
                <td className="border border-gray-800 p-1.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {formData.generalNote && (
          <div
            className="mb-4 text-[11px] sm:text-xs"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <span className="font-bold">Note: </span>
            {formData.generalNote}
          </div>
        )}

        <div
          className="flex justify-between mt-8 sm:mt-12 px-2 text-[10px] sm:text-xs gap-4"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="text-center">
            <div className="h-12 flex items-center justify-center mb-1">
              {companySettings.signatureUrl ? (
                <img
                  src={companySettings.signatureUrl}
                  alt="Signature"
                  className="max-h-12 object-contain"
                />
              ) : (
                <div className="h-10"></div>
              )}
            </div>
            <div className="border-t border-black w-28 sm:w-48 pt-1 font-bold">
              MARKETING SIGNATURE
            </div>
            <p className="mt-1 text-[9px] sm:text-[11px]">
              ABA: {companySettings.abaNumber}: {companySettings.accountHolder}
            </p>
          </div>
          <div className="text-center">
            <div className="h-12 flex items-center justify-center mb-1">
              {companySettings.financeSignatureUrl ? (
                <img
                  src={companySettings.financeSignatureUrl}
                  alt="Finance Signature"
                  className="max-h-12 object-contain"
                />
              ) : (
                <div className="h-10"></div>
              )}
            </div>
            <div className="border-t border-black w-28 sm:w-48 pt-1 font-bold">
              CHECK / FINANCE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoice;

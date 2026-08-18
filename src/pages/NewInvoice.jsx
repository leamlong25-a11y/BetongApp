import React, { useState } from "react";

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

  const handlePrint = () => {
    window.print();
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ផ្នែកទី១៖ INPUT FORM */}
      <div className="lg:col-span-5 bg-gray-800 p-3 sm:p-6 rounded-xl border border-gray-700 shadow-xl print:hidden space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-orange-400 border-b border-gray-700 pb-2">
          📝 ទម្រង់បំពេញទិន្នន័យ (Input Form)
        </h2>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-300">
            ឈ្មោះអតិថិជន (To)
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleFormChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-300">
            ទីតាំងការដ្ឋាន (Location)
          </label>
          <input
            type="text"
            name="siteLocation"
            value={formData.siteLocation}
            onChange={handleFormChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              ទីផ្សារ (Market)
            </label>
            <select
              name="market"
              value={formData.market}
              onChange={handleFormChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
            >
              <option value="ទីផ្សារ ក">ទីផ្សារ ក</option>
              <option value="ទីផ្សារ ខ">ទីផ្សារ ខ</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-300">
              ថ្ងៃចេញវិក្កយបត្រ
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleFormChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* លុបផ្នែក Upload Signature ចេញពីទីនេះ */}

        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-orange-400">
              បញ្ជីជើងដឹកបេតុង (Delivery Rows)
            </span>
            <button
              type="button"
              onClick={addItemRow}
              className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded font-bold transition"
            >
              + បន្ថែមជើងដឹក
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 p-3 rounded border border-gray-700 space-y-2 relative"
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
                      លុប
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
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs"
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
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs"
                    >
                      <option value="C25">C25</option>
                      <option value="C30">C30</option>
                      <option value="C35">C35</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs"
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
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs text-green-400 font-bold"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] text-gray-400 mb-1">
                      តម្លៃក្រុមហ៊ុន ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="supplierPrice"
                      value={item.supplierPrice}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs text-red-400 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs"
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
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] text-gray-400 mb-1">
                      ចំណាំ
                    </label>
                    <input
                      type="text"
                      name="note"
                      value={item.note}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-300">
            ចំណាំរួម (General Note)
          </label>
          <input
            type="text"
            name="generalNote"
            value={formData.generalNote}
            onChange={handleFormChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
          />
        </div>

        <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700 text-xs space-y-1">
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
          onClick={handlePrint}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold shadow-lg transition flex items-center justify-center gap-2"
        >
          🖨️ បោះពុម្ព / Save PDF
        </button>
      </div>

      {/* ផ្នែកទី២៖ INVOICE PREVIEW */}
      <div className="lg:col-span-7 bg-white text-black p-3 sm:p-8 rounded-xl shadow-2xl overflow-x-hidden print:w-full print:shadow-none print:p-0">
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
                <th className="border border-gray-800 p-1 sm:p-2">No</th>
                <th className="border border-gray-800 p-1 sm:p-2">Date</th>
                <th className="border border-gray-800 p-1 sm:p-2">
                  Concrete Strength
                </th>
                <th className="border border-gray-800 p-1 sm:p-2">Quantity</th>
                <th className="border border-gray-800 p-1 sm:p-2">
                  Unite Price
                </th>
                <th className="border border-gray-800 p-1 sm:p-2">Pump fee</th>
                <th className="border border-gray-800 p-1 sm:p-2">
                  Delivery fee
                </th>
                <th className="border border-gray-800 p-1 sm:p-2">Amount</th>
                <th className="border border-gray-800 p-1 sm:p-2">Note</th>
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
                    <td className="border border-gray-800 p-1 sm:p-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2">
                      {item.deliveryDate || ""}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2 font-bold">
                      {item.concreteType}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2">
                      {item.quantity ? `${item.quantity}m³` : ""}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2">
                      $ {price.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2">
                      $ {pump.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2">
                      $ {delivery.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2 font-bold text-red-600">
                      $ {rowAmount.toFixed(2)}
                    </td>
                    <td className="border border-gray-800 p-1 sm:p-2">
                      {item.note || ""}
                    </td>
                  </tr>
                );
              })}

              <tr className="font-bold bg-white text-center">
                <td
                  colSpan="3"
                  className="border border-gray-800 p-1 sm:p-2 text-center"
                >
                  Total
                </td>
                <td className="border border-gray-800 p-1 sm:p-2">
                  {totalQuantity > 0 ? `${totalQuantity.toFixed(2)}m³` : ""}
                </td>
                <td className="border border-gray-800 p-1 sm:p-2"></td>
                <td className="border border-gray-800 p-1 sm:p-2"></td>
                <td className="border border-gray-800 p-1 sm:p-2"></td>
                <td className="border border-gray-800 p-1 sm:p-2 text-red-600 font-bold">
                  {totalInvoiceAmount > 0
                    ? `$ ${totalInvoiceAmount.toFixed(2)}`
                    : ""}
                </td>
                <td className="border border-gray-800 p-1 sm:p-2"></td>
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
              {/* ប្រើប្រាស់ហត្ថលេខាពី Settings */}
              {companySettings.signatureUrl ? (
                <img
                  src={companySettings.signatureUrl}
                  alt="Signature"
                  className="max-h-12 object-contain"
                />
              ) : (
                <div className="h-10 text-gray-400 italic text-[10px]">
                  (No Signature)
                </div>
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
              <div className="h-10"></div>
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

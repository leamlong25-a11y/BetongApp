import React from "react";

const Navbar = ({ activePage, onToggleSidebar, onGoToProfile, onLogout }) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center shadow-md print:hidden">
      {/* ប៊ូតុង Toggle សម្រាប់បង្ហាញ/លាក់ Sidebar លើ Phone និងបង្ហាញชื่อ Page */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden bg-gray-700 hover:bg-gray-600 text-orange-400 p-2 rounded-lg text-base font-bold transition shadow"
          title="Toggle Menu"
        >
          ☰
        </button>
        <span className="text-sm font-bold text-orange-400 capitalize">
          ទំព័រ: {activePage}
        </span>
      </div>

      {/* ផ្នែកប៊ូតុង Profile និង Logout */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGoToProfile}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow flex items-center gap-1.5"
        >
          <span>👤</span> Profile
        </button>

        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
        >
          🚪 ထွက် (Logout)
        </button>
      </div>
    </div>
  );
};

export default Navbar;

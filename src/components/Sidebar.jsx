import React from "react";

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: "home", label: "ទំព័រដើម (Home)", icon: "🏠" },
    { id: "dashboard", label: "Dashboard (ទិដ្ឋភាពទូទៅ)", icon: "📊" },
    { id: "invoice", label: "ចេញវិក្កយបត្រ (Invoice)", icon: "📄" },
    { id: "settings", label: "ការកំណត់ (Settings)", icon: "⚙️" },
  ];

  return (
    <>
      {/* Background Overlay ពេលបើក Menu លើ Phone */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 print:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div>
          <div className="flex justify-between items-center mb-8 px-2">
            <span className="text-xl font-bold text-orange-500">
              🏗️ AppBetong
            </span>
            {/* ប៊ូតុងបិទ Menu លើ Phone */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsOpen(false); // បិទ Menu ស្វ័យប្រវត្តិពេលចុចលើ Phone
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition ${
                  activePage === item.id ||
                  (activePage === "profile" && item.id === "settings")
                    ? "bg-orange-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="text-xs text-gray-500 text-center py-4 border-t border-gray-700">
          AppBetong v1.0 © 2026
        </div>
      </div>
    </>
  );
};

export default Sidebar;

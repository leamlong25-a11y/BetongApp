import React from "react";

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: "home", label: "ទំព័រដើម", icon: "🏠" },
    { id: "dashboard", label: "ទិដ្ឋភាព", icon: "📊" },
    { id: "invoice", label: "វិក្កយបត្រ", icon: "📄" },
    { id: "settings", label: "ការកំណត់", icon: "⚙️" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around items-center pt-2 pb-4 px-2 z-50 print:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActivePage(item.id)}
          className={`flex flex-col items-center justify-center w-full transition-all duration-200 ${
            activePage === item.id ||
            (activePage === "profile" && item.id === "settings")
              ? "text-orange-500 transform -translate-y-1"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <span
            className={`text-xl sm:text-2xl mb-1 ${activePage === item.id ? "drop-shadow-lg" : ""}`}
          >
            {item.icon}
          </span>
          <span className="text-[10px] sm:text-xs font-bold">{item.label}</span>
          {/* ចំណុចពណ៌ទឹកក្រូចខាងក្រោមពេល Active */}
          {activePage === item.id && (
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;

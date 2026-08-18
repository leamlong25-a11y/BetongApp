import React from "react";

const Navbar = ({ searchQuery, setSearchQuery, onRefresh }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 h-16 flex items-center justify-between px-4 z-50 print:hidden shadow-sm"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      {/* ចុចលើ Logo ដើម្បី Refresh */}
      <div
        onClick={onRefresh}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
        title="ចុចដើម្បី Refresh App"
      >
        <span className="text-2xl">🏗️</span>
        <h1 className="text-lg font-extrabold text-white tracking-wide">
          App<span className="text-orange-500">Betong</span>
        </h1>
      </div>

      <input
        type="text"
        placeholder="ស្វែងរក..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white text-xs rounded-full px-4 py-2 w-32 sm:w-48 focus:outline-none focus:border-orange-500"
      />
    </div>
  );
};

export default Navbar;

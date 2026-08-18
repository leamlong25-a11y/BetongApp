import React from "react";

const Home = ({ setActivePage }) => {
  return (
    <div className="space-y-6 text-gray-100 max-w-lg mx-auto">
      {/* App User Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl border border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
          សូមស្វាគមន៍,
        </h2>
        <h1 className="text-2xl font-extrabold text-white mb-4">
          អ្នកគ្រប់គ្រងប្រព័ន្ធ 👑
        </h1>

        <div className="bg-gray-950/50 p-4 rounded-2xl flex justify-between items-center border border-gray-700/50">
          <div>
            <p className="text-[10px] text-gray-400 mb-1">ស្ថានភាពប្រព័ន្ធ</p>
            <p className="text-sm font-bold text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              ភ្ជាប់បណ្តាញជោគជ័យ
            </p>
          </div>
          <div className="text-3xl opacity-80">🚀</div>
        </div>
      </div>

      {/* Quick Action Grid បែប Mobile App */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3 px-2">
          មុខងាររហ័ស (Quick Actions)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActivePage("invoice")}
            className="bg-gray-800 p-5 rounded-3xl border border-gray-700 shadow-lg flex flex-col items-center justify-center gap-3 hover:bg-gray-700 transition active:scale-95"
          >
            <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-2xl">
              📄
            </div>
            <span className="text-xs font-bold text-white">ចេញវិក្កយបត្រ</span>
          </button>

          <button
            onClick={() => setActivePage("dashboard")}
            className="bg-gray-800 p-5 rounded-3xl border border-gray-700 shadow-lg flex flex-col items-center justify-center gap-3 hover:bg-gray-700 transition active:scale-95"
          >
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-2xl">
              📊
            </div>
            <span className="text-xs font-bold text-white">របាយការណ៍</span>
          </button>

          <button
            onClick={() => setActivePage("profile")}
            className="bg-gray-800 p-5 rounded-3xl border border-gray-700 shadow-lg flex flex-col items-center justify-center gap-3 hover:bg-gray-700 transition active:scale-95"
          >
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <span className="text-xs font-bold text-white">គណនីខ្ញុំ</span>
          </button>

          <button
            onClick={() => setActivePage("settings")}
            className="bg-gray-800 p-5 rounded-3xl border border-gray-700 shadow-lg flex flex-col items-center justify-center gap-3 hover:bg-gray-700 transition active:scale-95"
          >
            <div className="w-14 h-14 bg-gray-500/20 text-gray-300 rounded-full flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <span className="text-xs font-bold text-white">ការកំណត់</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { auth } from "../services/firebase";

const Home = ({ setActivePage }) => {
  const user = auth.currentUser;

  return (
    <div
      className="space-y-6 max-w-lg mx-auto pb-16"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      {/* Welcome Hero Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl border border-gray-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-700 overflow-hidden border-2 border-orange-500 shadow-md flex-shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👑
              </div>
            )}
          </div>
          <div>
            <h2 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
              សូមស្វាគមន៍មកកាន់,
            </h2>
            <h1 className="text-lg sm:text-xl font-extrabold text-white truncate max-w-[200px]">
              {user?.displayName || "អ្នកគ្រប់គ្រងប្រព័ន្ធ"}
            </h1>
          </div>
        </div>

        <div className="bg-gray-950/60 p-3.5 rounded-2xl flex justify-between items-center border border-gray-700/50">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">ស្ថានភាពប្រព័ន្ធ</p>
            <p className="text-xs font-bold text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              ភ្ជាប់បណ្តាញជោគជ័យ (Online)
            </p>
          </div>
          <span className="text-2xl">🚀</span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 mb-3 px-1">
          មុខងាររហ័ស (Quick Actions)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActivePage("invoice")}
            className="bg-gray-800 p-4 sm:p-5 rounded-3xl border border-gray-700/80 shadow-lg flex flex-col items-center justify-center gap-2.5 hover:bg-gray-750 transition active:scale-95 text-center"
          >
            <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-xl">
              📄
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                ចេញវិក្កយបត្រ
              </span>
              <span className="text-[10px] text-gray-400">
                បង្កើតវិក្កយបត្រថ្មី
              </span>
            </div>
          </button>

          <button
            onClick={() => setActivePage("dashboard")}
            className="bg-gray-800 p-4 sm:p-5 rounded-3xl border border-gray-700/80 shadow-lg flex flex-col items-center justify-center gap-2.5 hover:bg-gray-750 transition active:scale-95 text-center"
          >
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                ទិដ្ឋភាពរួម
              </span>
              <span className="text-[10px] text-gray-400">ស្ថិតិ និងចំណូល</span>
            </div>
          </button>

          <button
            onClick={() => setActivePage("report")}
            className="bg-gray-800 p-4 sm:p-5 rounded-3xl border border-gray-700/80 shadow-lg flex flex-col items-center justify-center gap-2.5 hover:bg-gray-750 transition active:scale-95 text-center"
          >
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center text-xl">
              📈
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                របាយការណ៍
              </span>
              <span className="text-[10px] text-gray-400">
                ក្រុមហ៊ុន & ខ្លួនឯង
              </span>
            </div>
          </button>

          <button
            onClick={() => setActivePage("settings")}
            className="bg-gray-800 p-4 sm:p-5 rounded-3xl border border-gray-700/80 shadow-lg flex flex-col items-center justify-center gap-2.5 hover:bg-gray-750 transition active:scale-95 text-center"
          >
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-xl">
              ⚙️
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                ការកំណត់
              </span>
              <span className="text-[10px] text-gray-400">
                ប្រព័ន្ធ និងហត្ថលេខា
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

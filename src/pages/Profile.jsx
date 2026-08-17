import React from "react";

const Profile = ({ user, onBackToSettings }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-gray-100">
      {/* ផ្នែកប៊ូតុងថយក្រោយ */}
      <button
        onClick={onBackToSettings}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow"
      >
        ⬅️ ថយក្រោយ (Back to Settings)
      </button>

      <div className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-700 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            👤
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              ប្រវត្តិរូបអ្នកប្រើប្រាស់ (User Profile)
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              ព័ត៌មានគណនី និងសិទ្ធិប្រើប្រាស់ប្រព័ន្ធ
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              អ៊ីម៉ែលគណនី (Email)
            </label>
            <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 text-white font-mono">
              {user?.email || "ไม่มีอีเมล"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              UID (User ID)
            </label>
            <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 text-white font-mono text-xs">
              {user?.uid || "N/A"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              สถานะប្រព័ន្ធ (System Status)
            </label>
            <div className="bg-green-900/40 border border-green-600 p-3 rounded-lg text-green-400 font-bold text-xs flex items-center gap-2">
              🟢 កំពុងតភ្ជាប់ជាមួយ Firebase Authentication & Database
              ដោយសុវត្ថិភាព
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

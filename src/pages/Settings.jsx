import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../services/firebase";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { ref as dbRef, update } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const Settings = ({ companySettings, setCompanySettings }) => {
  const [view, setView] = useState("main"); // main, profile, product, backup, about
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  // --- មុខងារត្រឡប់ក្រោយ ---
  const goBack = () => setView("main");

  // ==========================================
  // ១. VIEW: ម៉ឺនុយមេ (Main Settings Menu)
  // ==========================================
  const renderMain = () => (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-white mb-6">
        ⚙️ ការកំណត់ (Settings)
      </h1>

      <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden divide-y divide-gray-700/50 shadow-lg">
        <button
          onClick={() => setView("profile")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-lg">
              👤
            </div>
            <span className="font-bold text-gray-200">គណនី (Profile)</span>
          </div>
          <span className="text-gray-500 text-xl">›</span>
        </button>

        <button
          onClick={() => setView("product")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-lg">
              🏢
            </div>
            <span className="font-bold text-gray-200">ផលិតផល & សេវាកម្ម</span>
          </div>
          <span className="text-gray-500 text-xl">›</span>
        </button>

        <button
          onClick={() => setView("backup")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-lg">
              💾
            </div>
            <span className="font-bold text-gray-200">
              ទិន្នន័យ & បម្រុងទុក (Data)
            </span>
          </div>
          <span className="text-gray-500 text-xl">›</span>
        </button>

        <button
          onClick={() => setView("about")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-lg">
              ℹ️
            </div>
            <span className="font-bold text-gray-200">
              អំពីកម្មវិធី (About)
            </span>
          </div>
          <span className="text-gray-500 text-xl">›</span>
        </button>
      </div>
    </div>
  );

  // ==========================================
  // ២. VIEW: គណនី (Profile)
  // ==========================================
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [password, setPassword] = useState("");

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      if (displayName !== user.displayName)
        await updateProfile(user, { displayName });
      if (password) await updatePassword(user, password);
      alert("✅ ធ្វើបច្ចុប្បន្នភាពគណនីជោគជ័យ!");
      setPassword("");
    } catch (error) {
      alert("❌ បរាជ័យ: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const avatarRef = storageRef(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(avatarRef);
      await updateProfile(user, { photoURL: url });
      alert("✅ ប្តូររូបភាពគណនីជោគជ័យ!");
    } catch (err) {
      alert("❌ មានបញ្ហា: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const renderProfile = () => (
    <div className="space-y-6 animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-white">👤 គណនី (Profile)</h2>
      </div>

      <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl space-y-5">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-2 border-orange-500">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                👨‍💼
              </div>
            )}
          </div>
          <label className="text-xs text-orange-400 cursor-pointer hover:underline font-bold">
            📷 ប្តូររូបភាព
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            ឈ្មោះអ្នកប្រើប្រាស់ (Username)
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            អុីម៉ែល (Email - មិនអាចប្តូរបាន)
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            ប្តូរពាក្យសម្ងាត់ថ្មី (New Password)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="វាយបញ្ចូលពាក្យសម្ងាត់ថ្មី (បើចង់ប្តូរ)"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
        >
          {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុកការផ្លាស់ប្តូរ"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
        >
          🚪 ចាកចេញពីគណនី (Log out)
        </button>
      </div>
    </div>
  );

  // ==========================================
  // ៣. VIEW: ផលិតផល & សេវាកម្ម (Product / Service)
  // ==========================================
  const defaultConcretes = companySettings?.concreteTypes || [
    "C25",
    "C30",
    "C35",
  ];
  const defaultMarkets = companySettings?.markets || ["ទីផ្សារ ក", "ទីផ្សារ ខ"];

  const [concretes, setConcretes] = useState(defaultConcretes);
  const [markets, setMarkets] = useState(defaultMarkets);
  const [newConcrete, setNewConcrete] = useState("");
  const [newMarket, setNewMarket] = useState("");

  const handleSaveProducts = async () => {
    try {
      setLoading(true);
      const updatedData = {
        ...companySettings,
        concreteTypes: concretes,
        markets: markets,
      };
      await update(dbRef(db, "settings"), updatedData);
      setCompanySettings(updatedData);
      alert("✅ រក្សាទុកទិន្នន័យជោគជ័យ!");
    } catch (err) {
      alert("❌ បរាជ័យ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadSignature = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const sRef = storageRef(storage, `signatures/${type}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);

      const updatedData = { ...companySettings, [type]: url };
      await update(dbRef(db, "settings"), updatedData);
      setCompanySettings(updatedData);
      alert("✅ ដាក់រូបហត្ថលេខាជោគជ័យ!");
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = () => (
    <div className="space-y-6 animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-white">🏢 ផលិតផល & សេវាកម្ម</h2>
      </div>

      <div className="bg-gray-800 p-5 rounded-3xl border border-gray-700 shadow-xl space-y-6">
        {/* កម្លាំងបេតុង */}
        <div>
          <label className="block text-sm font-bold text-orange-400 mb-2">
            ១. កំណត់បន្ថែមកម្លាំងបេតុង
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {concretes.map((c, i) => (
              <span
                key={i}
                className="bg-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-2"
              >
                {c}{" "}
                <button
                  onClick={() =>
                    setConcretes(concretes.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newConcrete}
              onChange={(e) => setNewConcrete(e.target.value)}
              placeholder="ឧទាហរណ៍: C40"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white"
            />
            <button
              onClick={() => {
                if (newConcrete) {
                  setConcretes([...concretes, newConcrete]);
                  setNewConcrete("");
                }
              }}
              className="bg-green-600 px-4 rounded-lg font-bold text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* ទីផ្សារ */}
        <div className="border-t border-gray-700 pt-4">
          <label className="block text-sm font-bold text-orange-400 mb-2">
            ២. កំណត់បន្ថែមឈ្មោះទីផ្សារ
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {markets.map((m, i) => (
              <span
                key={i}
                className="bg-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-2"
              >
                {m}{" "}
                <button
                  onClick={() =>
                    setMarkets(markets.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMarket}
              onChange={(e) => setNewMarket(e.target.value)}
              placeholder="ឧទាហរណ៍: ទីផ្សារ គ"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white"
            />
            <button
              onClick={() => {
                if (newMarket) {
                  setMarkets([...markets, newMarket]);
                  setNewMarket("");
                }
              }}
              className="bg-green-600 px-4 rounded-lg font-bold text-sm"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleSaveProducts}
          className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl"
        >
          💾 រក្សាទុកបញ្ជី
        </button>

        {/* Signatures */}
        <div className="border-t border-gray-700 pt-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-orange-400 mb-2">
              ៣. រូបភាពហត្ថលេខា (Marketing)
            </label>
            <input
              type="file"
              onChange={(e) => uploadSignature(e, "signatureUrl")}
              className="text-xs text-gray-400 mb-2"
            />
            {companySettings?.signatureUrl && (
              <img
                src={companySettings.signatureUrl}
                className="h-10 bg-white p-1 rounded"
                alt="Marketing Sign"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-orange-400 mb-2">
              ៤. រូបភាពហត្ថលេខា (Check/Finance)
            </label>
            <input
              type="file"
              onChange={(e) => uploadSignature(e, "financeSignatureUrl")}
              className="text-xs text-gray-400 mb-2"
            />
            {companySettings?.financeSignatureUrl && (
              <img
                src={companySettings.financeSignatureUrl}
                className="h-10 bg-white p-1 rounded"
                alt="Finance Sign"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // ៤. VIEW: ទិន្នន័យ និង បម្រុងទុក (Data)
  // ==========================================
  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,ID,Customer,Amount\n1,ក្រុមហ៊ុន ក,1500\n2,ក្រុមហ៊ុន ខ,3200";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AppBetong_Backup.csv");
    document.body.appendChild(link);
    link.click();
  };

  const renderBackup = () => (
    <div className="space-y-6 animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-white">
          💾 ទិន្នន័យ (Data & Backup)
        </h2>
      </div>
      <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-xl text-center space-y-4">
        <div className="text-5xl mb-2">📊</div>
        <p className="text-sm text-gray-300">
          អ្នកអាចទាញយកទិន្នន័យវិក្កយបត្រ និងការកំណត់ទាំងអស់ចេញជាទម្រង់ Excel
          (CSV) ដើម្បីរក្សាទុកដោយសុវត្ថិភាព។
        </p>
        <button
          onClick={exportData}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg w-full"
        >
          📥 Export Data to Excel
        </button>
      </div>
    </div>
  );

  // ==========================================
  // ៥. VIEW: អំពីកម្មវិធី (About)
  // ==========================================
  const renderAbout = () => (
    <div className="space-y-6 animate-slide-in-right">
      <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-white">
          ℹ️ អំពីកម្មវិធី (About)
        </h2>
      </div>
      <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden divide-y divide-gray-700/50 shadow-xl text-sm">
        <div className="p-4 flex justify-between">
          <span className="text-gray-300">App Version</span>
          <span className="font-bold text-orange-400">v1.2.0</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-300">Terms of Service</span>
          <span className="text-gray-500">›</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-300">Privacy Policy</span>
          <span className="text-gray-500">›</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-300">Help & Support</span>
          <span className="text-gray-500">›</span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="text-gray-300">Contact Support</span>
          <span className="text-gray-500">›</span>
        </div>
        <button className="w-full p-4 text-left text-blue-400 font-bold hover:bg-gray-750">
          🔄 Check for Updates
        </button>
      </div>
    </div>
  );

  // ==========================================
  // តំបន់ Render ជ្រើសរើស View
  // ==========================================
  return (
    <div className="max-w-lg mx-auto pb-6">
      {view === "main" && renderMain()}
      {view === "profile" && renderProfile()}
      {view === "product" && renderProduct()}
      {view === "backup" && renderBackup()}
      {view === "about" && renderAbout()}

      <style>{`
        .animate-slide-in-right { animation: slideIn 0.3s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Settings;

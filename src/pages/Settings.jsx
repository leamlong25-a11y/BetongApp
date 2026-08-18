import React, { useState } from "react";
import { auth, db } from "../services/firebase";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { ref as dbRef, update } from "firebase/database";

const Settings = ({ companySettings, setCompanySettings }) => {
  const [view, setView] = useState("main"); // main, profile, product, backup, about
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const goBack = () => setView("main");

  // ==========================================
  // ១. VIEW: ម៉ឺនុយមេ (Main Settings Menu)
  // ==========================================
  const renderMain = () => (
    <div
      className="space-y-4 max-w-lg mx-auto"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      <h1 className="text-xl font-extrabold text-white mb-4 px-1">
        ⚙️ ការកំណត់ (Settings)
      </h1>

      <div className="bg-gray-800 rounded-3xl border border-gray-700/80 overflow-hidden divide-y divide-gray-700/50 shadow-xl">
        <button
          onClick={() => setView("profile")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-lg">
              👤
            </div>
            <span className="text-xs font-bold text-gray-200">
              ក. គណនី (Profile)
            </span>
          </div>
          <span className="text-gray-500 text-lg">›</span>
        </button>

        <button
          onClick={() => setView("product")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-lg">
              🏢
            </div>
            <span className="text-xs font-bold text-gray-200">
              ខ. ផលិតផល & សេវាកម្ម (Product / Service)
            </span>
          </div>
          <span className="text-gray-500 text-lg">›</span>
        </button>

        <button
          onClick={() => setView("backup")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center text-lg">
              💾
            </div>
            <span className="text-xs font-bold text-gray-200">
              គ. ទិន្នន័យ & បម្រុងទុក (Data and Backup)
            </span>
          </div>
          <span className="text-gray-500 text-lg">›</span>
        </button>

        <button
          onClick={() => setView("about")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-lg">
              ℹ️
            </div>
            <span className="text-xs font-bold text-gray-200">
              ឃ. អំពីកម្មវិធី (About)
            </span>
          </div>
          <span className="text-gray-500 text-lg">›</span>
        </button>
      </div>
    </div>
  );

  // ==========================================
  // ២. VIEW: គណនី (Profile) - ប្រើ Base64 ជំនួស Storage
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

    if (file.size > 1024 * 1024) {
      alert("❌ រូបភាពមានទំហំធំពេក សូមជ្រើសរើសរូបភាពក្រោម 1MB!");
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        await updateProfile(user, { photoURL: base64String });
        alert("✅ ប្តូររូបភាពគណនីជោគជ័យ!");
        setLoading(false);
        // Refresh component state if needed
        window.location.reload();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("❌ មានបញ្ហា: " + err.message);
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const renderProfile = () => (
    <div
      className="space-y-6 max-w-lg mx-auto pb-16"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4 px-1">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-xl font-bold"
        >
          ←
        </button>
        <h2 className="text-base font-bold text-white">ក. គណនី (Profile)</h2>
      </div>

      <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700/80 shadow-xl space-y-4">
        {/* i. រូបភាព */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-gray-700 overflow-hidden border-2 border-orange-500 shadow-md">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                👨‍💼
              </div>
            )}
          </div>
          <label className="text-xs text-orange-400 cursor-pointer hover:underline font-bold">
            📷 ផ្លាស់ប្តូររូបភាព
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        {/* ii. ឈ្មោះអ្នកប្រើប្រាស់ */}
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            ឈ្មោះអ្នកប្រើប្រាស់ (អាចប្តូរបាន)
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* iii. Email */}
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            Email (មិនអាចប្តូរបាន)
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-xs text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* iv. ប្តូរ Password */}
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            ប្តូរ Password (ថ្មី)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg text-xs"
        >
          {loading ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុកការផ្លាស់ប្តូរ"}
        </button>

        {/* v. Log out */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs"
        >
          🚪 ចាកចេញពីប្រព័ន្ធ (Log out)
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
      alert("✅ រក្សាទុកជោគជ័យ!");
    } catch (err) {
      alert("❌ បរាជ័យ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadSignatureBase64 = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("❌ រូបភាពមានទំហំធំពេក សូមជ្រើសរើសរូបភាពក្រោម 1MB!");
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        const updatedData = { ...companySettings, [type]: base64String };
        await update(dbRef(db, "settings"), updatedData);
        setCompanySettings(updatedData);
        alert("✅ ដាក់រូបហត្ថលេខាជោគជ័យ!");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("❌ Error: " + err.message);
      setLoading(false);
    }
  };

  const renderProduct = () => (
    <div
      className="space-y-6 max-w-lg mx-auto pb-16"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4 px-1">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-xl font-bold"
        >
          ←
        </button>
        <h2 className="text-base font-bold text-white">
          ខ. ផលិតផល & សេវាកម្ម (Product / Service)
        </h2>
      </div>

      <div className="bg-gray-800 p-5 rounded-3xl border border-gray-700/80 shadow-xl space-y-5 text-xs">
        {/* i. កំណត់បន្ថែមកម្លាំងបេតុង */}
        <div>
          <label className="block font-bold text-orange-400 mb-2">
            i. កំណត់បន្ថែមកម្លាំងបេតុង
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {concretes.map((c, i) => (
              <span
                key={i}
                className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-xl flex items-center gap-2"
              >
                {c}{" "}
                <button
                  onClick={() =>
                    setConcretes(concretes.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-300 font-bold"
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
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
            />
            <button
              onClick={() => {
                if (newConcrete) {
                  setConcretes([...concretes, newConcrete]);
                  setNewConcrete("");
                }
              }}
              className="bg-green-600 px-4 rounded-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* ii. កំណត់បន្ថែមឈ្មោះទីផ្សារ */}
        <div className="border-t border-gray-700/60 pt-4">
          <label className="block font-bold text-orange-400 mb-2">
            ii. កំណត់បន្ថែមឈ្មោះទីផ្សារ
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {markets.map((m, i) => (
              <span
                key={i}
                className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-xl flex items-center gap-2"
              >
                {m}{" "}
                <button
                  onClick={() =>
                    setMarkets(markets.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-300 font-bold"
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
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
            />
            <button
              onClick={() => {
                if (newMarket) {
                  setMarkets([...markets, newMarket]);
                  setNewMarket("");
                }
              }}
              className="bg-green-600 px-4 rounded-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleSaveProducts}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition shadow"
        >
          💾 រក្សាទុកបញ្ជី
        </button>

        {/* iii & iv. Signatures */}
        <div className="border-t border-gray-700/60 pt-4 space-y-4">
          <div>
            <label className="block font-bold text-orange-400 mb-1">
              iii. កំណត់រូបភាព Signature Marketing
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadSignatureBase64(e, "signatureUrl")}
              className="text-[11px] text-gray-400 mb-2"
            />
            {companySettings?.signatureUrl && (
              <img
                src={companySettings.signatureUrl}
                className="h-10 bg-white p-1 rounded-lg object-contain shadow"
                alt="Marketing Sign"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-orange-400 mb-1">
              iv. កំណត់រូបភាព Signature Check/Finance
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadSignatureBase64(e, "financeSignatureUrl")}
              className="text-[11px] text-gray-400 mb-2"
            />
            {companySettings?.financeSignatureUrl && (
              <img
                src={companySettings.financeSignatureUrl}
                className="h-10 bg-white p-1 rounded-lg object-contain shadow"
                alt="Finance Sign"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // ៤. VIEW: ទិន្នន័យ & បម្រុងទុក (Data and backup)
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
    <div
      className="space-y-6 max-w-lg mx-auto pb-16"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4 px-1">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-xl font-bold"
        >
          ←
        </button>
        <h2 className="text-base font-bold text-white">
          គ. ទិន្នន័យ & បម្រុងទុក (Data and backup)
        </h2>
      </div>
      <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700/80 shadow-xl text-center space-y-4 text-xs">
        <div className="text-4xl mb-1">📊</div>
        <p className="text-gray-300">
          i. អាច Export រាល់ Data ទាំងអស់ជា Excel (CSV)
          ដើម្បីរក្សាទុកដោយសុវត្ថិភាព។
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
    <div
      className="space-y-6 max-w-lg mx-auto pb-16"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4 px-1">
        <button
          onClick={goBack}
          className="text-gray-400 hover:text-white text-xl font-bold"
        >
          ←
        </button>
        <h2 className="text-base font-bold text-white">
          ឃ. អំពីកម្មវិធី (About)
        </h2>
      </div>
      <div className="bg-gray-800 rounded-3xl border border-gray-700/80 overflow-hidden divide-y divide-gray-700/50 shadow-xl text-xs">
        <div className="p-4 flex justify-between items-center">
          <span className="text-gray-300">i. App Version</span>
          <span className="font-bold text-orange-400">v1.2.0</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-gray-300">ii. Terms of Service</span>
          <span className="text-gray-500 text-base">›</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-gray-300">iii. Privacy Policy</span>
          <span className="text-gray-500 text-base">›</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-gray-300">iv. Help & Support</span>
          <span className="text-gray-500 text-base">›</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-gray-300">v. Contact Support</span>
          <span className="text-gray-500 text-base">›</span>
        </div>
        <button className="w-full p-4 text-left text-blue-400 font-bold hover:bg-gray-750 transition">
          vi. Check for Updates
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {view === "main" && renderMain()}
      {view === "profile" && renderProfile()}
      {view === "product" && renderProduct()}
      {view === "backup" && renderBackup()}
      {view === "about" && renderAbout()}
    </div>
  );
};

export default Settings;

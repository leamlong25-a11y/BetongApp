import React, { useState } from "react";
import { storage, db } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";

const Settings = ({ companySettings, setCompanySettings, onGoToProfile }) => {
  const [settings, setSettings] = useState(companySettings);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const storageRef = ref(storage, "signatures/marketing_sign");
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const updatedSettings = { ...settings, signatureUrl: url };
      // រក្សាទុកចូល Firebase Database ភ្លាមៗ
      await set(dbRef(db, "settings"), updatedSettings);

      setSettings(updatedSettings);
      setCompanySettings(updatedSettings);
      alert("✅ រក្សាទុករូបហត្ថលេខាទៅ Firebase បានដោយជោគជ័យ!");
    } catch (err) {
      alert("❌ មានបញ្ហាក្នុងការ Upload: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // រក្សាទុកការកំណត់ទាំងអស់ចូល Firebase Database
      await set(dbRef(db, "settings"), settings);
      setCompanySettings(settings);
      alert("✅ រក្សាទុកការកំណត់ទៅ Firebase បានដោយជោគជ័យ!");
    } catch (err) {
      alert("❌ មានបញ្ហាក្នុងការរក្សាទុក: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-100">
      {/* ផ្នែកបញ្ជាចូល Profile */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-orange-400">
            👤 គណនីរបស់អ្នក
          </h2>
          <p className="text-xs text-gray-400">
            គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងសន្តិសុខប្រព័ន្ធ
          </p>
        </div>
        <button
          onClick={onGoToProfile}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow"
        >
          មើល Profile ➡️
        </button>
      </div>

      {/* ផ្នែកការកំណត់ក្រុមហ៊ុន */}
      <form
        onSubmit={handleSave}
        className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-xl space-y-4"
      >
        <h2 className="text-lg font-bold text-orange-400 border-b border-gray-700 pb-2">
          ⚙️ ការកំណត់ព័ត៌មានក្រុមហ៊ុន
        </h2>

        <div>
          <label className="block text-xs text-gray-300">
            ឈ្មោះក្រុមហ៊ុន (ខ្មែរ)
          </label>
          <input
            type="text"
            name="companyKhmerName"
            value={settings.companyKhmerName}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-300">
            ឈ្មោះក្រុមហ៊ុន (អង់គ្លេស)
          </label>
          <input
            type="text"
            name="companyEnglishName"
            value={settings.companyEnglishName}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-300">លេខគណនី ABA</label>
            <input
              type="text"
              name="abaNumber"
              value={settings.abaNumber}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-300">
              ឈ្មោះម្ចាស់គណនី
            </label>
            <input
              type="text"
              name="accountHolder"
              value={settings.accountHolder}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-300">
            ផ្លាស់ប្តូររូបហត្ថលេខា
          </label>
          <input
            type="file"
            onChange={handleSignatureUpload}
            className="text-xs mt-1 text-gray-300"
          />
          {saving && (
            <p className="text-orange-500 text-xs mt-1">កំពុងផ្ទុក...</p>
          )}
          {settings.signatureUrl && (
            <img
              src={settings.signatureUrl}
              className="h-12 mt-2 bg-white p-1 rounded"
              alt="Sign"
            />
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow transition"
          >
            💾 រក្សាទុកការកំណត់ទៅ Firebase
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

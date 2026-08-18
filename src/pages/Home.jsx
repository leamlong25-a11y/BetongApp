import React from "react";

const Home = ({ setActivePage }) => {
  return (
    <div className="space-y-6 text-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          🏗️ សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ AppBetong
        </h1>
        <p className="text-xs sm:text-base text-orange-100 max-w-2xl leading-relaxed">
          ប្រព័ន្ធគ្រប់គ្រង និងចេញវិក្កយបត្របេតុង ការគណនាថ្លៃដើម ប្រាក់ចំណេញ
          និងគ្រប់គ្រងព័ត៌មានអាជីវកម្មរបស់អ្នកយ៉ាងមានវិជ្ជាជីវៈ
          និងសុវត្ថិភាពខ្ពស់។
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => setActivePage("invoice")}
            className="bg-white text-orange-700 font-bold px-5 py-2.5 rounded-lg shadow-lg hover:bg-gray-100 transition text-xs sm:text-sm flex items-center gap-2"
          >
            <span>📄</span> បង្កើតវិក្កយបត្រឥឡូវនេះ
          </button>
          <button
            onClick={() => setActivePage("dashboard")}
            className="bg-orange-800 text-white font-bold px-5 py-2.5 rounded-lg shadow-lg hover:bg-orange-900 transition text-xs sm:text-sm flex items-center gap-2"
          >
            <span>📊</span> ទៅកាន់ Dashboard
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <div className="bg-gray-800 p-5 sm:p-6 rounded-xl border border-gray-700 shadow-lg space-y-2 hover:border-orange-500 transition">
          <div className="text-3xl">🚀</div>
          <h3 className="font-bold text-base text-white">លឿន និងងាយស្រួល</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            ជួយសម្រួលដល់ការគណនាចំនួនបេតុង តម្លៃលក់ ថ្លៃបូម
            និងថ្លៃដឹកជញ្ជូនបានយ៉ាងឆាប់រហ័សដោយមិនបាច់គណនាដោយដៃ។
          </p>
        </div>

        <div className="bg-gray-800 p-5 sm:p-6 rounded-xl border border-gray-700 shadow-lg space-y-2 hover:border-orange-500 transition">
          <div className="text-3xl">🖨️</div>
          <h3 className="font-bold text-base text-white">
            បោះពុម្ព និង Save PDF
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            មានទម្រង់ Invoice ស្តង់ដារត្រឹមត្រូវ អាចព្រីនចេញ ឬរក្សាទុកជា PDF
            សម្រាប់ជូនអតិថិជនបានយ៉ាងស្រស់ស្អាត។
          </p>
        </div>

        <div className="bg-gray-800 p-5 sm:p-6 rounded-xl border border-gray-700 shadow-lg space-y-2 hover:border-orange-500 transition sm:col-span-2 md:col-span-1">
          <div className="text-3xl">🔒</div>
          <h3 className="font-bold text-base text-white">
            សុវត្ថិភាពខ្ពស់លើ Cloud
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            តភ្ជាប់ជាមួយ Firebase ធានាថាទិន្នន័យក្រុមហ៊ុន
            និងការកំណត់របស់អ្នកត្រូវបានរក្សាទុកដោយសុវត្ថិភាព
            និងអាចចូលប្រើបានគ្រប់ពេល។
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

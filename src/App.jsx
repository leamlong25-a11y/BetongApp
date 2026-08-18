import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut, db } from "./services/firebase";
import { ref, onValue } from "firebase/database";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewInvoice from "./pages/NewInvoice";
import Settings from "./pages/Settings";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState("login");
  const [activePage, setActivePage] = useState("home");
  const [searchQuery, setSearchQuery] = useState(""); // បន្ថែម state សម្រាប់ស្វែងរក

  const [companySettings, setCompanySettings] = useState({
    companyKhmerName: "ក្រុមហ៊ុនបេតុង ជី.ស៊ី.អិម ខនគ្រីត",
    companyEnglishName: "GCM CONCRETE MIXING CO.,LTD",
    abaNumber: "500 208 793",
    accountHolder: "LEAM SEAKNGENG",
    signatureUrl: "",
    financeSignatureUrl: "",
    concreteTypes: ["C25", "C30", "C35"],
    markets: ["ទីផ្សារ ក", "ទីផ្សារ ខ"],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const settingsRef = ref(db, "settings");
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setCompanySettings((prev) => ({ ...prev, ...data }));
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-950 flex items-center justify-center text-white"
        style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
      >
        កំពុងផ្ទុក...
      </div>
    );
  }

  if (!user) {
    return authView === "signup" ? (
      <Signup onSwitchToLogin={() => setAuthView("login")} />
    ) : (
      <Login
        onLoginSuccess={() => setUser(auth.currentUser)}
        onSwitchToSignup={() => setAuthView("signup")}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 flex flex-col"
      style={{ fontFamily: '"Khmer OS Siemreap", sans-serif' }}
    >
      {/* Top App Bar ជាមួយ Search functionality */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-28 px-4 print:pt-0 print:pb-0 print:px-0">
        {activePage === "home" && <Home setActivePage={setActivePage} />}
        {activePage === "dashboard" && <Dashboard searchQuery={searchQuery} />}
        {activePage === "invoice" && (
          <NewInvoice companySettings={companySettings} />
        )}
        {activePage === "settings" && (
          <Settings
            companySettings={companySettings}
            setCompanySettings={setCompanySettings}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
};

export default App;

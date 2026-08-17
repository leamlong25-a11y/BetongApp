import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut, db } from "./services/firebase";
import { ref, onValue } from "firebase/database";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar"; // <-- កែសម្រួល Path ត្រង់នេះឱ្យត្រូវនឹង components
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewInvoice from "./pages/NewInvoice";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState("login");
  const [activePage, setActivePage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [companySettings, setCompanySettings] = useState({
    companyKhmerName: "ក្រុមហ៊ុនបេតុង ជី.ស៊ី.អិម ខនគ្រីត",
    companyEnglishName: "GCM CONCRETE MIXING CO.,LTD",
    abaNumber: "500 208 793",
    accountHolder: "LEAM SEAKNGENG",
    signatureUrl: "",
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
      if (data) {
        setCompanySettings((prev) => ({ ...prev, ...data }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p>កំពុងផ្ទុកទិន្នន័យ...</p>
      </div>
    );
  }

  if (!user) {
    if (authView === "signup") {
      return <Signup onSwitchToLogin={() => setAuthView("login")} />;
    }
    return (
      <Login
        onLoginSuccess={() => setUser(auth.currentUser)}
        onSwitchToSignup={() => setAuthView("signup")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex text-gray-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activePage={activePage}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
        />

        <main className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activePage === "home" && <Home setActivePage={setActivePage} />}
          {activePage === "dashboard" && (
            <Dashboard setActivePage={setActivePage} />
          )}
          {activePage === "invoice" && (
            <NewInvoice companySettings={companySettings} />
          )}
          {activePage === "settings" && (
            <Settings
              companySettings={companySettings}
              setCompanySettings={setCompanySettings}
              onGoToProfile={() => setActivePage("profile")}
            />
          )}
          {activePage === "profile" && (
            <Profile
              user={user}
              onBackToSettings={() => setActivePage("settings")}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

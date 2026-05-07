import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import PaymentsScreen from "./components/PaymentsScreen";
import TelecomScreen from "./components/TelecomScreen";
import TransfersScreen from "./components/TransfersScreen";
import TransferOtherBankScreen from "./components/TransferOtherBankScreen";
import Loader from "./components/Loader";
import { AuthProvider, useAuth } from "./context/AuthContext";

type ViewType = "splash" | "login" | "home" | "payments" | "telecom" | "transfers" | "transferOtherBank";

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<ViewType>("splash");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (view === "splash") {
      const timer = setTimeout(() => {
        if (!loading) {
          navigateTo(user ? "home" : "login");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [view, user, loading]);

  // Handle sudden logout
  useEffect(() => {
    if (!loading && !user && view !== "login" && view !== "splash") {
      setView("login");
    }
  }, [user, loading, view]);

  const navigateTo = (nextView: ViewType) => {
    setIsNavigating(true);
    setTimeout(() => {
      setView(nextView);
      setIsNavigating(false);
    }, 1000); // Simulate network delay
  };

  if (loading && view !== "splash") {
    return <Loader />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-purple-200" dir="rtl">
      {isNavigating && <Loader />}
      
      {view === "splash" && <SplashScreen />}
      {view === "login" && <LoginScreen onLogin={() => navigateTo("home")} />}
      {view === "home" && (
        <HomeScreen 
          onLogout={() => navigateTo("login")} 
          onNavigatePayments={() => navigateTo("payments")} 
          onNavigateTransfers={() => navigateTo("transfers")}
        />
      )}
      {view === "payments" && (
        <PaymentsScreen 
          onBack={() => navigateTo("home")} 
          onNavigateTelecom={() => navigateTo("telecom")} 
        />
      )}
      {view === "telecom" && (
        <TelecomScreen onBack={() => navigateTo("payments")} />
      )}
      {view === "transfers" && (
        <TransfersScreen 
          onBack={() => navigateTo("home")} 
          onNavigateOtherBank={() => navigateTo("transferOtherBank")}
        />
      )}
      {view === "transferOtherBank" && (
        <TransferOtherBankScreen onBack={() => navigateTo("transfers")} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

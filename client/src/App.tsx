import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Reservations from "@/pages/Reservations";
import ActivityLogs from "@/pages/ActivityLogs";
import QRCodes from "@/pages/QRCodes";
import Maintenance from "@/pages/Maintenance";
import UserManagement from "@/pages/UserManagement";
import Reports from "@/pages/Reports";
import type { Language } from "@/lib/translations";

type View = 'login' | 'dashboard' | 'inventory' | 'reservations' | 'activity-logs' | 'qr-codes' | 'maintenance' | 'users' | 'reports';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('login');
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    role: string;
    name: string;
  } | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Only admin and developer can see dashboard, others see inventory
    const initialView = (user.role === 'admin' || user.role === 'developer') ? 'dashboard' : 'inventory';
    setCurrentView(initialView);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    localStorage.removeItem('currentUser');
  };

  const handleNavigateToDashboard = () => {
    // Only admin and developer can navigate to dashboard
    if (currentUser?.role === 'admin' || currentUser?.role === 'developer') {
      setCurrentView('dashboard');
    }
  };

  const handleNavigateToInventory = () => {
    setCurrentView('inventory');
  };

  const handleNavigateToReservations = () => {
    setCurrentView('reservations');
  };

  const handleNavigateToActivityLogs = () => {
    setCurrentView('activity-logs');
  };

  const handleNavigateToQRCodes = () => {
    setCurrentView('qr-codes');
  };

  const handleNavigateToMaintenance = () => {
    setCurrentView('maintenance');
  };

  const handleNavigateToReports = () => {
    setCurrentView('reports');
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        const user = data.user || data;
        handleLogin(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            handleLogin(user);
          } catch {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Session check failed:", error);
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          handleLogin(user);
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } finally {
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
    (window as any).navigateToUsers = () => setCurrentView('users');
    (window as any).navigateToReports = () => setCurrentView('reports');
  }, []);

  if (isSessionLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {!isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : currentView === 'dashboard' && (currentUser?.role === 'admin' || currentUser?.role === 'developer') ? (
            <Dashboard
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              userId={currentUser?.id || ''}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToReservations={handleNavigateToReservations}
              onNavigateToActivityLogs={handleNavigateToActivityLogs}
              onNavigateToQRCodes={handleNavigateToQRCodes}
              onNavigateToMaintenance={handleNavigateToMaintenance}
              onNavigateToReports={handleNavigateToReports}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : currentView === 'inventory' ? (
            <Inventory
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              userId={currentUser?.id || ''}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToReservations={handleNavigateToReservations}
              onNavigateToActivityLogs={handleNavigateToActivityLogs}
              onNavigateToQRCodes={handleNavigateToQRCodes}
              onNavigateToMaintenance={handleNavigateToMaintenance}
              onNavigateToReports={handleNavigateToReports}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : currentView === 'reservations' ? (
            <Reservations
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              userId={currentUser?.id || ''}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToActivityLogs={handleNavigateToActivityLogs}
              onNavigateToQRCodes={handleNavigateToQRCodes}
              onNavigateToMaintenance={handleNavigateToMaintenance}
              onNavigateToReports={handleNavigateToReports}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : currentView === 'activity-logs' ? (
            <ActivityLogs
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToReservations={handleNavigateToReservations}
              onNavigateToQRCodes={handleNavigateToQRCodes}
              onNavigateToMaintenance={handleNavigateToMaintenance}
              onNavigateToReports={handleNavigateToReports}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : currentView === 'qr-codes' ? (
            <QRCodes
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToReservations={handleNavigateToReservations}
              onNavigateToActivityLogs={handleNavigateToActivityLogs}
              onNavigateToMaintenance={handleNavigateToMaintenance}
              onNavigateToReports={handleNavigateToReports}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : currentView === 'maintenance' ? (
            <Maintenance
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToReservations={handleNavigateToReservations}
              onNavigateToActivityLogs={handleNavigateToActivityLogs}
              onNavigateToQRCodes={handleNavigateToQRCodes}
              onNavigateToReports={handleNavigateToReports}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : currentView === 'users' ? (
            <UserManagement
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToReservations={handleNavigateToReservations}
              onNavigateToActivityLogs={handleNavigateToActivityLogs}
              onNavigateToQRCodes={handleNavigateToQRCodes}
              onNavigateToMaintenance={handleNavigateToMaintenance}
              onNavigateToReports={handleNavigateToReports}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : currentView === 'reports' ? (
            <Reports
              userName={currentUser?.name || 'User'}
              userRole={currentUser?.role || 'user'}
              onLogout={handleLogout}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToReservations={handleNavigateToReservations}
              onNavigateToActivityLogs={handleNavigateToActivityLogs}
              onNavigateToQRCodes={handleNavigateToQRCodes}
              onNavigateToMaintenance={handleNavigateToMaintenance}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          ) : null}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

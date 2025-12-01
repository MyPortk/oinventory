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
    // All users see dashboard first
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    localStorage.removeItem('currentUser');
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

  const handleNavigateToInventory = () => {
    setCurrentView('inventory');
  };

  const handleNavigateToReports = () => {
    setCurrentView('reports');
  };

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        const user = data.user || data;
        handleLogin(user);
        // Save to localStorage as backup
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        // Try localStorage fallback
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
      // Try localStorage fallback on error
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
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
    // Expose navigate functions for header
    (window as any).navigateToUsers = () => setCurrentView('users');
    (window as any).navigateToReports = () => setCurrentView('reports');
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isSessionLoading ? (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          <Login onLogin={handleLogin} language={language} onLanguageChange={handleLanguageChange} />
        ) : currentView === 'dashboard' ? (
          <Dashboard
            language={language}
            onNavigateToInventory={handleNavigateToInventory}
            onNavigateToReservations={handleNavigateToReservations}
            onNavigateToMaintenance={handleNavigateToMaintenance}
            userRole={currentUser?.role}
          />
        ) : currentView === 'inventory' ? (
          <Inventory
            userName={currentUser?.name || ''}
            userRole={currentUser?.role || ''}
            userId={currentUser?.id || ''}
            onLogout={handleLogout}
            onNavigateToReservations={handleNavigateToReservations}
            onNavigateToActivityLogs={handleNavigateToActivityLogs}
            onNavigateToQRCodes={handleNavigateToQRCodes}
            onNavigateToMaintenance={handleNavigateToMaintenance}
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        ) : currentView === 'reservations' ? (
          <Reservations
            userName={currentUser?.name || ''}
            userRole={currentUser?.role || ''}
            userId={currentUser?.id || ''}
            onLogout={handleLogout}
            onNavigateToInventory={handleNavigateToInventory}
            onNavigateToActivityLogs={handleNavigateToActivityLogs}
            onNavigateToQRCodes={handleNavigateToQRCodes}
            onNavigateToMaintenance={handleNavigateToMaintenance}
            onNavigateToReports={handleNavigateToReports}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        ) : currentView === 'activity-logs' ? (
          <ActivityLogs
            userName={currentUser?.name || ''}
            userRole={currentUser?.role || ''}
            onLogout={handleLogout}
            onNavigateToInventory={handleNavigateToInventory}
            onNavigateToReservations={handleNavigateToReservations}
            onNavigateToQRCodes={handleNavigateToQRCodes}
            onNavigateToMaintenance={handleNavigateToMaintenance}
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            onNavigateToReports={handleNavigateToReports}
          />
        ) : currentView === 'qr-codes' ? (
          <QRCodes
            userName={currentUser?.name || ''}
            userRole={currentUser?.role || ''}
            onLogout={handleLogout}
            onNavigateToInventory={handleNavigateToInventory}
            onNavigateToReservations={handleNavigateToReservations}
            onNavigateToActivityLogs={handleNavigateToActivityLogs}
            onNavigateToMaintenance={handleNavigateToMaintenance}
            onNavigateToReports={handleNavigateToReports}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        ) : currentView === 'maintenance' ? (
          <Maintenance
            userName={currentUser?.name || ''}
            userRole={currentUser?.role || ''}
            userId={currentUser?.id || ''}
            onLogout={handleLogout}
            onNavigateToInventory={handleNavigateToInventory}
            onNavigateToReservations={handleNavigateToReservations}
            onNavigateToActivityLogs={handleNavigateToActivityLogs}
            onNavigateToQRCodes={handleNavigateToQRCodes}
            onNavigateToReports={handleNavigateToReports}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        ) : currentView === 'reports' ? (
          <Reports
            userName={currentUser?.name || ''}
            userRole={currentUser?.role || ''}
            userId={currentUser?.id || ''}
            onLogout={handleLogout}
            onNavigateToInventory={handleNavigateToInventory}
            onNavigateToReservations={handleNavigateToReservations}
            onNavigateToActivityLogs={handleNavigateToActivityLogs}
            onNavigateToQRCodes={handleNavigateToQRCodes}
            onNavigateToMaintenance={handleNavigateToMaintenance}
            onNavigateToReports={() => {}}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        ) : currentView === 'users' && currentUser && (currentUser.role === 'admin' || currentUser.role === 'developer') ? (
          <UserManagement
            userName={currentUser.name}
            userRole={currentUser.role}
            onLogout={handleLogout}
            onNavigateToInventory={handleNavigateToInventory}
            onNavigateToReservations={handleNavigateToReservations}
            onNavigateToActivityLogs={handleNavigateToActivityLogs}
            onNavigateToQRCodes={handleNavigateToQRCodes}
            onNavigateToMaintenance={handleNavigateToMaintenance}
            onNavigateToReports={handleNavigateToReports}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        ) : null}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
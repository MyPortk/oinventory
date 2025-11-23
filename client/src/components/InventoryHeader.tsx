import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Calendar, ClipboardList, QrCode, Wrench, Package, Globe, AlertCircle, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationBell from "./NotificationBell";
import { useTranslation, Language } from "@/lib/translations";

interface InventoryHeaderProps {
  userName: string;
  userRole: string;
  currentView: 'categories' | 'inventory';
  onViewChange: (view: 'categories' | 'inventory') => void;
  onLogout: () => void;
  onNavigateToReservations?: () => void;
  onNavigateToActivityLogs?: () => void;
  onNavigateToQRCodes?: () => void;
  onNavigateToMaintenance?: () => void;
  onNavigateToReports?: () => void;
  hideViewToggle?: boolean;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function InventoryHeader({
  userName,
  userRole,
  currentView,
  onViewChange,
  onLogout,
  onNavigateToReservations,
  onNavigateToActivityLogs,
  onNavigateToQRCodes,
  onNavigateToMaintenance,
  onNavigateToReports,
  hideViewToggle = false,
  language = 'en',
  onLanguageChange
}: InventoryHeaderProps) {
  const t = useTranslation(language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-3 md:px-5 py-3 md:py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <Package className="w-6 md:w-8 h-6 md:h-8 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate" data-testid="text-app-title">{t('inventory_manager')}</h1>
              <p className="text-xs md:text-sm opacity-90 truncate" data-testid="text-user-info">
                {userName} • {userRole}
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {!hideViewToggle && (
              <div className="flex gap-1 bg-white/10 rounded-lg p-1 mr-2">
                <Button
                  variant={currentView === 'categories' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('categories')}
                  className={currentView === 'categories' ? '' : 'text-white hover:bg-white/20'}
                  data-testid="button-view-categories"
                >
                  {t('categories')}
                </Button>
                <Button
                  variant={currentView === 'inventory' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('inventory')}
                  className={currentView === 'inventory' ? '' : 'text-white hover:bg-white/20'}
                  data-testid="button-view-inventory"
                >
                  {t('all_items')}
                </Button>
              </div>
            )}

            <NotificationBell language={language} />

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'en' ? 'EN' : 'AR'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem 
                  onClick={() => onLanguageChange?.('en')} 
                  className={language === 'en' ? 'bg-accent' : ''}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onLanguageChange?.('ar')} 
                  className={language === 'ar' ? 'bg-accent' : ''}
                >
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Users className="w-4 h-4" />
                  <span className="ml-1">{t('menu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('navigation')}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {onNavigateToReservations && (
                  <DropdownMenuItem onClick={onNavigateToReservations}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('reservations')}
                  </DropdownMenuItem>
                )}

                {onNavigateToReports && (
                  <DropdownMenuItem onClick={onNavigateToReports}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Reports
                  </DropdownMenuItem>
                )}

                {userRole === 'admin' && onNavigateToActivityLogs && (
                  <DropdownMenuItem onClick={onNavigateToActivityLogs}>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    {t('activityLog')}
                  </DropdownMenuItem>
                )}

                {userRole === 'admin' && onNavigateToQRCodes && (
                  <DropdownMenuItem onClick={onNavigateToQRCodes}>
                    <QrCode className="w-4 h-4 mr-2" />
                    {t('qrCodes')}
                  </DropdownMenuItem>
                )}

                {userRole === 'admin' && onNavigateToMaintenance && (
                  <DropdownMenuItem onClick={onNavigateToMaintenance}>
                    <Wrench className="w-4 h-4 mr-2" />
                    {t('maintenance')}
                  </DropdownMenuItem>
                )}

                {(userRole === 'admin' || userRole === 'developer') && (
                  <DropdownMenuItem onClick={() => (window as any).navigateToUsers?.()}>
                    <Users className="w-4 h-4 mr-2" />
                    {t('userManagement')}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-2 pb-3 border-t border-white/20 pt-3">
            {!hideViewToggle && (
              <div className="flex gap-2 bg-white/10 rounded-lg p-2">
                <Button
                  variant={currentView === 'categories' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onViewChange('categories');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 ${currentView === 'categories' ? '' : 'text-white hover:bg-white/20'}`}
                >
                  {t('categories')}
                </Button>
                <Button
                  variant={currentView === 'inventory' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onViewChange('inventory');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 ${currentView === 'inventory' ? '' : 'text-white hover:bg-white/20'}`}
                >
                  {t('all_items')}
                </Button>
              </div>
            )}

            <div className="space-y-1">
              {onNavigateToReservations && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onNavigateToReservations();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white hover:bg-white/20"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('reservations')}
                </Button>
              )}
              {onNavigateToReports && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onNavigateToReports();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white hover:bg-white/20"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              )}
              {onNavigateToActivityLogs && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onNavigateToActivityLogs();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white hover:bg-white/20"
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  {t('activity_logs')}
                </Button>
              )}
              {onNavigateToQRCodes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onNavigateToQRCodes();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white hover:bg-white/20"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Codes
                </Button>
              )}
              {onNavigateToMaintenance && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onNavigateToMaintenance();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white hover:bg-white/20"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  {t('maintenance')}
                </Button>
              )}
              <div className="border-t border-white/20 pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-full justify-start text-white hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

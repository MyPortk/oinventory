import { Button } from "@/components/ui/button";
import { LogOut, Users, Calendar, ClipboardList, QrCode, Wrench, Package, Globe } from "lucide-react";
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
  hideViewToggle = false,
  language = 'en',
  onLanguageChange
}: InventoryHeaderProps) {
  const t = useTranslation(language);

  return (
    <header className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-app-title">{t('inventory_manager')}</h1>
            <p className="text-sm opacity-90" data-testid="text-user-info">
              {userName} • {userRole}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!hideViewToggle && (
            <div className="flex gap-2 bg-white/10 rounded-lg p-1">
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

          <NotificationBell />

          {/* Language Toggle - Always Visible */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-2"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">{language === 'en' ? 'English' : 'العربية'}</span>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Users className="w-4 h-4 mr-2" />
                {t('menu')}
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

              {userRole === 'admin' && (
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
      </div>
    </header>
  );
}
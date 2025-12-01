import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import InventoryHeader from "@/components/InventoryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, type Item } from "@/lib/api";
import { useTranslation, type Language } from "@/lib/translations";
import { Package, Clock, AlertCircle, CheckCircle2, BookOpen, TrendingUp } from "lucide-react";

interface DashboardProps {
  userName: string;
  userRole: string;
  userId: string;
  onLogout: () => void;
  onNavigateToReservations?: () => void;
  onNavigateToActivityLogs?: () => void;
  onNavigateToQRCodes?: () => void;
  onNavigateToMaintenance?: () => void;
  onNavigateToReports?: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Dashboard({
  userName,
  userRole,
  userId,
  onLogout,
  onNavigateToReservations,
  onNavigateToActivityLogs,
  onNavigateToQRCodes,
  onNavigateToMaintenance,
  onNavigateToReports,
  currentLanguage,
  onLanguageChange
}: DashboardProps) {
  const [currentView] = useState<'categories' | 'inventory'>('categories');
  const t = useTranslation(currentLanguage);

  const { data: items = [] } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => api.items.getAll(),
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ['/api/reservations'],
    queryFn: () => api.reservations.getAll(),
  });

  // Calculate stats
  const totalItems = items.length;
  const availableItems = items.filter(item => item.status === 'Available').length;
  const inUseItems = items.filter(item => item.status === 'In Use').length;
  const reservedItems = items.filter(item => item.status === 'Reserved').length;
  const maintenanceItems = items.filter(item => item.status === 'Maintenance').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;

  // Status distribution data for chart
  const statusChartData = [
    { name: t('available'), value: availableItems, fill: '#22c55e' },
    { name: t('inUse'), value: inUseItems, fill: '#3b82f6' },
    { name: t('reserved'), value: reservedItems, fill: '#f59e0b' },
    { name: t('maintenance'), value: maintenanceItems, fill: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <InventoryHeader
        userName={userName}
        userRole={userRole}
        currentView={currentView}
        onViewChange={() => {}}
        onLogout={onLogout}
        onNavigateToReservations={onNavigateToReservations}
        onNavigateToActivityLogs={onNavigateToActivityLogs}
        onNavigateToQRCodes={onNavigateToQRCodes}
        onNavigateToMaintenance={onNavigateToMaintenance}
        onNavigateToReports={onNavigateToReports}
        hideViewToggle={true}
        language={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-dashboard-title">
            {t('dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {t('overviewInventory')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Total Items */}
          <Card className="hover-elevate" data-testid="card-total-items">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t('totalItems')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-items">{totalItems}</div>
            </CardContent>
          </Card>

          {/* Available */}
          <Card className="hover-elevate bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" data-testid="card-available">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('available')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400" data-testid="text-available">{availableItems}</div>
            </CardContent>
          </Card>

          {/* In Use */}
          <Card className="hover-elevate bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900" data-testid="card-in-use">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('inUse')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400" data-testid="text-in-use">{inUseItems}</div>
            </CardContent>
          </Card>

          {/* Reserved */}
          <Card className="hover-elevate bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900" data-testid="card-reserved">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('reserved')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400" data-testid="text-reserved">{reservedItems}</div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card className="hover-elevate bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900" data-testid="card-maintenance">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {t('maintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-400" data-testid="text-maintenance">{maintenanceItems}</div>
            </CardContent>
          </Card>

          {/* Pending Reservations */}
          <Card className="hover-elevate bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900" data-testid="card-pending">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400" data-testid="text-pending">{pendingReservations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Distribution Chart */}
          <Card className="lg:col-span-2" data-testid="card-status-chart">
            <CardHeader>
              <CardTitle>{currentLanguage === 'ar' ? 'توزيع الحالة' : 'Status Distribution'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle>{currentLanguage === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5568d3] hover:to-[#6a4291]"
                data-testid="button-view-inventory"
              >
                {t('inventory')}
              </Button>
              <Button
                onClick={onNavigateToReservations}
                variant="outline"
                className="w-full"
                data-testid="button-view-reservations"
              >
                {t('reservations')}
              </Button>
              {(userRole === 'admin' || userRole === 'developer') && (
                <Button
                  onClick={onNavigateToMaintenance}
                  variant="outline"
                  className="w-full"
                  data-testid="button-view-maintenance"
                >
                  {t('maintenance')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <Card data-testid="card-summary">
          <CardHeader>
            <CardTitle>{currentLanguage === 'ar' ? 'ملخص سريع' : 'Quick Summary'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{currentLanguage === 'ar' ? 'معدل التوفر' : 'Availability Rate'}</span>
                <span className="font-semibold text-gray-900 dark:text-white" data-testid="text-availability-rate">
                  {totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">{currentLanguage === 'ar' ? 'معدل الاستخدام' : 'Usage Rate'}</span>
                <span className="font-semibold text-gray-900 dark:text-white" data-testid="text-usage-rate">
                  {totalItems > 0 ? Math.round((inUseItems / totalItems) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">{currentLanguage === 'ar' ? 'العناصر المحجوزة' : 'Reserved Items'}</span>
                <span className="font-semibold text-gray-900 dark:text-white" data-testid="text-reserved-items">{reservedItems}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">{currentLanguage === 'ar' ? 'الصيانة المطلوبة' : 'Maintenance Needed'}</span>
                <span className="font-semibold text-gray-900 dark:text-white" data-testid="text-maintenance-needed">{maintenanceItems}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

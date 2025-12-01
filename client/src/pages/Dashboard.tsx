import { useQuery } from "@tanstack/react-query";
import InventoryHeader from "@/components/InventoryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useTranslation, type Language } from "@/lib/translations";
import { Package, Clock, AlertCircle, CheckCircle2, TrendingUp, Activity, Zap, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DashboardProps {
  userName: string;
  userRole: string;
  userId: string;
  onLogout: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToInventory?: () => void;
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
  onNavigateToDashboard,
  onNavigateToInventory,
  onNavigateToReservations,
  onNavigateToActivityLogs,
  onNavigateToQRCodes,
  onNavigateToMaintenance,
  onNavigateToReports,
  currentLanguage,
  onLanguageChange
}: DashboardProps) {
  const t = useTranslation(currentLanguage);

  const { data: items = [] } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => api.items.getAll(),
  }) as any;

  const { data: reservations = [] } = useQuery({
    queryKey: ['/api/reservations'],
    queryFn: () => api.reservations.getAll(),
  }) as any;

  const { data: activityLogs = [] } = useQuery({
    queryKey: ['/api/activity-logs'],
    queryFn: () => api.activityLogs.getAll(),
  }) as any;

  // Calculate stats
  const totalItems = (items as any[]).length;
  const availableItems = (items as any[]).filter((item: any) => item.status === 'Available').length;
  const inUseItems = (items as any[]).filter((item: any) => item.status === 'In Use').length;
  const reservedItems = (items as any[]).filter((item: any) => item.status === 'Reserved').length;
  const maintenanceItems = (items as any[]).filter((item: any) => item.status === 'Maintenance').length;
  const pendingReservations = (reservations as any[]).filter((r: any) => r.status === 'pending').length;
  const approvedReservations = (reservations as any[]).filter((r: any) => r.status === 'approved').length;

  // Calculate most requested equipment
  const equipmentRequestCount: { [key: string]: number } = {};
  (reservations as any[]).forEach((reservation: any) => {
    const itemId = String(reservation.itemId);
    equipmentRequestCount[itemId] = (equipmentRequestCount[itemId] || 0) + 1;
  });

  const mostRequestedData = Object.entries(equipmentRequestCount)
    .map(([itemId, count]) => {
      const item = (items as any[]).find((i: any) => String(i.id) === itemId);
      return {
        name: item?.productName || `Equipment ${itemId}`,
        requests: count,
      };
    })
    .filter((data: any) => data.name !== `Equipment ${equipmentRequestCount}`)
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 6); // Top 6 most requested

  // Calculate by category
  const equipmentCount = (items as any[]).filter((i: any) => i.isEquipment === true).length;
  const assetsCount = (items as any[]).filter((i: any) => i.isEquipment === false).length;

  // Calculate overdue items
  const today = new Date().toISOString().split('T')[0];
  const overdueItems = (reservations as any[]).filter((r: any) => {
    const returnDate = r.returnDate ? new Date(r.returnDate).toISOString().split('T')[0] : null;
    return returnDate && returnDate < today && (r.status === 'active' || r.status === 'approved');
  }).length;

  // Calculate recent activities
  const recentActivities = (activityLogs as any[])
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <InventoryHeader
        userName={userName}
        userRole={userRole}
        currentView="categories"
        onViewChange={() => onNavigateToInventory?.()}
        onLogout={onLogout}
        onNavigateToDashboard={onNavigateToDashboard}
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
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg px-6 md:px-8 py-6 md:py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-dashboard-title">
            {t('dashboard')}
          </h1>
          <p className="text-white text-opacity-90 mt-2">
            {t('overviewInventory')}
          </p>
        </div>

        {/* Key Metrics - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Equipment */}
          <Card className="hover-elevate" data-testid="card-equipment">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">{currentLanguage === 'ar' ? 'معدات' : 'Equipment'}</CardTitle>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-equipment">{equipmentCount}</div>
                <p className="text-xs text-muted-foreground">{currentLanguage === 'ar' ? 'إجمالي المعدات' : 'Total Equipment'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assets */}
          <Card className="hover-elevate" data-testid="card-assets">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">{currentLanguage === 'ar' ? 'أصول' : 'Assets'}</CardTitle>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-md">
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-assets">{assetsCount}</div>
                <p className="text-xs text-muted-foreground">{currentLanguage === 'ar' ? 'إجمالي الأصول' : 'Total Assets'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Available */}
          <Card className="hover-elevate" data-testid="card-available">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">{t('available')}</CardTitle>
                <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400" data-testid="text-available">{availableItems}</div>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0}% {currentLanguage === 'ar' ? 'متاح' : 'available'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* In Use */}
          <Card className="hover-elevate" data-testid="card-in-use">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">{t('inUse')}</CardTitle>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-in-use">{inUseItems}</div>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0 ? Math.round((inUseItems / totalItems) * 100) : 0}% {currentLanguage === 'ar' ? 'قيد الاستخدام' : 'in use'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Maintenance Alert */}
          <Card className="hover-elevate" data-testid="card-maintenance-status">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                {t('maintenance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">{currentLanguage === 'ar' ? 'تحت الصيانة' : 'Under Maintenance'}</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{maintenanceItems}</span>
                </div>
                <div className="w-full bg-red-100 dark:bg-red-950 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${totalItems > 0 ? (maintenanceItems / totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations Status */}
          <Card className="hover-elevate" data-testid="card-reservations-status">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
                {t('reservations')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{currentLanguage === 'ar' ? 'معلق' : 'Pending'}</span>
                  <span className="font-bold">{pendingReservations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{currentLanguage === 'ar' ? 'موافق عليه' : 'Approved'}</span>
                  <span className="font-bold">{approvedReservations}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="hover-elevate" data-testid="card-system-health">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'صحة النظام' : 'System Health'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{currentLanguage === 'ar' ? 'نسبة التوفر' : 'Availability'}</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-green-100 dark:bg-green-950 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${totalItems > 0 ? (availableItems / totalItems) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Requested Equipment Chart */}
        {mostRequestedData.length > 0 && (
          <Card className="hover-elevate" data-testid="card-most-requested">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'الأكثر طلباً' : 'Most Requested'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center gap-3 h-36 py-2">
                {mostRequestedData.map((item: any, index: number) => {
                  const maxRequests = Math.max(...mostRequestedData.map((d: any) => d.requests), 1);
                  const heightPercent = (item.requests / maxRequests) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-xs font-semibold text-foreground">{item.requests}</span>
                      <div className="w-8 bg-muted rounded-t-sm relative flex items-end justify-center"
                        style={{ height: '100px' }}>
                        <div
                          className="w-full bg-gradient-to-t from-[#667eea] to-[#764ba2] rounded-t-sm transition-all hover:opacity-80 cursor-pointer"
                          style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                          title={`${item.name}: ${item.requests} requests`}
                        ></div>
                      </div>
                      <span className="text-[11px] text-muted-foreground text-center leading-tight max-w-[50px]">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overdue Items & Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover-elevate">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                {currentLanguage === 'ar' ? 'متأخر' : 'Overdue'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-center p-6 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <p className="text-4xl font-bold text-red-600 dark:text-red-400">{overdueItems}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {currentLanguage === 'ar' ? 'عناصر متأخرة الإرجاع' : 'Items overdue for return'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="hover-elevate">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'أنشطة حديثة' : 'Recent Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {recentActivities.length > 0 ? (
                recentActivities.map((log: any, idx: number) => (
                  <div key={idx} className="text-xs pb-2 border-b border-muted last:border-b-0">
                    <p className="font-medium text-foreground truncate">{log.action}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {new Date(log.timestamp).toLocaleString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {currentLanguage === 'ar' ? 'لا توجد أنشطة' : 'No activities yet'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Footer */}
        <Card data-testid="card-summary-footer">
          <CardHeader>
            <CardTitle>{currentLanguage === 'ar' ? 'ملخص النظام' : 'System Summary'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1 p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'إجمالي العناصر' : 'Total Items'}</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <div className="space-y-1 p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'معدل الاستخدام' : 'Usage Rate'}</p>
                <p className="text-2xl font-bold">{totalItems > 0 ? Math.round((inUseItems / totalItems) * 100) : 0}%</p>
              </div>
              <div className="space-y-1 p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'الحجوزات النشطة' : 'Active Reservations'}</p>
                <p className="text-2xl font-bold">{reservedItems + approvedReservations}</p>
              </div>
              <div className="space-y-1 p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'التنبيهات' : 'Alerts'}</p>
                <p className="text-2xl font-bold">{maintenanceItems + pendingReservations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

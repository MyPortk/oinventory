import { useQuery } from "@tanstack/react-query";
import InventoryHeader from "@/components/InventoryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useTranslation, type Language } from "@/lib/translations";
import { Package, Clock, AlertCircle, CheckCircle2, TrendingUp, Activity, Zap, BarChart3, ArrowRight } from "lucide-react";
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

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => api.categories.getAll(),
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
    .slice(0, 10); // Top 10 most requested

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

  // Mapping from product_type to category name
  const productTypeToCategory: { [key: string]: string } = {
    'Camera': 'Cameras',
    'Lenses': 'Lens',
    'Backdrop Stands': 'Tripods & Stands',
    // Add more mappings as needed
  };

  // Calculate checkout count for each category
  const categoryCheckouts: { [key: string]: number } = {};
  
  // Count checkouts per category (only items that have been actually checked out)
  (reservations as any[]).forEach((reservation: any) => {
    if (reservation.checkoutDate) {
      const item = (items as any[]).find((i: any) => String(i.id) === String(reservation.itemId));
      if (item && item.productType) {
        const categoryName = productTypeToCategory[item.productType] || item.productType;
        categoryCheckouts[categoryName] = (categoryCheckouts[categoryName] || 0) + 1;
      }
    }
  });

  // Get top 4 categories by checkout count, sorted by popularity
  const topCategories = Object.entries(categoryCheckouts)
    .map(([categoryName, checkouts]) => ({
      name: categoryName,
      checkouts: checkouts,
      image: null
    }))
    .sort((a, b) => b.checkouts - a.checkouts)
    .slice(0, 4);

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
        <div className="text-center mb-10 p-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl text-white">
          <h1 className="text-4xl font-extrabold mb-4" data-testid="text-dashboard-title">
            {t('dashboard')}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto" data-testid="text-dashboard-subtitle">
            {t('overviewInventory')}
          </p>
        </div>

        {/* Key Metrics - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Items */}
          <Card className="hover-elevate" data-testid="card-total-items">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalItems')}</CardTitle>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground" data-testid="text-total-items">{totalItems}</div>
                <p className="text-xs text-muted-foreground">{currentLanguage === 'ar' ? 'إجمالي العناصر' : 'Total items'}</p>
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
                <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('inUse')}</CardTitle>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-md">
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-in-use">{inUseItems}</div>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0 ? Math.round((inUseItems / totalItems) * 100) : 0}% {currentLanguage === 'ar' ? 'قيد الاستخدام' : 'in use'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="hover-elevate" data-testid="card-pending-actions">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">{currentLanguage === 'ar' ? 'معلقة' : 'Pending'}</CardTitle>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-pending-actions">{pendingReservations}</div>
                <p className="text-xs text-muted-foreground">{pendingReservations} {currentLanguage === 'ar' ? 'حجز معلق' : 'pending'}</p>
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

        {/* Most Requested & Top Categories Grid - 50/50 Split */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Most Requested Bar Chart - Left (50%) */}
          <Card className="hover-elevate" data-testid="card-most-requested">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {currentLanguage === 'ar' ? 'الأكثر طلباً' : 'Most Requested Equipment'}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              {mostRequestedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={mostRequestedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.05} vertical={false} />
                    <XAxis dataKey="name" hide={true} />
                    <YAxis 
                      tick={{ fontSize: 11 }}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        padding: '8px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: any) => `${value} ${currentLanguage === 'ar' ? 'طلب' : 'requests'}`}
                      cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }}
                    />
                    <Bar
                      dataKey="requests"
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={20}
                      animationDuration={800}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" />
                        <stop offset="95%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">
                    {currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Categories - Right (50%) */}
          <Card className="hover-elevate">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm">
                {currentLanguage === 'ar' ? 'الفئات الرئيسية' : 'Top Categories'}
              </CardTitle>
              <button
                onClick={onNavigateToInventory}
                className="text-xs text-primary hover:underline"
                data-testid="button-view-all-categories"
              >
                {currentLanguage === 'ar' ? 'عرض الكل' : 'View All'}
              </button>
            </CardHeader>
            <CardContent className="w-full">
              {topCategories.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 w-full">
                  {topCategories.slice(0, 4).map((cat: any, index: number) => (
                    <div
                      key={index}
                      className="relative h-24 w-full rounded-md overflow-hidden cursor-pointer group"
                      onClick={onNavigateToInventory}
                      data-testid={`box-category-${cat.name}`}
                      style={{
                        backgroundImage: cat.image ? `url(${cat.image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all"></div>
                      
                      {/* Category name + arrow on hover */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-white mb-1" />
                        <p className="text-white text-xs font-semibold text-center leading-tight px-1">
                          {cat.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {currentLanguage === 'ar' ? 'لا توجد فئات' : 'No categories'}
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
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div className="space-y-1 p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'معدات' : 'Equipment'}</p>
                <p className="text-2xl font-bold">{equipmentCount}</p>
              </div>
              <div className="space-y-1 p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'أصول' : 'Assets'}</p>
                <p className="text-2xl font-bold">{assetsCount}</p>
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
              <div className="space-y-1 p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">{currentLanguage === 'ar' ? 'متأخر' : 'Overdue'}</p>
                <p className="text-2xl font-bold">{overdueItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

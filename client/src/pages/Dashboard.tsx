import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import InventoryHeader from "@/components/InventoryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { api, type Item } from "@/lib/api";
import { useTranslation, type Language } from "@/lib/translations";
import { Package, Clock, AlertCircle, CheckCircle2, TrendingUp, Activity } from "lucide-react";

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
  const approvedReservations = reservations.filter(r => r.status === 'approved').length;

  // Pie chart data
  const pieChartData = [
    { name: t('available'), value: availableItems, fill: '#22c55e' },
    { name: t('inUse'), value: inUseItems, fill: '#3b82f6' },
    { name: t('reserved'), value: reservedItems, fill: '#f59e0b' },
    { name: t('maintenance'), value: maintenanceItems, fill: '#ef4444' }
  ];

  // Category distribution
  const categoryDistribution = items.reduce((acc: any, item) => {
    const category = item.category || 'Other';
    const existing = acc.find((c: any) => c.name === category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, []).slice(0, 5);

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
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-dashboard-title">
            {t('dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {t('overviewInventory')}
          </p>
        </div>

        {/* Key Metrics - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Items */}
          <Card className="hover-elevate" data-testid="card-total-items">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t('totalItems')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground" data-testid="text-total-items">{totalItems}</div>
                <p className="text-xs text-muted-foreground">{currentLanguage === 'ar' ? 'إجمالي العناصر' : 'Total items in system'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Available */}
          <Card className="hover-elevate" data-testid="card-available">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('available')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="text-available">{availableItems}</div>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0}% {currentLanguage === 'ar' ? 'متاح' : 'available'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* In Use */}
          <Card className="hover-elevate" data-testid="card-in-use">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {t('inUse')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-in-use">{inUseItems}</div>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0 ? Math.round((inUseItems / totalItems) * 100) : 0}% {currentLanguage === 'ar' ? 'قيد الاستخدام' : 'in use'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="hover-elevate" data-testid="card-pending-actions">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'الإجراءات المعلقة' : 'Pending Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-pending-actions">{pendingReservations}</div>
                <p className="text-xs text-muted-foreground">{pendingReservations} {currentLanguage === 'ar' ? 'حجز معلق' : 'pending reservations'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Status Distribution */}
          <Card data-testid="card-status-pie">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-1 h-6 rounded bg-gradient-to-b from-[#667eea] to-[#764ba2]"></div>
                {currentLanguage === 'ar' ? 'توزيع حالة المعدات' : 'Equipment Status Distribution'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card data-testid="card-top-categories">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-1 h-6 rounded bg-gradient-to-b from-[#667eea] to-[#764ba2]"></div>
                {currentLanguage === 'ar' ? 'أكثر الفئات استخداماً' : 'Top Categories'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Maintenance Alert */}
          <Card data-testid="card-maintenance-status">
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
          <Card data-testid="card-reservations-status">
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
          <Card data-testid="card-system-health">
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

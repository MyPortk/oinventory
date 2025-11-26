import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import InventoryHeader from "@/components/InventoryHeader";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import ItemFormDialog from "@/components/ItemFormDialog";
import QRScannerDialog from "@/components/QRScannerDialog";
import ScanResultDialog from "@/components/ScanResultDialog";
import CategoryFormDialog from "@/components/CategoryFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Search, FolderPlus, Pencil, Trash2, LayoutGrid, TableIcon, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { api, type Item } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ReservationFormDialog from "@/components/ReservationFormDialog";
import type { Language } from "@/lib/translations";
import { useTranslation } from "@/lib/translations";
import { format } from "date-fns";

interface InventoryPageProps {
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

export default function Inventory({ userName, userRole, userId, onLogout, onNavigateToReservations, onNavigateToActivityLogs, onNavigateToQRCodes, onNavigateToMaintenance, onNavigateToReports, currentLanguage, onLanguageChange }: InventoryPageProps) {
  const { toast } = useToast();
  const t = useTranslation(currentLanguage);
  const [currentView, setCurrentView] = useState<'categories' | 'inventory'>('categories');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showScanResult, setShowScanResult] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [reservingItem, setReservingItem] = useState<Item | null>(null);
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | 'equipment' | 'assets'>('equipment');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [checkoutReservation, setCheckoutReservation] = useState<any>(null);
  const [checkoutCondition, setCheckoutCondition] = useState<'good' | 'damage'>('good');
  const [checkoutNotes, setCheckoutNotes] = useState("");
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnReservation, setReturnReservation] = useState<any>(null);
  const [returnCondition, setReturnCondition] = useState<'good' | 'damage'>('good');
  const [returnNotes, setReturnNotes] = useState("");
  const [showQuantityColumn, setShowQuantityColumn] = useState(true);
  const [showLocationColumn, setShowLocationColumn] = useState(true);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories', itemTypeFilter],
    queryFn: () => api.categories.getAll(itemTypeFilter === 'equipment')
  });

  const { data: items = [] } = useQuery({
    queryKey: ['/api/items', selectedCategory, itemTypeFilter],
    queryFn: () => {
      console.log('Fetching items for category:', selectedCategory, 'type:', itemTypeFilter);
      return api.items.getAll(selectedCategory || undefined, itemTypeFilter === 'all' ? undefined : itemTypeFilter === 'equipment');
    },
    enabled: currentView === 'inventory'
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ['/api/reservations'],
    queryFn: () => api.reservations.getAll(),
    enabled: currentView === 'inventory'
  });

  const createItemMutation = useMutation({
    mutationFn: (itemData: Partial<Item>) => api.items.create(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setShowItemForm(false);
      toast({ title: "Item added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add item", variant: "destructive" });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) =>
      api.items.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setShowItemForm(false);
      setEditingItem(null);
      toast({ title: "Item updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update item", variant: "destructive" });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => api.items.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "Item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete item", variant: "destructive" });
    }
  });

  const scanMutation = useMutation({
    mutationFn: (barcode: string) => api.scan.process(barcode),
    onSuccess: (data) => {
      setScanResult(data);
      setShowQRScanner(false);
      setShowScanResult(true);
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: () => {
      setScanResult({
        success: false,
        error: 'Failed to process scan'
      });
      setShowQRScanner(false);
      setShowScanResult(true);
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: (categoryData: any) => api.customCategories.create(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setShowCategoryForm(false);
      toast({ title: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create category", variant: "destructive" });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.customCategories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setShowCategoryForm(false);
      setEditingCategory(null);
      toast({ title: "Category updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update category", variant: "destructive" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => api.customCategories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete category", variant: "destructive" });
    }
  });

  const createReservationMutation = useMutation({
    mutationFn: (data: any) => api.reservations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setReservingItem(null);
      toast({ title: "Reservation created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create reservation", variant: "destructive" });
      setReservingItem(null);
    }
  });

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      onLogout();
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filter categories by both equipment type AND search query for complete separation
  const filteredCategories = categories.filter(cat => {
    // Only show categories matching the current equipment type filter
    if (itemTypeFilter === 'equipment' && cat.isCustom && !cat.isEquipment) return false;
    if (itemTypeFilter === 'assets' && cat.isCustom && cat.isEquipment) return false;
    
    // Then filter by search query
    return cat.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddItem = (itemData: any) => {
    createItemMutation.mutate(itemData);
  };

  const handleEditItem = (itemData: any) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: itemData });
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleScan = (barcode: string) => {
    scanMutation.mutate(barcode);
  };

  const handleAddCategory = (categoryData: any) => {
    // Add isEquipment flag based on current filter
    createCategoryMutation.mutate({
      ...categoryData,
      isEquipment: itemTypeFilter === 'equipment'
    });
  };

  const handleEditCategory = (categoryData: any) => {
    if (editingCategory?.id) {
      updateCategoryMutation.mutate({ 
        id: editingCategory.id, 
        data: {
          ...categoryData,
          isEquipment: itemTypeFilter === 'equipment'
        }
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleReserveItem = (item: Item) => {
    setReservingItem(item);
  };

  const handleSubmitReservation = (data: any) => {
    createReservationMutation.mutate(data);
  };

  const handleCheckout = (item: Item) => {
    if (confirm(`Check out ${item.productName}?`)) {
      updateItemMutation.mutate({
        id: item.id,
        data: { status: 'In Use' }
      });
    }
  };

  const handleCheckin = (item: Item) => {
    if (confirm(`Check in ${item.productName}?`)) {
      updateItemMutation.mutate({
        id: item.id,
        data: { status: 'Available' }
      });
    }
  };

  const getItemName = (itemId: string) => {
    return items.find(item => item.id === itemId)?.productName || itemId;
  };

  const getApprovedReservationForPickup = (itemId: string) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return reservations.find(res => {
      if (res.itemId !== itemId || res.status !== 'approved') return false;
      if (res.checkoutDate || res.itemConditionOnReceive) return false;
      
      const startDate = new Date(res.startDate);
      const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
      
      return todayStr === startDateStr;
    });
  };

  const handleReceiveEquipment = (item: Item) => {
    const reservation = getApprovedReservationForPickup(item.id);
    if (reservation) {
      setCheckoutReservation(reservation);
      setCheckoutCondition('good');
      setCheckoutNotes("");
      setShowCheckoutDialog(true);
    }
  };

  const handleConfirmCheckout = async () => {
    if (checkoutCondition === 'damage' && !checkoutNotes.trim()) {
      toast({ title: "Please describe the damage or missing items", variant: "destructive" });
      return;
    }

    try {
      await api.reservations.update(checkoutReservation.id, {
        checkoutDate: new Date().toISOString(),
        itemConditionOnReceive: checkoutCondition,
        damageNotes: checkoutNotes || undefined
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setShowCheckoutDialog(false);
      toast({ title: "Equipment receipt confirmed successfully" });
    } catch (error) {
      toast({ title: "Failed to confirm equipment receipt", variant: "destructive" });
    }
  };

  const getPendingReturnReservation = (itemId: string) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return reservations.find(res => {
      if (res.itemId !== itemId || res.status !== 'approved') return false;
      if (res.itemConditionOnReturn !== undefined) return false; // Already marked as returned
      
      // Check if return date has started (today >= returnDate)
      const returnDate = new Date(res.returnDate);
      const returnDateStr = `${returnDate.getFullYear()}-${String(returnDate.getMonth() + 1).padStart(2, '0')}-${String(returnDate.getDate()).padStart(2, '0')}`;
      
      return todayStr >= returnDateStr;
    });
  };

  const handleMarkReturned = (item: Item) => {
    const reservation = getPendingReturnReservation(item.id);
    if (reservation) {
      setReturnReservation(reservation);
      setReturnCondition('good');
      setReturnNotes("");
      setShowReturnDialog(true);
    }
  };

  const handleConfirmReturn = async () => {
    if (returnCondition === 'damage' && !returnNotes.trim()) {
      toast({ title: "Please describe the damage or missing items", variant: "destructive" });
      return;
    }

    try {
      await api.reservations.update(returnReservation.id, {
        status: 'completed',
        itemConditionOnReturn: returnCondition,
        returnNotes: returnNotes || undefined
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      setShowReturnDialog(false);
      toast({ title: "Equipment return confirmed successfully" });
    } catch (error) {
      toast({ title: "Failed to confirm equipment return", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <InventoryHeader
        userName={userName}
        userRole={userRole}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedCategory(null);
        }}
        onLogout={handleLogout}
        onNavigateToReservations={onNavigateToReservations}
        onNavigateToActivityLogs={onNavigateToActivityLogs}
        onNavigateToQRCodes={onNavigateToQRCodes}
        onNavigateToMaintenance={onNavigateToMaintenance}
        onNavigateToReports={() => (window as any).navigateToReports?.()}
        language={currentLanguage}
        onLanguageChange={onLanguageChange}
      />

      <main className="max-w-[1400px] mx-auto px-3 md:px-5 py-4 md:py-8">
        {currentView === 'categories' ? (
          <div>
            <div className="text-center mb-10 p-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl text-white">
              <h1 className="text-4xl font-extrabold mb-4" data-testid="text-hero-title">
                {itemTypeFilter === 'equipment' ? t('equipmentCategories') : 'Asset Categories'}
              </h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
                {t('browseInventory')}
              </p>
            </div>

            <div className="flex gap-2 justify-center mb-8">
              <Button
                onClick={() => setItemTypeFilter('equipment')}
                variant={itemTypeFilter === 'equipment' ? 'default' : 'outline'}
                data-testid="button-filter-equipment-categories"
                className={itemTypeFilter === 'equipment' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2]' : ''}
              >
                Equipment
              </Button>
              <Button
                onClick={() => setItemTypeFilter('assets')}
                variant={itemTypeFilter === 'assets' ? 'default' : 'outline'}
                data-testid="button-filter-assets-categories"
                className={itemTypeFilter === 'assets' ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2]' : ''}
              >
                Assets
              </Button>
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder={t('searchCategories')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base border-2"
                    data-testid="input-search-categories"
                  />
                </div>
                <Button
                  onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
                  variant="outline"
                  className="h-12"
                  data-testid="button-toggle-view"
                >
                  {viewMode === 'card' ? <TableIcon className="w-4 h-4 mr-2" /> : <LayoutGrid className="w-4 h-4 mr-2" />}
                  {viewMode === 'card' ? t('tableView') : t('cardView')}
                </Button>
                {userRole === 'admin' && (
                  <Button
                    onClick={() => {
                      setEditingCategory(null);
                      setShowCategoryForm(true);
                    }}
                    className="bg-gradient-to-r from-[#667eea] to-[#764ba2] h-12"
                    data-testid="button-add-category"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    {t('addCategory')}
                  </Button>
                )}
              </div>
            </div>

            {viewMode === 'card' ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-5">
                {filteredCategories.map((category) => (
                  <div key={category.name} className="relative group">
                    <CategoryCard
                      {...category}
                      onClick={() => {
                        console.log('Category clicked:', category.name, 'isEquipment:', category.isEquipment);
                        setSelectedCategory(category.name);
                        setCurrentView('inventory');
                        // Use isEquipment flag from API (works for both default and custom categories)
                        setItemTypeFilter(category.isEquipment ? 'equipment' : 'assets');
                      }}
                    />
                    {userRole === 'admin' && (
                      <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategory(category);
                            setShowCategoryForm(true);
                          }}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="bg-red-500/90 hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('name')}</TableHead>
                      <TableHead>{t('type')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead>{t('totalItems')}</TableHead>
                      <TableHead>{t('available')}</TableHead>
                      {userRole === 'admin' && <TableHead className="text-right">{t('actions')}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow 
                        key={category.name}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setCurrentView('inventory');
                        }}
                      >
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.subTypes.join(', ')}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.availableCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {category.availableCount > 0 ? t('available') : t('allInUse')}
                          </span>
                        </TableCell>
                        <TableCell>{category.totalCount}</TableCell>
                        <TableCell>{category.availableCount}</TableCell>
                        {userRole === 'admin' && (
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingCategory(category);
                                  setShowCategoryForm(true);
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(category.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-inventory-title">
                  {selectedCategory || t('allItems')}
                </h1>
                <p className="text-muted-foreground" data-testid="text-inventory-count">
                  {filteredItems.length} {t('items')}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
                  variant="outline"
                  data-testid="button-toggle-view-items"
                >
                  {viewMode === 'card' ? <TableIcon className="w-4 h-4 mr-2" /> : <LayoutGrid className="w-4 h-4 mr-2" />}
                  {viewMode === 'card' ? t('tableView') : t('cardView')}
                </Button>
                <Popover open={showColumnSettings} onOpenChange={setShowColumnSettings}>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      data-testid="button-column-settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">{t('columnVisibility')}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="qty-toggle" className="text-sm cursor-pointer">
                            {t('quantity')}
                          </label>
                          <Switch
                            id="qty-toggle"
                            checked={showQuantityColumn}
                            onCheckedChange={setShowQuantityColumn}
                            data-testid="switch-quantity-column"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="location-toggle" className="text-sm cursor-pointer">
                            {t('location')}
                          </label>
                          <Switch
                            id="location-toggle"
                            checked={showLocationColumn}
                            onCheckedChange={setShowLocationColumn}
                            data-testid="switch-location-column"
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {userRole === 'admin' && (
                  <>
                    {itemTypeFilter === 'equipment' && (
                      <Button
                        onClick={() => setShowQRScanner(true)}
                        variant="outline"
                        data-testid="button-scan-item"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        {t('scanItem')}
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setEditingItem(null);
                        setShowItemForm(true);
                      }}
                      className="bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                      data-testid="button-add-item"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('addItem')}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={t('searchItems')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                  data-testid="input-search-items"
                />
              </div>
            </div>

            {viewMode === 'card' ? (
              <div className="grid gap-4">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    barcode={item.barcode}
                    productName={item.productName}
                    productType={item.productType}
                    status={item.status}
                    location={item.location || undefined}
                    notes={item.notes || undefined}
                    quantity={(item as any)?.quantity || 1}
                    userRole={userRole}
                    isEquipment={item.isEquipment}
                    language={currentLanguage}
                    onEdit={userRole === 'admin' ? () => {
                      setEditingItem(item);
                      setShowItemForm(true);
                    } : undefined}
                    onDelete={userRole === 'admin' ? () => handleDeleteItem(item.id) : undefined}
                    onScan={item.isEquipment && userRole !== 'admin' ? () => {
                      setShowQRScanner(true);
                    } : undefined}
                    onReserve={item.isEquipment && userRole !== 'admin' ? () => handleReserveItem(item) : undefined}
                    onCheckout={item.isEquipment && userRole === 'admin' ? () => handleCheckout(item) : undefined}
                    onCheckin={item.isEquipment && userRole === 'admin' ? () => handleCheckin(item) : undefined}
                    onReceiveEquipment={item.isEquipment && userRole !== 'admin' && getApprovedReservationForPickup(item.id) ? () => handleReceiveEquipment(item) : undefined}
                    onMarkReturned={item.isEquipment && userRole === 'admin' && getPendingReturnReservation(item.id) ? () => handleMarkReturned(item) : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('barcode')}</TableHead>
                      <TableHead>{t('name')}</TableHead>
                      <TableHead>{t('type')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      {showQuantityColumn && <TableHead>{t('quantity')}</TableHead>}
                      {showLocationColumn && <TableHead>{t('location')}</TableHead>}
                      {userRole === 'admin' && <TableHead className="text-right">{t('actions')}</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.barcode}</TableCell>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.productType}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Available' ? 'bg-green-100 text-green-800' :
                            item.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'Reserved' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </TableCell>
                        {showQuantityColumn && <TableCell className="font-medium">{(item as any)?.quantity || 1}</TableCell>}
                        {showLocationColumn && <TableCell>{item.location || '-'}</TableCell>}
                        {userRole === 'admin' && (
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingItem(item);
                                  setShowItemForm(true);
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-items">
                  {t('noItemsFound')}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <ItemFormDialog
        open={showItemForm}
        onClose={() => {
          setShowItemForm(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        item={editingItem ? {
          id: editingItem.id,
          barcode: editingItem.barcode,
          productName: editingItem.productName,
          productType: editingItem.productType,
          status: editingItem.status,
          location: editingItem.location || undefined,
          notes: editingItem.notes || undefined,
          isEquipment: editingItem.isEquipment
        } : undefined}
        mode={editingItem ? 'edit' : 'add'}
        userRole={userRole}
        isEquipment={itemTypeFilter === 'equipment'}
        language={currentLanguage}
      />

      <QRScannerDialog
        open={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleScan}
      />

      <ScanResultDialog
        open={showScanResult}
        onClose={() => setShowScanResult(false)}
        result={scanResult}
        isLoading={scanMutation.isPending}
      />

      <CategoryFormDialog
        open={showCategoryForm}
        onClose={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
        }}
        onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        category={editingCategory}
        mode={editingCategory ? 'edit' : 'add'}
        isEquipment={itemTypeFilter === 'equipment'}
      />

      <ReservationFormDialog
        open={!!reservingItem}
        onClose={() => setReservingItem(null)}
        onSubmit={(data) => createReservationMutation.mutate({ ...data, userId })}
        items={reservingItem ? [reservingItem] : []}
      />

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('confirmEquipmentPickup')}</DialogTitle>
          </DialogHeader>
          {checkoutReservation && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2 border border-blue-200 dark:border-blue-800">
                <div><strong>{t('equipment')}:</strong> {getItemName(checkoutReservation.itemId)}</div>
                <div><strong>{t('pickupDateTime')}:</strong> {format(new Date(checkoutReservation.startDate), "PPP")} {checkoutReservation.startTime || "09:00"}</div>
                <div><strong>{t('returnDateTime')}:</strong> {format(new Date(checkoutReservation.returnDate), "PPP")} {checkoutReservation.returnTime || "17:00"}</div>
                <div><strong>{t('purpose')}:</strong> {checkoutReservation.purposeOfUse}</div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('equipmentCondition')}</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => setCheckoutCondition('good')}>
                    <input 
                      type="radio" 
                      name="condition" 
                      value="good"
                      checked={checkoutCondition === 'good'}
                      onChange={() => setCheckoutCondition('good')}
                      className="w-4 h-4"
                    />
                    <Label className="cursor-pointer font-medium flex items-center gap-2 mb-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {t('good')}
                    </Label>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => setCheckoutCondition('damage')}>
                    <input 
                      type="radio" 
                      name="condition" 
                      value="damage"
                      checked={checkoutCondition === 'damage'}
                      onChange={() => setCheckoutCondition('damage')}
                      className="w-4 h-4"
                    />
                    <Label className="cursor-pointer font-medium flex items-center gap-2 mb-0">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      {t('damageOrMissing')}
                    </Label>
                  </div>
                </div>
              </div>

              {checkoutCondition === 'damage' && (
                <div className="space-y-2 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <Label htmlFor="damage-notes" className="text-base font-semibold">{t('describeDamage')}</Label>
                  <Textarea
                    id="damage-notes"
                    value={checkoutNotes}
                    onChange={(e) => setCheckoutNotes(e.target.value)}
                    placeholder={t('describeDamageDetails')}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCheckoutDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button 
                  onClick={handleConfirmCheckout}
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                >
                  Confirm Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Equipment Return</DialogTitle>
          </DialogHeader>
          {returnReservation && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2 border border-blue-200 dark:border-blue-800">
                <div><strong>Equipment:</strong> {getItemName(returnReservation.itemId)}</div>
                <div><strong>Pickup Date & Time:</strong> {format(new Date(returnReservation.startDate), "PPP")} {returnReservation.startTime || "09:00"}</div>
                <div><strong>Return Date & Time:</strong> {format(new Date(returnReservation.returnDate), "PPP")} {returnReservation.returnTime || "17:00"}</div>
                <div><strong>Received Condition:</strong> {returnReservation.itemConditionOnReceive}</div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Equipment Condition on Return *</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => setReturnCondition('good')}>
                    <input 
                      type="radio" 
                      name="return-condition" 
                      value="good"
                      checked={returnCondition === 'good'}
                      onChange={() => setReturnCondition('good')}
                      className="w-4 h-4"
                    />
                    <Label className="cursor-pointer font-medium flex items-center gap-2 mb-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Good
                    </Label>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => setReturnCondition('damage')}>
                    <input 
                      type="radio" 
                      name="return-condition" 
                      value="damage"
                      checked={returnCondition === 'damage'}
                      onChange={() => setReturnCondition('damage')}
                      className="w-4 h-4"
                    />
                    <Label className="cursor-pointer font-medium flex items-center gap-2 mb-0">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Damage or Missing
                    </Label>
                  </div>
                </div>
              </div>

              {returnCondition === 'damage' && (
                <div className="space-y-2 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <Label htmlFor="return-damage-notes" className="text-base font-semibold">Please describe the damage or missing items *</Label>
                  <Textarea
                    id="return-damage-notes"
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder={t('describeDamageDetails')}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmReturn}
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                >
                  Confirm Return
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

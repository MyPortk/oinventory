export type Language = 'en' | 'ar';

export const translations = {
  en: {
    // Header
    categories: 'Categories',
    allItems: 'All Items',
    menu: 'Menu',
    navigation: 'Navigation',
    language: 'Language',
    inventory_manager: 'Inventory Manager',
    inventory: 'Inventory',
    reservations: 'Reservations',
    activityLog: 'Activity Log',
    qrCodes: 'QR Codes',
    maintenance: 'Maintenance',
    userManagement: 'User Management',
    logout: 'Logout',

    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications',

    // Login
    login: 'Login',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',

    // Items
    addItem: 'Add Item',
    editItem: 'Edit Item',
    deleteItem: 'Delete Item',
    productName: 'Product Name',
    barcode: 'Barcode',
    status: 'Status',
    category: 'Category',
    available: 'Available',
    inUse: 'In Use',
    reserved: 'Reserved',
    disabled: 'Disabled',

    // Reservations
    newReservation: 'New Reservation',
    startDate: 'Start Date',
    returnDate: 'Return Date',
    notes: 'Notes',
    approve: 'Approve',
    reject: 'Reject',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    search: 'Search',
    actions: 'Actions',
    loading: 'Loading...',
    error: 'Error',

    // User Management
    user_management: 'User Management',
    users: 'Users',
    add_user: 'Add User',
    activity_logs: 'Activity Logs',
    
    // Activity Logs
    activityLogHistory: 'Activity Log & History',
    completeAuditTrail: 'Complete audit trail of all inventory activities',
    editHistory: 'Edit History',
    itemEditHistory: 'Item Edit History',
    noEditHistory: 'No edit history found',
    loadingActivityLogs: 'Loading activity logs...',
    errorLoadingLogs: 'Error loading activity logs. Please try again.',
    noActivityLogs: 'No activity logs found.',
    by: 'by',
    
    // QR Codes
    qrCodeGeneration: 'QR Code Generation',
    generateAllQRCodes: 'Generate All QR Codes',
    downloadQRCode: 'Download QR Code',
    publicScanUrl: 'Public Scan URL',
    downloadAll: 'Download All',
    generatingQRCodes: 'Generating QR codes...',
    noItemsFound: 'No items found',
    scanQRCodes: 'Scan QR codes to check items in/out instantly',
    
    // Maintenance
    maintenanceManagement: 'Maintenance Management',
    itemsInMaintenance: 'Items in Maintenance',
    sendToMaintenance: 'Send to Maintenance',
    returnFromMaintenance: 'Return from Maintenance',
    itemsInMaintenanceSubtitle: 'Items currently undergoing maintenance or repair',
    itemsInMaintenanceCount: 'item(s) in maintenance',
    noItemsInMaintenance: 'No items in maintenance',
    allEquipmentWorking: 'All equipment is in working order',
    searchMaintenanceItems: 'Search maintenance items...',
    
    // Inventory Page
    equipmentCategories: 'Equipment Categories',
    browseInventory: 'Browse our complete inventory organized by equipment type',
    searchCategories: 'Search categories...',
    tableView: 'Table View',
    cardView: 'Card View',
    addCategory: 'Add Category',
    allInUse: 'All In Use',
    type: 'Type',
    totalItems: 'Total Items',
    items: 'items',
    scanItem: 'Scan Item',
    searchItems: 'Search items...',
    noItems: 'No items',
    location: 'Location',
    name: 'Name',
    
    // Reservations Page
    equipmentReservations: 'Equipment Reservations',
    requestManageReservations: 'Request and manage equipment reservations professionally',
    backToInventory: 'Back to Inventory',
    all_items: 'All Items',
    all: 'All',
    noReservationsFound: 'No reservations found',
    tryChangingFilter: 'Try changing the filter',
    createFirstReservation: 'Create your first reservation request',
    start: 'Start',
    return: 'Return',
    requested: 'Requested',
    responded: 'Responded',
    markReturned: 'Mark Returned',
    
    // User Management
    createManageUsers: 'Create and manage user accounts for your team',
    totalUsers: 'Total Users',
    addNewUser: 'Add New User',
    fullName: 'Full Name',
    email: 'Email',
    department: 'Department',
    role: 'Role',
    user: 'User',
    admin: 'Admin',
    creating: 'Creating...',
    createUser: 'Create User',
    areYouSureDeleteUser: 'Are you sure you want to delete user',
    
    // Maintenance Additional
    maintenance_title: 'Maintenance Management',
    maintenance_subtitle: 'Items currently undergoing maintenance or repair',
    item_count_maintenance: 'item(s) in maintenance',
    no_items_in_maintenance: 'No items in maintenance',
    all_equipment_in_order: 'All equipment is in working order',
    
    // Additional Common
    checkout: 'Check Out',
    checkin: 'Check In',
    reserve: 'Reserve',
    
    // Column Visibility
    columnVisibility: 'Column Visibility',
    quantity: 'Quantity',
    
    // Item Form
    quantity_label: 'Quantity *',
    location_label: 'Location',
    
    // Item Card
    quantity_display: 'Quantity:',
    notes_display: 'Notes:',
    
    // Reservations
    confirmEquipmentPickup: 'Confirm Equipment Pickup',
    describeDamage: 'Please describe the damage or missing items *',
    confirmReceipt: 'Confirm Receipt',
    
    // Maintenance
    areYouSureDeleteItem: 'Are you sure you want to delete this item?',
    
    // User Management Confirmations
    areYouSureDeleteUserMessage: 'Are you sure you want to delete user',
    loginFailedMessage: 'Login failed. Please try again.',
    tryAgain: 'Please try again',
    
    // Reports Page
    damageReports: 'Damage Reports',
    viewAllDamageReports: 'View all damage reports from equipment checkout and return inspections',
    viewDamageReportsReceived: 'View damage reports for equipment you received',
    
    // Checkout/Return Dialog
    equipment: 'Equipment',
    pickupDateTime: 'Pickup Date & Time',
    returnDateTime: 'Return Date & Time',
    purpose: 'Purpose',
    equipmentCondition: 'Equipment Condition *',
    good: 'Good',
    damageOrMissing: 'Damage or Missing',
    describeDamageDetails: 'Describe what damage or items are missing...',
    all_items: 'All Items',
    
    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications',
  },
  ar: {
    // Header
    categories: 'الفئات',
    allItems: 'جميع العناصر',
    menu: 'القائمة',
    navigation: 'التنقل',
    language: 'اللغة',
    inventory_manager: 'مدير المخزون',
    inventory: 'المخزون',
    reservations: 'الحجوزات',
    activityLog: 'سجل النشاط',
    qrCodes: 'رموز QR',
    maintenance: 'الصيانة',
    userManagement: 'إدارة المستخدمين',
    logout: 'تسجيل الخروج',

    // Notifications
    notifications: 'الإشعارات',
    markAllRead: 'وضع علامة مقروء على الكل',
    noNotifications: 'لا توجد إشعارات',

    // Login
    login: 'تسجيل الدخول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    signIn: 'دخول',

    // Items
    addItem: 'إضافة عنصر',
    editItem: 'تعديل العنصر',
    deleteItem: 'حذف العنصر',
    productName: 'اسم المنتج',
    barcode: 'الباركود',
    status: 'الحالة',
    category: 'الفئة',
    available: 'متاح',
    inUse: 'قيد الاستخدام',
    reserved: 'محجوز',
    disabled: 'معطل',

    // Reservations
    newReservation: 'حجز جديد',
    startDate: 'تاريخ البدء',
    returnDate: 'تاريخ الإرجاع',
    notes: 'ملاحظات',
    approve: 'موافقة',
    reject: 'رفض',
    pending: 'قيد الانتظار',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    completed: 'مكتمل',

    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    search: 'بحث',
    actions: 'الإجراءات',
    loading: 'جار التحميل...',
    error: 'خطأ',

    // User Management
    user_management: 'إدارة المستخدمين',
    users: 'المستخدمون',
    add_user: 'إضافة مستخدم',
    activity_logs: 'سجلات النشاط',
    
    // Activity Logs
    activityLogHistory: 'سجل النشاط والتاريخ',
    completeAuditTrail: 'سجل تدقيق كامل لجميع أنشطة المخزون',
    editHistory: 'سجل التعديلات',
    itemEditHistory: 'سجل تعديلات العنصر',
    noEditHistory: 'لم يتم العثور على سجل تعديلات',
    loadingActivityLogs: 'جار تحميل سجلات النشاط...',
    errorLoadingLogs: 'خطأ في تحميل سجلات النشاط. يرجى المحاولة مرة أخرى.',
    noActivityLogs: 'لم يتم العثور على سجلات نشاط.',
    by: 'بواسطة',
    
    // QR Codes
    qrCodeGeneration: 'إنشاء رمز الاستجابة السريعة',
    generateAllQRCodes: 'إنشاء جميع رموز QR',
    downloadQRCode: 'تحميل رمز QR',
    publicScanUrl: 'رابط المسح العام',
    downloadAll: 'تحميل الكل',
    generatingQRCodes: 'جار إنشاء رموز QR...',
    noItemsFound: 'لم يتم العثور على عناصر',
    scanQRCodes: 'امسح رموز QR لتسجيل دخول/خروج العناصر فوراً',
    
    // Maintenance
    maintenanceManagement: 'إدارة الصيانة',
    itemsInMaintenance: 'العناصر قيد الصيانة',
    sendToMaintenance: 'إرسال للصيانة',
    returnFromMaintenance: 'العودة من الصيانة',
    itemsInMaintenanceSubtitle: 'العناصر التي تخضع حالياً للصيانة أو الإصلاح',
    itemsInMaintenanceCount: 'عنصر قيد الصيانة',
    noItemsInMaintenance: 'لا توجد عناصر قيد الصيانة',
    allEquipmentWorking: 'جميع المعدات تعمل بشكل صحيح',
    searchMaintenanceItems: 'البحث عن عناصر الصيانة...',
    
    // Inventory Page
    equipmentCategories: 'فئات المعدات',
    browseInventory: 'تصفح المخزون الكامل منظم حسب نوع المعدات',
    searchCategories: 'البحث عن الفئات...',
    tableView: 'عرض الجدول',
    cardView: 'عرض البطاقات',
    addCategory: 'إضافة فئة',
    allInUse: 'الكل قيد الاستخدام',
    type: 'النوع',
    totalItems: 'إجمالي العناصر',
    items: 'عناصر',
    scanItem: 'مسح العنصر',
    searchItems: 'البحث عن العناصر...',
    noItems: 'لا توجد عناصر',
    location: 'الموقع',
    name: 'الاسم',
    
    // Reservations Page
    equipmentReservations: 'حجوزات المعدات',
    requestManageReservations: 'طلب وإدارة حجوزات المعدات بشكل احترافي',
    backToInventory: 'العودة إلى المخزون',
    all: 'الكل',
    noReservationsFound: 'لم يتم العثور على حجوزات',
    tryChangingFilter: 'حاول تغيير الفلتر',
    createFirstReservation: 'إنشاء طلب الحجز الأول',
    start: 'البدء',
    return: 'الإرجاع',
    requested: 'مطلوب',
    responded: 'تمت الإجابة',
    decline: 'رفض',
    markReturned: 'وضع علامة كمرجع',
    
    // User Management
    createManageUsers: 'إنشاء وإدارة حسابات المستخدمين لفريقك',
    totalUsers: 'إجمالي المستخدمين',
    addNewUser: 'إضافة مستخدم جديد',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    department: 'القسم',
    role: 'الدور',
    user: 'مستخدم',
    admin: 'مسؤول',
    creating: 'جار الإنشاء...',
    createUser: 'إنشاء مستخدم',
    areYouSureDeleteUser: 'هل أنت متأكد من حذف المستخدم',
    
    // Maintenance Additional
    maintenance_title: 'إدارة الصيانة',
    maintenance_subtitle: 'العناصر التي تخضع حالياً للصيانة أو الإصلاح',
    item_count_maintenance: 'عنصر قيد الصيانة',
    no_items_in_maintenance: 'لا توجد عناصر قيد الصيانة',
    all_equipment_in_order: 'جميع المعدات تعمل بشكل صحيح',
    
    // Additional Common
    checkout: 'تسجيل خروج',
    checkin: 'تسجيل دخول',
    reserve: 'حجز',
    
    // Column Visibility
    columnVisibility: 'رؤية الأعمدة',
    quantity: 'الكمية',
    
    // Item Form
    quantity_label: 'الكمية *',
    location_label: 'الموقع',
    
    // Item Card
    quantity_display: 'الكمية:',
    notes_display: 'ملاحظات:',
    
    // Reservations
    confirmEquipmentPickup: 'تأكيد استلام المعدات',
    describeDamage: 'يرجى وصف الضرر أو العناصر المفقودة *',
    confirmReceipt: 'تأكيد الاستلام',
    
    // Maintenance
    areYouSureDeleteItem: 'هل أنت متأكد من حذف هذا العنصر؟',
    
    // User Management Confirmations
    areYouSureDeleteUserMessage: 'هل أنت متأكد من حذف المستخدم',
    loginFailedMessage: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    tryAgain: 'يرجى المحاولة مرة أخرى',
    
    // Reports Page
    damageReports: 'تقارير الأضرار',
    viewAllDamageReports: 'عرض جميع تقارير الأضرار من عمليات فحص الاستلام والإرجاع للمعدات',
    viewDamageReportsReceived: 'عرض تقارير الأضرار للمعدات التي استلمتها',
    
    // Checkout/Return Dialog
    equipment: 'المعدات',
    pickupDateTime: 'تاريخ وقت الالتقاط',
    returnDateTime: 'تاريخ وقت الإرجاع',
    purpose: 'الغرض',
    equipmentCondition: 'حالة المعدات *',
    good: 'جيدة',
    damageOrMissing: 'تالفة أو مفقودة',
    describeDamageDetails: 'صف الضرر أو العناصر المفقودة...',
    all_items: 'جميع العناصر',
    
    // Notifications
    notifications: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    noNotifications: 'لا توجد إشعارات',
  }
};

export const useTranslation = (language?: Language) => {
  const lang = language || 'en';
  return (key: keyof typeof translations.en): string => {
    return translations[lang]?.[key] || key;
  };
};
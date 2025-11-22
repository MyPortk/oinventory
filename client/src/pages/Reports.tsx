import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ArrowLeft, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/api";
import InventoryHeader from "@/components/InventoryHeader";
import type { Language } from "@/lib/translations";
import { useTranslation } from "@/lib/translations";

interface ReportsPageProps {
  userName: string;
  userRole: string;
  userId: string;
  onLogout: () => void;
  onNavigateToInventory?: () => void;
  onNavigateToReservations?: () => void;
  onNavigateToActivityLogs?: () => void;
  onNavigateToQRCodes?: () => void;
  onNavigateToMaintenance?: () => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function Reports({
  userName,
  userRole,
  userId,
  onLogout,
  onNavigateToInventory,
  onNavigateToReservations,
  onNavigateToActivityLogs,
  onNavigateToQRCodes,
  onNavigateToMaintenance,
  language = 'en',
  onLanguageChange
}: ReportsPageProps) {
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: reports = [] } = useQuery({
    queryKey: ['/api/damage-reports'],
    queryFn: () => api.damageReports.getAll(),
  });

  const { data: items = [] } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => api.items.getAll(),
  });

  const filteredReports = reports
    .filter(report => {
      const itemName = items.find(i => i.id === report.itemId)?.productName?.toLowerCase() || "";
      const matchesSearch = searchQuery === "" || itemName.includes(searchQuery.toLowerCase());
      const matchesRole = userRole === 'admin' || report.reportedBy === userId;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-background">
      <InventoryHeader
        userName={userName}
        userRole={userRole}
        currentView="inventory"
        onViewChange={() => onNavigateToInventory?.()}
        onLogout={onLogout}
        onNavigateToActivityLogs={onNavigateToActivityLogs}
        onNavigateToQRCodes={onNavigateToQRCodes}
        onNavigateToMaintenance={onNavigateToMaintenance}
        hideViewToggle={true}
        language={language}
        onLanguageChange={onLanguageChange}
      />

      <main className="max-w-[1400px] mx-auto px-3 md:px-5 py-4 md:py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onNavigateToInventory}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Button>
        </div>

        <div className="text-center mb-10 p-6 md:p-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 md:mb-4">Damage Reports</h1>
          <p className="text-sm md:text-lg opacity-90 max-w-2xl mx-auto">
            {userRole === 'admin' 
              ? 'View all damage reports from equipment checkout and return inspections'
              : 'View damage reports for equipment you received'}
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by equipment name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">No reports found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="p-4 md:p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold">
                      {items.find(i => i.id === report.itemId)?.productName || 'Unknown Item'}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm md:text-base">
                    <div><strong>Report Type:</strong> {report.reportType === 'user-damage' ? 'User Reported (Pickup)' : 'Admin Reported (Return)'}</div>
                    <div><strong>Reported Date:</strong> {format(new Date(report.createdAt), "PPP p")}</div>
                    <div className="bg-muted p-3 rounded">
                      <strong className="block mb-1">Description:</strong> 
                      <p className="text-sm md:text-base">{report.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ArrowLeft, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    itemId: "",
    reportType: "user-damage",
    severity: "medium",
    description: ""
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['/api/damage-reports'],
    queryFn: () => api.damageReports.getAll(),
  });

  const { data: items = [] } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => api.items.getAll(),
  });

  const createReportMutation = useMutation({
    mutationFn: (data: any) => api.damageReports.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/damage-reports'] });
      setShowReportForm(false);
      setFormData({ itemId: "", reportType: "user-damage", severity: "medium", description: "" });
      toast({ title: "Report submitted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to submit report", variant: "destructive" });
    }
  });

  const resolveReportMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      api.damageReports.resolve(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/damage-reports'] });
      toast({ title: "Report resolved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to resolve report", variant: "destructive" });
    }
  });

  const filteredReports = reports
    .filter(report => {
      const itemName = items.find(i => i.id === report.itemId)?.productName?.toLowerCase() || "";
      const matchesSearch = searchQuery === "" || itemName.includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || report.status === filterStatus;
      const matchesRole = userRole === 'admin' || report.reportedBy === userId;
      return matchesSearch && matchesFilter && matchesRole;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || !formData.description.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createReportMutation.mutate({
      itemId: formData.itemId,
      reportedBy: userId,
      reportType: formData.reportType,
      severity: formData.severity,
      description: formData.description
    });
  };

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

      <main className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onNavigateToInventory}
            className="gap-2"
            data-testid="button-back-to-inventory"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Button>
        </div>

        <div className="text-center mb-10 p-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl text-white">
          <h1 className="text-4xl font-extrabold mb-4">Damage Reports</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {userRole === 'admin' 
              ? 'View and manage all damage reports from users and admin inspections'
              : 'Report equipment damage and track report status'}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-3">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "open" ? "default" : "outline"}
              onClick={() => setFilterStatus("open")}
            >
              Open
            </Button>
            <Button
              variant={filterStatus === "in-progress" ? "default" : "outline"}
              onClick={() => setFilterStatus("in-progress")}
            >
              In Progress
            </Button>
            <Button
              variant={filterStatus === "resolved" ? "default" : "outline"}
              onClick={() => setFilterStatus("resolved")}
            >
              Resolved
            </Button>
          </div>
          <Button
            onClick={() => setShowReportForm(true)}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
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
              <Card key={report.id} className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl font-bold">
                        {items.find(i => i.id === report.itemId)?.productName || 'Unknown Item'}
                      </h3>
                      <Badge className={`${getSeverityColor(report.severity)} text-white`}>
                        {report.severity.toUpperCase()}
                      </Badge>
                      <Badge className={`${getStatusColor(report.status)} text-white`}>
                        {report.status === 'open' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {report.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                        {report.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {report.reportType === 'user-damage' ? 'User Reported Damage' : 'Admin Inspection'}</div>
                      <div><strong>Reported:</strong> {format(new Date(report.createdAt), "PPP p")}</div>
                      <div className="bg-muted p-3 rounded"><strong>Description:</strong> {report.description}</div>
                      {report.resolutionNotes && (
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded"><strong>Resolution:</strong> {report.resolutionNotes}</div>
                      )}
                    </div>
                  </div>
                  {userRole === 'admin' && report.status !== 'resolved' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={() => {
                        const notes = prompt("Enter resolution notes:");
                        if (notes) {
                          resolveReportMutation.mutate({ id: report.id, notes });
                        }
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Damage Report</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item">Equipment *</Label>
              <Select value={formData.itemId} onValueChange={(value) => setFormData({ ...formData, itemId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment..." />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the damage..."
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowReportForm(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                disabled={createReportMutation.isPending}
              >
                Submit Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

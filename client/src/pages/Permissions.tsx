import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { InventoryHeader } from "@/components/InventoryHeader";
import { useToast } from "@/hooks/use-toast";
import type { Language } from "@/lib/translations";
import { useTranslation } from "@/lib/translations";
import { ArrowLeft, Shield } from "lucide-react";

interface PermissionsProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
  onNavigateToInventory?: () => void;
  onNavigateToReservations?: () => void;
  onNavigateToActivityLogs?: () => void;
  onNavigateToQRCodes?: () => void;
  onNavigateToMaintenance?: () => void;
  onNavigateToReports?: () => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

export default function Permissions({
  userName,
  userRole,
  onLogout,
  onNavigateToInventory,
  onNavigateToReservations,
  onNavigateToActivityLogs,
  onNavigateToQRCodes,
  onNavigateToMaintenance,
  onNavigateToReports,
  language = 'en',
  onLanguageChange
}: PermissionsProps) {
  const { toast } = useToast();
  const t = useTranslation(language);

  const { data: permissions = {} } = useQuery({
    queryKey: ['/api/permissions'],
    queryFn: async () => {
      const response = await fetch('/api/permissions', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch permissions');
      return response.json();
    }
  });

  const updatePermissionMutation = useMutation({
    mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
      const response = await fetch(`/api/permissions/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update permission');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permissions'] });
      toast({ title: "Permission updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update permission", variant: "destructive" });
    }
  });

  const handleToggle = (key: string, currentValue: boolean) => {
    updatePermissionMutation.mutate({ key, enabled: !currentValue });
  };

  return (
    <div className="min-h-screen bg-background">
      <InventoryHeader
        userName={userName}
        userRole={userRole}
        currentView="inventory"
        onViewChange={() => onNavigateToInventory?.()}
        onLogout={onLogout}
        onNavigateToReservations={onNavigateToReservations}
        onNavigateToActivityLogs={onNavigateToActivityLogs}
        onNavigateToQRCodes={onNavigateToQRCodes}
        onNavigateToMaintenance={onNavigateToMaintenance}
        onNavigateToReports={onNavigateToReports}
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
            {t('backToInventory')}
          </Button>
        </div>

        <div className="text-center mb-10 p-10 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-2xl text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-4xl font-extrabold" data-testid="text-permissions-title">
              System Permissions
            </h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto" data-testid="text-permissions-subtitle">
            Configure system-wide settings and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assets Toggle */}
          <Card className="hover-elevate" data-testid="card-permission-assets">
            <CardHeader>
              <CardTitle className="text-lg">{t('assets') || 'Assets'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('enableAssetsDescription') || 'When enabled, users will see the Assets option on the inventory category page alongside Equipment. When disabled, only Equipment will be visible.'}
              </p>
              <div className="flex items-center gap-4">
                <Switch
                  checked={permissions.show_assets !== false}
                  onCheckedChange={() =>
                    handleToggle('show_assets', permissions.show_assets !== false)
                  }
                  disabled={updatePermissionMutation.isPending}
                  data-testid="switch-permission-assets"
                />
                <span className="text-sm font-medium">
                  {permissions.show_assets !== false ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Language Toggle */}
          <Card className="hover-elevate" data-testid="card-permission-language">
            <CardHeader>
              <CardTitle className="text-lg">{t('language') || 'Language'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('enableLanguageDescription') || 'When enabled, all users can toggle between English and Arabic languages. When disabled, the language toggle will be hidden for all accounts.'}
              </p>
              <div className="flex items-center gap-4">
                <Switch
                  checked={permissions.show_language_toggle !== false}
                  onCheckedChange={() =>
                    handleToggle('show_language_toggle', permissions.show_language_toggle !== false)
                  }
                  disabled={updatePermissionMutation.isPending}
                  data-testid="switch-permission-language"
                />
                <span className="text-sm font-medium">
                  {permissions.show_language_toggle !== false ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

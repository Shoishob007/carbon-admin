import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Zap, Globe, Bell, Lock, User2, InfoIcon, Loader2 } from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import ApiKeyManager from "./ApiKeyManager";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

interface IntegrationSettings {
  apiRateLimit: number;
  webhookUrl: string;
  thirdPartyIntegrations: boolean;
  dataExport: boolean;
  realTimeUpdates: boolean;
}

export default function SuperAdminSettings() {
  const {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    regenerateApiKey,
  } = useUserStore();
  const { accessToken } = useAuthStore();
  const [profileSettings, setProfileSettings] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
    const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const changePassword = useAuthStore((state) => state.changePassword);

  const [integrationSettings, setIntegrationSettings] =
    useState<IntegrationSettings>({
      apiRateLimit: 1000,
      webhookUrl: "",
      thirdPartyIntegrations: true,
      dataExport: true,
      realTimeUpdates: true,
    });

  //  user profile on mount
  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken, fetchUserProfile]);

  // updating form when data loads
  useEffect(() => {
    if (user) {
      setProfileSettings((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (profileSettings.newPassword !== profileSettings.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      await updateUserProfile(accessToken, {
        name: profileSettings.name,
        email: profileSettings.email,
        ...(profileSettings.newPassword && {
          password: profileSettings.newPassword,
          current_password: profileSettings.currentPassword,
        }),
      });
      toast.success("Profile updated successfully");
      setProfileSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  const handleSaveIntegration = () => {
    console.log("Saving integration settings:", integrationSettings);
    toast.success("Integration settings saved");
  };

  
    const handlePasswordChange = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handlePasswordChange triggered");
  
        if (!user) {
          toast.error("User not found");
          return;
        }
  
        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
  
        if (newPassword.length < 5) {
          toast.error("Password must be at least 5 characters");
          return;
        }
  
        try {
          setIsPasswordLoading(true);
          await changePassword(user.id, newPassword, accessToken);
          toast.success("Password changed successfully");
          setNewPassword("");
          setConfirmPassword("");
        } catch (error) {
          console.error("Password change error:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to change password"
          );
        } finally {
          setIsPasswordLoading(false);
        }
      },
      [newPassword, confirmPassword, user, accessToken, changePassword]
    );
  

  if (loading && !user) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Super Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure super administrator profile and system integrations
        </p>
      </div>

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your super administrator profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileSettings.name}
                  onChange={(e) =>
                    setProfileSettings({
                      ...profileSettings,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) =>
                    setProfileSettings({
                      ...profileSettings,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="mt-4"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile Settings"}
            </Button>
          </CardContent>
        </Card>

              <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={5}
                />
              </div>
            </div>
            <div className="flex justify-start">
              <Button type="submit" disabled={isPasswordLoading}>
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

        <NotificationSettings />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              System Integrations
            </CardTitle>
            <CardDescription>
              Configure API and third-party integration settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <ApiKeyManager
                apiKey={user.profile.emission_lab_key}
                accessToken={accessToken}
                onRegenerate={regenerateApiKey}
                loading={loading}
              />
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                External Integrations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="thirdPartyIntegrations" className="flex-1">
                    Enable third-party integrations
                  </Label>
                  <Input
                    id="thirdPartyIntegrations"
                    type="checkbox"
                    checked={integrationSettings.thirdPartyIntegrations}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        thirdPartyIntegrations: e.target.checked,
                      })
                    }
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="dataExport" className="flex-1">
                    Allow data export
                  </Label>
                  <Input
                    id="dataExport"
                    type="checkbox"
                    checked={integrationSettings.dataExport}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        dataExport: e.target.checked,
                      })
                    }
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="realTimeUpdates" className="flex-1">
                    Enable real-time updates
                  </Label>
                  <Input
                    id="realTimeUpdates"
                    type="checkbox"
                    checked={integrationSettings.realTimeUpdates}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        realTimeUpdates: e.target.checked,
                      })
                    }
                    className="h-5 w-5"
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleSaveIntegration} className="mt-4">
              Save Integration Settings
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

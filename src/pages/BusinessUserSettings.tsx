import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/auth";
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
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  Link,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import ApiKeyManager from "./ApiKeyManager";
import { toast } from "sonner";

export default function BusinessUserSettings() {
  const {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    updateBusinessProfile,
    regenerateApiKey,
  } = useUserStore();

  const { accessToken } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    company_name: "",
    company_registration_number: "",
    industry: "",
    company_size: "",
    website: "",
    company_address: "",
    phone_number: "",
    contact_person: "",
    annual_revenue: "",
  });
  const requiredFields = [
    "company_name",
    "company_registration_number",
    "industry",
    "company_size",
    "website",
    "company_address",
    "phone_number",
    "contact_person",
    "annual_revenue",
  ];

  // intializing form
  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken, fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        company_name: user.business_profile?.company_name || "",
        company_registration_number:
          user.business_profile?.company_registration_number || "",
        industry: user.business_profile?.industry || "",
        company_size: user.business_profile?.company_size || "",
        website: user.business_profile?.website || "",
        company_address: user.business_profile?.company_address || "",
        phone_number: user.business_profile?.phone_number || "",
        contact_person: user.business_profile?.contact_person || "",
        annual_revenue: user.business_profile?.annual_revenue || "",
      });
    }
  }, [user]);

  const isFormValid = requiredFields.every(
    (field) => formData[field as keyof typeof formData]?.trim().length > 0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]?.trim()
    );

    if (emptyFields.length > 0) {
      const readableFields = emptyFields.map((field) =>
        field.replace(/_/g, " ")
      );
      toast.error(`Please fill in: ${readableFields.join(", ")}`);
      return;
    }

    try {
      await Promise.all([
        updateUserProfile(accessToken, {
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
        }),
        updateBusinessProfile(accessToken, {
          company_name: formData.company_name,
          company_registration_number: formData.company_registration_number,
          industry: formData.industry,
          company_size: formData.company_size,
          website: formData.website,
          company_address: formData.company_address,
          phone_number: formData.phone_number,
          contact_person: formData.contact_person,
          annual_revenue: formData.annual_revenue,
        }),
      ]);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        <AlertCircle className="inline mr-2" />
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
        No user data available
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Business Profile</h1>
        <p className="text-muted-foreground">
          Update your personal and business information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>All fields are required</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Business Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_registration_number">
                    Registration Number *
                  </Label>
                  <Input
                    id="company_registration_number"
                    value={formData.company_registration_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_size">Company Size *</Label>
                  <Input
                    id="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Website *
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="company_address"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Company Address *
                </Label>
                <Input
                  id="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone_number"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person *</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_revenue">Annual Revenue *</Label>
                <Input
                  id="annual_revenue"
                  value={formData.annual_revenue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" disabled={loading || !isFormValid}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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
            API Settings
          </CardTitle>
          <CardDescription>
            Manage your API key and integration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ApiKeyManager
            apiKey={user.profile?.emission_lab_key}
            accessToken={accessToken}
            onRegenerate={() => regenerateApiKey(accessToken)}
            loading={loading}
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">API Usage</h3>
                <p className="text-sm text-muted-foreground">
                  {user.profile?.api_requests_made || 0} /{" "}
                  {user.profile?.total_requests_limit || "Unlimited"} requests
                  used
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

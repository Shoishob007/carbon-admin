import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Zap, Globe, Briefcase, Phone, MapPin, Link } from 'lucide-react';
import NotificationSettings from './NotificationSettings';
import ApiKeyManager from './ApiKeyManager';
import { toast } from 'sonner';

export default function BusinessUserSettings() {
  const { user, loading, error, fetchUserProfile, updateUserProfile, updateBusinessProfile, regenerateApiKey } = useUserStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken, fetchUserProfile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile(accessToken, {
        name: user.name,
        email: user.email,
        bio: user.bio
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleBusinessProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.business_profile) return;

    try {
      await updateBusinessProfile(accessToken, {
        company_name: user.business_profile.company_name,
        company_registration_number: user.business_profile.company_registration_number,
        industry: user.business_profile.industry,
        company_size: user.business_profile.company_size,
        website: user.business_profile.website,
        company_address: user.business_profile.company_address,
        phone_number: user.business_profile.phone_number,
        contact_person: user.business_profile.contact_person,
        annual_revenue: user.business_profile.annual_revenue
      });
      toast.success('Business profile updated successfully');
    } catch (error) {
      toast.error('Failed to update business profile');
    }
  };

  if (loading && !user) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground">
          Manage your business account and integration settings
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
              Update your personal profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => useUserStore.setState((state) => {
                      if (state.user) state.user.name = e.target.value;
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => useUserStore.setState((state) => {
                      if (state.user) state.user.email = e.target.value;
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={user.bio || ''}
                  onChange={(e) => useUserStore.setState((state) => {
                    if (state.user) state.user.bio = e.target.value;
                  })}
                />
              </div>
              
              <Button type="submit" disabled={loading}>
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {user.business_profile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Business Information
              </CardTitle>
              <CardDescription>
                Update your company details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessProfileSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={user.business_profile.company_name}
                      onChange={(e) => useUserStore.setState((state) => {
                        if (state.user?.business_profile) {
                          state.user.business_profile.company_name = e.target.value;
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={user.business_profile.company_registration_number}
                      onChange={(e) => useUserStore.setState((state) => {
                        if (state.user?.business_profile) {
                          state.user.business_profile.company_registration_number = e.target.value;
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={user.business_profile.industry}
                      onChange={(e) => useUserStore.setState((state) => {
                        if (state.user?.business_profile) {
                          state.user.business_profile.industry = e.target.value;
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Input
                      id="companySize"
                      value={user.business_profile.company_size}
                      onChange={(e) => useUserStore.setState((state) => {
                        if (state.user?.business_profile) {
                          state.user.business_profile.company_size = e.target.value;
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={user.business_profile.website}
                    onChange={(e) => useUserStore.setState((state) => {
                      if (state.user?.business_profile) {
                        state.user.business_profile.website = e.target.value;
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Company Address
                  </Label>
                  <Input
                    id="address"
                    value={user.business_profile.company_address}
                    onChange={(e) => useUserStore.setState((state) => {
                      if (state.user?.business_profile) {
                        state.user.business_profile.company_address = e.target.value;
                      }
                    })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={user.business_profile.phone_number}
                      onChange={(e) => useUserStore.setState((state) => {
                        if (state.user?.business_profile) {
                          state.user.business_profile.phone_number = e.target.value;
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={user.business_profile.contact_person}
                      onChange={(e) => useUserStore.setState((state) => {
                        if (state.user?.business_profile) {
                          state.user.business_profile.contact_person = e.target.value;
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Input
                    id="annualRevenue"
                    value={user.business_profile.annual_revenue}
                    onChange={(e) => useUserStore.setState((state) => {
                      if (state.user?.business_profile) {
                        state.user.business_profile.annual_revenue = e.target.value;
                      }
                    })}
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  Save Business Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

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
              apiKey={user.profile.emission_lab_key}
              accessToken={accessToken}
  onRegenerate={() => regenerateApiKey(accessToken)}
              loading={loading}
            />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">API Usage</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.profile.api_requests_made} / {user.profile.total_requests_limit || 'Unlimited'} requests used
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
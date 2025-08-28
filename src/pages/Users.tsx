/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/auth";
import { useUsersStore } from "@/store/users";
import { mockUsers } from "@/data/mockUsers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users as UsersIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Building,
  Calendar,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  ChevronLeft,
  Loader2,
  Coins,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useOffsetStore } from "@/store/offsetStore";

interface User {
  id: number;
  email: string;
  name: string;
  role: "individual" | "business" | "super_admin";
  is_active: boolean;
  profile_image: string | null;
  bio?: string;
  profile: {
    api_requests_made: number;
    total_requests_limit: number;
  };
  business_profile: {
    company_name: string;
    industry?: string;
    company_size?: string;
    website?: string;
    company_address?: string;
    phone_number?: string;
    contact_person?: string;
    annual_revenue?: string;
    company_registration_number?: string;
  } | null;
  subscription: {
    plan_name: string;
    status: string;
  } | null;
}

export default function Users() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { apiUsers, loading, fetchUsers, createUser, updateUser, updateUserStatus } = useUsersStore();
  console.log("Api users :: ", apiUsers)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Users");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "individual" as "individual" | "business",
    password: "",
  });

  // Edit user states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState({
    name: "",
    bio: "",
    business_profile: {
      company_name: "",
      industry: "",
      company_size: "",
      website: "",
      company_address: "",
      phone_number: "",
      contact_person: "",
      annual_revenue: "",
      company_registration_number: "",
    }
  });
    const {
    offsetHistory,
    fetchOffsetHistory,
  } = useOffsetStore();

  // Delete user states
  const [isDeletingUser, setIsDeletingUser] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers(accessToken);
  }, [accessToken, fetchUsers]);

    // all history on mount
  useEffect(() => {
    if (accessToken) {
      fetchOffsetHistory(accessToken);
    }
  }, [accessToken, fetchOffsetHistory]);

  // filtered users
  const filteredApiUsers = useMemo(() => {
    return apiUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.business_profile?.company_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false);

      const matchesRole =
        selectedRole === "All Users" || user.role === selectedRole;

      const matchesStatus =
        selectedStatus === "All Status" ||
        (selectedStatus === "active" && user.is_active) ||
        (selectedStatus === "inactive" && !user.is_active);

      const matchesPlan =
        selectedPlan === "All Plans" ||
        (selectedPlan === "No Plan" && !user.subscription) ||
        user.subscription?.plan_name === selectedPlan;

      return matchesSearch && matchesRole && matchesStatus && matchesPlan;
    });
  }, [apiUsers, searchTerm, selectedRole, selectedStatus, selectedPlan]);

  // pagination
  const totalPages = Math.ceil(filteredApiUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredApiUsers.slice(startIndex, endIndex);

  const availablePlans = [
    "All Plans",
    "No Plan",
    ...Array.from(
      new Set(
        apiUsers
          .map((user) => user.subscription?.plan_name)
          .filter(Boolean) as string[]
      )
    ),
  ];

  const totalEmissions = mockUsers.reduce(
    (sum, user) => sum + user.emissions,
    0
  );
  const totalTonnes = offsetHistory.reduce(
    (sum, offset) => sum + offset.carbon_emission_metric_tons,
    0
  );
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      setCreateError("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    
    try {
      await createUser(accessToken, newUser);
      setIsDialogOpen(false);
      setNewUser({
        email: "",
        name: "",
        role: "individual",
        password: "",
      });
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name || "",
      bio: user.bio || "",
      business_profile: {
        company_name: user.business_profile?.company_name || "",
        industry: user.business_profile?.industry || "",
        company_size: user.business_profile?.company_size || "",
        website: user.business_profile?.website || "",
        company_address: user.business_profile?.company_address || "",
        phone_number: user.business_profile?.phone_number || "",
        contact_person: user.business_profile?.contact_person || "",
        annual_revenue: user.business_profile?.annual_revenue || "",
        company_registration_number: user.business_profile?.company_registration_number || "",
      }
    });
    setIsEditDialogOpen(true);
    setEditError(null);
  };

  // Check if edit form has changes
  const hasEditChanges = useMemo(() => {
    if (!selectedUser) return false;
    
    const hasNameChange = editUser.name !== (selectedUser.name || "");
    const hasBioChange = editUser.bio !== (selectedUser.bio || "");
    
    const hasBusinessProfileChanges = selectedUser.role === "business" && (
      editUser.business_profile.company_name !== (selectedUser.business_profile?.company_name || "") ||
      editUser.business_profile.industry !== (selectedUser.business_profile?.industry || "") ||
      editUser.business_profile.company_size !== (selectedUser.business_profile?.company_size || "") ||
      editUser.business_profile.website !== (selectedUser.business_profile?.website || "") ||
      editUser.business_profile.company_address !== (selectedUser.business_profile?.company_address || "") ||
      editUser.business_profile.phone_number !== (selectedUser.business_profile?.phone_number || "") ||
      editUser.business_profile.contact_person !== (selectedUser.business_profile?.contact_person || "") ||
      editUser.business_profile.annual_revenue !== (selectedUser.business_profile?.annual_revenue || "") ||
      editUser.business_profile.company_registration_number !== (selectedUser.business_profile?.company_registration_number || "")
    );

    return hasNameChange || hasBioChange || hasBusinessProfileChanges;
  }, [selectedUser, editUser]);

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsEditing(true);
    setEditError(null);
    
    try {
      const updateData: any = {
        name: editUser.name,
        bio: editUser.bio,
      };

      // Only include business_profile if user is a business
      if (selectedUser.role === "business") {
        updateData.business_profile = editUser.business_profile;
      }

      await updateUser(accessToken, selectedUser.id, updateData);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setEditError(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsEditing(false);
    }
  };

  // Handle delete user (update status)
  const handleDeleteUser = async (userId: number) => {
    setIsDeletingUser(userId);
    
    try {
      await updateUserStatus(accessToken, userId, false);
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    } finally {
      setIsDeletingUser(null);
    }
  };

  // page reset
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // page changes
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // items per page
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // generating page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, permissions, and carbon tracking data
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-carbon-gradient hover:bg-carbon-600">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-background border">
          <DialogHeader className="text-center">
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account for carbon tracking platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "individual" | "business") =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Set a password"
              />
            </div>

            {createError && (
              <div className="text-red-500 text-sm">{createError}</div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isCreating}
              className="bg-carbon-gradient hover:bg-carbon-600"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-background border max-h-[80vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and business profile
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={editUser.bio}
                onChange={(e) =>
                  setEditUser({ ...editUser, bio: e.target.value })
                }
                placeholder="User bio..."
                rows={3}
              />
            </div>

            {selectedUser?.role === "business" && (
              <>
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold mb-4">Business Profile</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-company-name">Company Name</Label>
                      <Input
                        id="edit-company-name"
                        value={editUser.business_profile.company_name}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              company_name: e.target.value
                            }
                          })
                        }
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-industry">Industry</Label>
                      <Input
                        id="edit-industry"
                        value={editUser.business_profile.industry}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              industry: e.target.value
                            }
                          })
                        }
                        placeholder="Technology"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-company-size">Company Size</Label>
                      <Input
                        id="edit-company-size"
                        value={editUser.business_profile.company_size}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              company_size: e.target.value
                            }
                          })
                        }
                        placeholder="small, large"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-website">Website</Label>
                      <Input
                        id="edit-website"
                        value={editUser.business_profile.website}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              website: e.target.value
                            }
                          })
                        }
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        value={editUser.business_profile.phone_number}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              phone_number: e.target.value
                            }
                          })
                        }
                        placeholder="+1-555-0123"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-contact-person">Contact Person</Label>
                      <Input
                        id="edit-contact-person"
                        value={editUser.business_profile.contact_person}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              contact_person: e.target.value
                            }
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-annual-revenue">Annual Revenue</Label>
                      <Input
                        id="edit-annual-revenue"
                        value={editUser.business_profile.annual_revenue}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              annual_revenue: e.target.value
                            }
                          })
                        }
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-registration-number">Registration Number</Label>
                      <Input
                        id="edit-registration-number"
                        value={editUser.business_profile.company_registration_number}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            business_profile: {
                              ...editUser.business_profile,
                              company_registration_number: e.target.value
                            }
                          })
                        }
                        placeholder="REG123456"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="edit-company-address">Company Address</Label>
                    <Textarea
                      id="edit-company-address"
                      value={editUser.business_profile.company_address}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
                          business_profile: {
                            ...editUser.business_profile,
                            company_address: e.target.value
                          }
                        })
                      }
                      placeholder="123 Business Street, City, State, ZIP"
                      rows={2}
                    />
                  </div>
                </div>
              </>
            )}

            {editError && (
              <div className="text-red-500 text-sm">{editError}</div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isEditing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={isEditing || !hasEditChanges}
              className="bg-carbon-gradient hover:bg-carbon-600"
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {apiUsers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {apiUsers.filter((user) => user.is_active).length} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Emissions
            </CardTitle>
            <Building className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {totalEmissions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Tons CO₂ tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Offset By Users</CardTitle>
            <Coins className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {totalTonnes.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">CO₂ tonnes offset</p>
          </CardContent>
        </Card>
      </div>

      {/* User Table - using apiUsers */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>
            Manage user accounts and track their carbon impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users, companies, or emails..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetPagination();
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedRole}
              onValueChange={(value) => {
                setSelectedRole(value);
                resetPagination();
              }}
            >
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-popover border">
                {["All Users", "individual", "business"].map(
                  (role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value);
                resetPagination();
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border">
                {["All Status", "active", "inactive"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedPlan}
              onValueChange={(value) => {
                setSelectedPlan(value);
                resetPagination();
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent className="bg-popover border">
                {availablePlans.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {currentUsers.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, filteredApiUsers.length)} of{" "}
              {filteredApiUsers.length} results
              {filteredApiUsers.length !== apiUsers.length && (
                <span className="ml-1">
                  (filtered from {apiUsers.length} total users)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>API Usage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {loading
                        ? "Loading users..."
                        : "No users found matching your criteria"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.profile_image || ""}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-carbon-gradient text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {user.business_profile?.company_name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "business"
                            ? "border-blue-500 text-blue-700"
                            : "border-gray-500 text-gray-700"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {user.subscription?.plan_name || "No plan"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_active ? "default" : "secondary"}
                        className={
                          user.is_active ? "bg-green-500" : "bg-gray-500"
                        }
                      >
                        {user.is_active ? (
                          <UserCheck className="mr-1 h-3 w-3" />
                        ) : (
                          <UserX className="mr-1 h-3 w-3" />
                        )}
                        {user.is_active ? "active" : "inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-carbon-600">
                          {user.profile.api_requests_made}
                        </span>{" "}
                        /{" "}
                        <span className="text-carbon-400">
                          {user.profile.total_requests_limit}
                        </span>{" "}
                        requests
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeletingUser === user.id || !user.is_active}
                            >
                              {isDeletingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate {user.name}? This will set their status to inactive and they won't be able to access the platform.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

export default function Users() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { apiUsers, loading, fetchUsers } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Users");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");


 useEffect(() => {
    fetchUsers(accessToken);
  }, [accessToken, fetchUsers]);

 const filteredApiUsers = apiUsers.filter((user) => {
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
      (user.subscription?.plan_name === selectedPlan);

    return matchesSearch && matchesRole && matchesStatus && matchesPlan;
  });

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

  const totalEmissions = mockUsers.reduce((sum, user) => sum + user.emissions, 0);
  const totalOffsets = mockUsers.reduce((sum, user) => sum + user.offsets, 0);


   return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Add User button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, permissions, and carbon tracking data
          </p>
        </div>
        <Dialog>
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
            {/* Add User Form */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards - using mockUsers */}
      <div className="grid gap-6 md:grid-cols-4">
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offsets</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {totalOffsets.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Tons CO₂ offset</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Impact</CardTitle>
            <Calendar className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {(totalOffsets - totalEmissions).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Tons CO₂ net positive
            </p>
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
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users, companies, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-popover border">
                {["All Users", "super_admin", "individual", "business"].map(
                  (role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
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
              {filteredApiUsers.map((user) => (
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
                        user.role === "super_admin"
                          ? "border-red-500 text-red-700"
                          : user.role === "business"
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
                        onClick={() => console.log("Edit user:", user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("Delete user:", user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
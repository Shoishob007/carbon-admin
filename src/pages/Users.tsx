import { useState } from "react";
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
  Phone,
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

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@ecotech.com",
    company: "EcoTech Solutions",
    role: "admin",
    plan: "Carbon-Reduction",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-15",
    emissions: 1240,
    offsets: 1350,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@greenmanuf.com",
    company: "Green Manufacturing Co",
    role: "user",
    plan: "Sustainability",
    status: "active",
    joinDate: "2024-02-20",
    lastLogin: "2024-06-14",
    emissions: 2890,
    offsets: 3100,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@sustainablelogistics.com",
    company: "Sustainable Logistics Ltd",
    role: "user",
    plan: "Starter Green",
    status: "inactive",
    joinDate: "2024-03-10",
    lastLogin: "2024-05-28",
    emissions: 450,
    offsets: 425,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "David Park",
    email: "d.park@cleanenergy.com",
    company: "CleanEnergy Corp",
    role: "user",
    plan: "Carbon-Reduction",
    status: "pending",
    joinDate: "2024-06-01",
    lastLogin: "2024-06-16",
    emissions: 890,
    offsets: 920,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa@renewabletech.com",
    company: "Renewable Tech Inc",
    role: "user",
    plan: "Starter Green",
    status: "active",
    joinDate: "2024-04-12",
    lastLogin: "2024-06-15",
    emissions: 320,
    offsets: 340,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
  },
];

const roles = ["All Users", "admin", "user"];
const statuses = ["All Status", "active", "inactive", "pending"];
const plans = ["All Plans", "Starter Green", "Carbon-Reduction", "Sustainability"];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Users");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    company: "",
    role: "user",
    plan: "Starter Green",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All Users" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "All Status" || user.status === selectedStatus;
    const matchesPlan = selectedPlan === "All Plans" || user.plan === selectedPlan;

    return matchesSearch && matchesRole && matchesStatus && matchesPlan;
  });

  const handleCreateUser = () => {
    console.log("Creating new user:", newUser);
  };

  const handleEditUser = (id: number) => {
    console.log("Editing user:", id);
  };

  const handleDeleteUser = (id: number) => {
    console.log("Deleting user:", id);
  };

  const totalEmissions = users.reduce((sum, user) => sum + user.emissions, 0);
  const totalOffsets = users.reduce((sum, user) => sum + user.offsets, 0);

  return (
    <div className="space-y-6 animate-fade-in">
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
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="col-span-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="john@company.com"
                    className="col-span-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={newUser.company}
                    onChange={(e) =>
                      setNewUser({ ...newUser, company: e.target.value })
                    }
                    placeholder="Company Name"
                    className="col-span-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-right">
                    Plan
                  </Label>
                  <Select
                    value={newUser.plan}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, plan: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border">
                      {plans
                        .filter((plan) => plan !== "All")
                        .map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button onClick={handleCreateUser} className="bg-carbon-gradient">
              Create User
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {users.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {users.filter((user) => user.status === "active").length} active
              users
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

      {/* Filters and Search */}
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
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border">
                {statuses.map((status) => (
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
                {plans.map((plan) => (
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
                <TableHead>Carbon Impact</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
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
                      {user.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.role === "admin"
                          ? "border-red-500 text-red-700"
                          : user.role === "manager"
                          ? "border-blue-500 text-blue-700"
                          : "border-gray-500 text-gray-700"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                      className={
                        user.status === "active"
                          ? "bg-green-500"
                          : user.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }
                    >
                      {user.status === "active" ? (
                        <UserCheck className="mr-1 h-3 w-3" />
                      ) : user.status === "inactive" ? (
                        <UserX className="mr-1 h-3 w-3" />
                      ) : (
                        <Calendar className="mr-1 h-3 w-3" />
                      )}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-orange-600">
                          {user.emissions}t
                        </span>{" "}
                        emitted
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600">{user.offsets}t</span>{" "}
                        offset
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
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
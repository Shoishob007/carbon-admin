import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/auth";
import {
  Globe,
  DollarSign,
  BarChart3,
  UsersIcon,
  CreditCard,
  MessageSquare,
  Clock,
  User,
  Mail,
  Loader2,
  Receipt,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useUsersStore } from "@/store/users";
import { useSubscriptionStore } from "@/store/subscriptions";
import { useBillingStore } from "@/store/billingStore";
import { useQueriesStore } from "@/store/queriesStore";
import { useEffect, useMemo } from "react";

const emissionData = [
  { month: "Jan", emissions: 2400, offset: 2000 },
  { month: "Feb", emissions: 2100, offset: 2200 },
  { month: "Mar", emissions: 2300, offset: 2400 },
  { month: "Apr", emissions: 2000, offset: 2300 },
  { month: "May", emissions: 1900, offset: 2500 },
  { month: "Jun", emissions: 1800, offset: 2600 },
];

const offsetProjects = [
  { name: "Forest Restoration", value: 35, color: "#166534" },
  { name: "Renewable Energy", value: 30, color: "#15803d" },
  { name: "Ocean Conservation", value: 20, color: "#16a34a" },
  { name: "Waste Management", value: 15, color: "#22c55e" },
];

export default function AdminDashboard() {
  const { apiUsers, fetchUsers, loading } = useUsersStore();
  const { user, fetchUserProfile } = useUserStore();
  const { accessToken } = useAuthStore();
  const role = useAuthStore((state) => state.user?.role);

  const { activePlans, inactivePlans, fetchPlans } = useSubscriptionStore();
  const {
    payments,
    loading: paymentsLoading,
    fetchPayments,
  } = useBillingStore();
  const { queries } = useQueriesStore();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (accessToken && !user) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken, user, fetchUserProfile]);

  // dynamic user growth data for all 12 months
  const userGrowthData = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // data for all 12 months
    const allMonthsData = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = (currentMonth - 11 + i + 12) % 12;
      const monthName = `${monthNames[monthIndex]} ${currentYear
        .toString()
        .slice(-2)}`;
      return {
        month: monthName,
        users: 0,
        date: new Date(currentYear, monthIndex, 1),
      };
    });

    // users per month
    apiUsers.forEach((user) => {
      if (user.profile?.created_at) {
        const date = new Date(user.profile.created_at);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // count if it's current year
        if (year === currentYear) {
          const monthData = allMonthsData.find(
            (m) =>
              m.date.getMonth() === monthIndex && m.date.getFullYear() === year
          );
          if (monthData) {
            monthData.users += 1;
          }
        }
      }
    });

    // cumulative users
    let cumulative = 0;
    return allMonthsData.map((item) => {
      cumulative += item.users;
      return {
        month: item.month,
        users: cumulative,
      };
    });
  }, [apiUsers]);

  useEffect(() => {
    if (accessToken && !user) {
      fetchUsers(accessToken);
    }
    if (accessToken) {
      fetchPlans(accessToken);
    }
  }, [accessToken, user, fetchUsers, fetchPlans, role]);

  useEffect(() => {
    if (accessToken && role) {
      fetchPayments(accessToken, role);
    }
  }, [accessToken, fetchPayments, role]);

  const allPlans = [...activePlans, ...inactivePlans];
  const activeSubscribers = allPlans.reduce(
    (sum, plan) => sum + (plan.is_active ? 1 : 0),
    0
  );
  const totalRevenue = payments
    .filter((p) => p.payment_status === "completed")
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  const totalPayments = payments.length;
  const pendingPayments = payments.filter(
    (p) => p.payment_status === "pending"
  ).length;

  // Helper function to truncate text
  const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading && !user) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-carbon-gradient rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-64 bg-white/20 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-96 bg-white/10 rounded animate-pulse"></div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formattedDate}</div>
              <div className="text-carbon-100">Your Dashboard</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-carbon-gradient rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-carbon-100">
              Track and manage carbon emissions and offset projects across your
              platform
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formattedDate}</div>
            <div className="text-carbon-100">Your Emission Lab Dashboard</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <CreditCard className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {allPlans.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {activePlans.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
            <Receipt className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {totalPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{(totalRevenue * 0.1).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-carbon-600" />
              Emissions vs Offsets
            </CardTitle>
            <CardDescription>
              Monthly carbon emissions and offset comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="emissions"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Emissions (tons)"
                />
                <Line
                  type="monotone"
                  dataKey="offset"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Offsets (tons)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-carbon-600" />
              Offset Projects Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of carbon offset project types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={offsetProjects}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {offsetProjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>
            Cumulative user registration trends for all 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
          {userGrowthData.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No user registration data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Queries - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-carbon-600" />
            Recent Queries
          </CardTitle>
          <CardDescription>
            Latest customer inquiries and support requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {queries.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No queries available
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {queries.slice(0, 6).map((query) => (
                <div key={query.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {query.user_name}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusBadgeColor(query.status)}`}
                    >
                      {query.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {query.user_email}
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-muted-foreground mb-1">
                      Interests:
                    </p>
                    <p className="text-xs">
                      {truncateText(query.interests, 100)}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-muted-foreground mb-1">
                      Message:
                    </p>
                    <p className="text-xs">
                      {truncateText(query.message, 150)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(query.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/userStore";
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  Server,
  CreditCard,
  Calendar,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useBillingStore } from "@/store/billingStore";
import { useMySubscriptionStore } from "@/store/mySubscription";
import { useEffect } from "react";

const emissionData = [
  { month: "Jan", emissions: 2400, offset: 2000 },
  { month: "Feb", emissions: 2100, offset: 2200 },
  { month: "Mar", emissions: 2300, offset: 2400 },
  { month: "Apr", emissions: 2000, offset: 2300 },
  { month: "May", emissions: 1900, offset: 2500 },
  { month: "Jun", emissions: 1800, offset: 2600 },
];

const apiGrowthData = [
  { month: "Jan", calls: 1200 },
  { month: "Feb", calls: 1900 },
  { month: "Mar", calls: 2300 },
  { month: "Apr", calls: 2800 },
  { month: "May", calls: 3200 },
  { month: "Jun", calls: 4100 },
];

export default function BusinessDashboard() {
  const { user, loading, fetchUserProfile } = useUserStore();
  const { accessToken } = useAuthStore();
  const { payments } = useBillingStore();
  const { subscription } = useMySubscriptionStore();

  // Fetch user profile on component mount
  useEffect(() => {
    if (accessToken && !user) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken, user, fetchUserProfile]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // recent payment
  const lastPayment = payments.length > 0 ? payments[0] : null;

  // next billing date
  const getNextBillingDate = (paymentDate: string, frequency: string) => {
    if (!paymentDate) return null;

    const date = new Date(paymentDate);
    if (frequency === "monthly") {
      date.setMonth(date.getMonth() + 1);
    } else if (frequency === "yearly") {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date;
  };

  // Formatted date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No payments yet";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const nextBillingDate = lastPayment
    ? getNextBillingDate(
        lastPayment.payment_date,
        lastPayment.subscription_details?.payment_frequency
      )
    : null;

  // Show loading state while fetching user
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
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="text-carbon-100">
              Track your API usage, carbon calculations, and offset activities
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formattedDate}</div>
            <div className="text-carbon-100">Your Dashboard</div>
          </div>
        </div>
      </div>

      {/* Key Metrics - COLORED TEXT VERSION */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls Made
            </CardTitle>
            <Server className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {user?.profile?.api_requests_made || 0}
            </div>
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              {user?.profile?.total_requests_limit ? (
                <>
                  <Progress
                    value={
                      user?.profile?.api_requests_made &&
                      user?.profile?.total_requests_limit
                        ? (Number(user.profile.api_requests_made) /
                            Number(user.profile.total_requests_limit)) *
                          100
                        : 0
                    }
                    className="h-2 mr-2 w-full"
                  />
                  {user?.profile?.api_requests_made &&
                  user?.profile?.total_requests_limit
                    ? Math.round(
                        (Number(user.profile.api_requests_made) /
                          Number(user.profile.total_requests_limit)) *
                          100
                      )
                    : 0}
                  % of your limit
                </>
              ) : (
                "Unlimited plan"
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total CO₂ Calculated
            </CardTitle>
            <Leaf className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3.2 tons</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Offsets Done
            </CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2.5 tons</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +10% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {lastPayment ? "Last Payment" : "Payment Information"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            {lastPayment ? (
              <>
                <div className="text-2xl font-bold text-purple-600">
                  ${lastPayment.amount}
                </div>
                {nextBillingDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Possible next billing:{" "}
                    {formatDate(nextBillingDate.toISOString())}
                  </div>
                )}
              </>
            ) : (
              <div className="text-2xl font-bold text-purple-600">
                No payments yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original Emissions vs Offset Graph */}
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

        {/* API Growth Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              API Call Growth
            </CardTitle>
            <CardDescription>Monthly API request trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apiGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities (Original Style) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest API calls and carbon calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Flight Emission Calculation",
                type: "calculation",
                details: "DUB → JFK (3,250 kg CO₂)",
                time: "2 hours ago",
              },
              {
                action: "API Limit Warning",
                type: "alert",
                details: "85% of monthly limit used",
                time: "4 hours ago",
              },
              {
                action: "Carbon Offset Purchase",
                type: "offset",
                details: "Verified rainforest project (1.2 tons)",
                time: "1 day ago",
              },
              {
                action: "New API Key Generated",
                type: "security",
                details: "For mobile application",
                time: "2 days ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "calculation"
                        ? "bg-orange-500"
                        : activity.type === "alert"
                        ? "bg-yellow-500"
                        : activity.type === "offset"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.details}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

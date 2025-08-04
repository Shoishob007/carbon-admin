import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/auth";
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  Factory,
  Globe,
  Users,
  DollarSign,
  BarChart3,
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

const userGrowth = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 150 },
  { month: "Mar", users: 180 },
  { month: "Apr", users: 220 },
  { month: "May", users: 280 },
  { month: "Jun", users: 340 },
];

export default function AdminDashboard() {
  console.log("this is super admin dash")
  const user = useAuthStore((s) => s.user);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total CO₂ Offset
            </CardTitle>
            <Leaf className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">2,847 tons</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-carbon-500" />
              +12.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Emissions
            </CardTitle>
            <Factory className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">1,234 tons</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
              -8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">3,456</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +23.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">$45,231</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +19.7% from last month
            </div>
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

      {/* Recent Activity & User Growth */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used admin actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Carbon Credit Verification</span>
                <Badge variant="secondary">Pending: 12</Badge>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Monthly Reports</span>
                <Badge variant="secondary">Due: 3</Badge>
              </div>
              <Progress value={60} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>User Approvals</span>
                <Badge variant="secondary">Queue: 8</Badge>
              </div>
              <Progress value={40} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>System Health</span>
                <Badge className="bg-carbon-500">Good</Badge>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest actions and updates across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Carbon Credit Purchase",
                user: "EcoTech Corporation",
                amount: "500 credits",
                time: "2 hours ago",
                type: "purchase",
              },
              {
                action: "Emission Report Submitted",
                user: "GreenManufacturing Ltd",
                amount: "Monthly Report",
                time: "4 hours ago",
                type: "report",
              },
              {
                action: "New User Registration",
                user: "Sustainable Solutions Inc",
                amount: "Premium Plan",
                time: "6 hours ago",
                type: "registration",
              },
              {
                action: "Offset Project Completed",
                user: "Amazon Rainforest Initiative",
                amount: "1,200 tons CO₂",
                time: "1 day ago",
                type: "offset",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "purchase"
                        ? "bg-blue-500"
                        : activity.type === "report"
                        ? "bg-yellow-500"
                        : activity.type === "registration"
                        ? "bg-green-500"
                        : "bg-carbon-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.user}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{activity.amount}</div>
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

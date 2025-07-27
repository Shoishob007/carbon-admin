import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  User,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Dummy queries/inquiries data (read-only)
const initialQueries = [
  {
    id: 1,
    subject: "How do I upgrade my subscription?",
    message: "I want to move from Starter Green to Professional Carbon. What's the process?",
    status: "open",
    user: "EcoTech Solutions",
    email: "contact@ecotech.com",
    createdAt: "2025-07-22 09:45",
    respondedBy: "",
    respondedAt: "",
  },
  {
    id: 2,
    subject: "Unable to generate emissions report",
    message: "The reporting tool gives an error when I try to export to PDF.",
    status: "responded",
    user: "Green Manufacturing Co",
    email: "admin@greenmfg.co",
    createdAt: "2025-07-21 13:22",
    respondedBy: "Support Team",
    respondedAt: "2025-07-21 14:10",
  },
  {
    id: 3,
    subject: "Feature request: SSO integration",
    message: "Does your platform support single sign-on? If not, do you plan to add it?",
    status: "open",
    user: "Sustainable Logistics Ltd",
    email: "it@sustlogistics.com",
    createdAt: "2025-07-20 18:05",
    respondedBy: "",
    respondedAt: "",
  },
  {
    id: 4,
    subject: "Payment failed",
    message: "Our last payment failed, but the card is valid. Can you help?",
    status: "responded",
    user: "CleanEnergy Corp",
    email: "finance@cleanenergy.com",
    createdAt: "2025-07-18 11:40",
    respondedBy: "Billing Dept",
    respondedAt: "2025-07-18 12:04",
  },
  {
    id: 5,
    subject: "General inquiry",
    message: "Do you offer discounts for non-profits?",
    status: "open",
    user: "EcoHelp Nonprofit",
    email: "info@ecohelp.org",
    createdAt: "2025-07-16 14:18",
    respondedBy: "",
    respondedAt: "",
  },
  {
    id: 6,
    subject: "How to delete my account?",
    message: "Please guide me through the process to permanently delete my account.",
    status: "open",
    user: "ClimateAction Group",
    email: "hello@climateaction.com",
    createdAt: "2025-07-15 10:01",
    respondedBy: "",
    respondedAt: "",
  },
  {
    id: 7,
    subject: "API limit exceeded",
    message: "I received a message about reaching the API call limit. What should I do?",
    status: "responded",
    user: "CarbonTrackers",
    email: "dev@carbontrackers.com",
    createdAt: "2025-07-14 08:05",
    respondedBy: "Support Team",
    respondedAt: "2025-07-14 08:30",
  },
  {
    id: 8,
    subject: "Export data",
    message: "Is there a way to export all emissions data as CSV?",
    status: "open",
    user: "EcoWorld Ltd",
    email: "info@ecoworld.com",
    createdAt: "2025-07-13 15:20",
    respondedBy: "",
    respondedAt: "",
  },
  {
    id: 9,
    subject: "Login issue",
    message: "I'm unable to log in with my email and password.",
    status: "responded",
    user: "Renewable Partners",
    email: "admin@renewablepartners.com",
    createdAt: "2025-07-12 11:44",
    respondedBy: "Support Team",
    respondedAt: "2025-07-12 12:00",
  },
  {
    id: 10,
    subject: "Refund policy",
    message: "What is your refund policy for annual subscriptions?",
    status: "open",
    user: "GreenFuture Org",
    email: "contact@greenfuture.org",
    createdAt: "2025-07-10 09:35",
    respondedBy: "",
    respondedAt: "",
  },
  {
    id: 11,
    subject: "Account locked",
    message: "My account has been locked due to suspicious activity. How can I unlock it?",
    status: "responded",
    user: "SafeEarth",
    email: "support@safeearth.com",
    createdAt: "2025-07-09 14:17",
    respondedBy: "Security Team",
    respondedAt: "2025-07-09 15:00",
  },
  {
    id: 12,
    subject: "Change billing method",
    message: "I'd like to switch my payment method from card to wire transfer.",
    status: "open",
    user: "UrbanGreeners",
    email: "billing@urbangreeners.com",
    createdAt: "2025-07-08 17:45",
    respondedBy: "",
    respondedAt: "",
  },
];

const PAGE_SIZE = 5;
const FILTERS = [
  { label: "All", value: "all" },
  { label: "Responded", value: "responded" },
  { label: "Not Responded", value: "open" },
];

export default function Queries() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "responded" | "open">("all");

  // Apply search and filter
  let filteredQueries = initialQueries.filter(
    (q) =>
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.user.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.message.toLowerCase().includes(search.toLowerCase())
  );

  if (filter !== "all") {
    filteredQueries = filteredQueries.filter((q) => q.status === filter);
  }

  const totalPages = Math.max(1, Math.ceil(filteredQueries.length / PAGE_SIZE));
  const paginatedQueries = filteredQueries.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Smart pagination: show range, disable buttons at ends
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, filteredQueries.length);

  // Reset to page 1 when search/filter changes
  function handleFilterChange(val: "all" | "responded" | "open") {
    setFilter(val);
    setPage(1);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Queries & Inquiries</h1>
          <p className="text-muted-foreground mt-2">
            View a history of user-submitted queries, contact messages, and support requests
          </p>
        </div>
        <Input
          placeholder="Search by subject, user, or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <HelpCircle className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">{initialQueries.length}</div>
            <p className="text-xs text-muted-foreground">
              {initialQueries.filter(q => q.status === "open").length} open, {initialQueries.filter(q => q.status === "responded").length} responded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Organizations</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {Array.from(new Set(initialQueries.map((q) => q.user))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredQueries.length} shown
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Query</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-semibold">
              {initialQueries[0].createdAt}
            </div>
            <p className="text-xs text-muted-foreground">
              from {initialQueries[0].user}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queries List */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle>Query History</CardTitle>
            <CardDescription>
              View all user inquiries, support tickets, and contact requests (read-only)
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm border
                  ${
                    filter === f.value
                      ? "bg-carbon-600 text-white border-carbon-600"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                onClick={() => handleFilterChange(f.value as "all" | "responded" | "open")}
                aria-pressed={filter === f.value}
                type="button"
              >
                <Filter className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {paginatedQueries.length === 0 && (
              <li className="py-8 text-center text-muted-foreground">No queries found.</li>
            )}
            {paginatedQueries.map((q) => (
              <li key={q.id} className="py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">{q.subject}</span>
                      <Badge
                        variant={
                          q.status === "responded"
                            ? "default"
                            : q.status === "open"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          q.status === "responded"
                            ? "bg-green-500"
                            : q.status === "open"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {q.status === "responded" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Responded
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Open
                          </span>
                        )}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {q.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {q.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {q.createdAt}
                      </span>
                      {q.respondedAt && (
                        <span className="flex items-center gap-1">
                          <Info className="w-3 h-3" /> Responded at {q.respondedAt}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-foreground">
                      <span className="font-semibold">Message: </span>
                      {q.message}
                    </div>
                  </div>
                  {/* No CRUD actions */}
                </div>
              </li>
            ))}
          </ul>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-xs text-muted-foreground">
              Showing {filteredQueries.length === 0 ? 0 : startIdx}-{endIdx} of {filteredQueries.length} queries
            </div>
            <div className="flex gap-1">
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded border text-sm font-medium
                  ${page === 1
                    ? "bg-muted text-muted-foreground cursor-not-allowed border-muted"
                    : "hover:bg-accent border-border bg-background"
                  }`}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span className="px-2 py-2 text-sm font-medium text-muted-foreground select-none">
                Page {page} of {totalPages}
              </span>
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded border text-sm font-medium
                  ${page === totalPages
                    ? "bg-muted text-muted-foreground cursor-not-allowed border-muted"
                    : "hover:bg-accent border-border bg-background"
                  }`}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
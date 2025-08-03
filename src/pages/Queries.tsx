import { useState, useEffect } from "react";
import { useQueriesStore } from "@/store/queriesStore";
import { useAuthStore } from "@/store/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowUpDown,
  Mail,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  HelpCircle,
  Calendar,
  Eye,
  BookOpen,
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function Queries() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { queries, loading, error, fetchQueries } = useQueriesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // queries on mount
  useEffect(() => {
    if (accessToken) {
      fetchQueries(accessToken);
    }
  }, [accessToken, fetchQueries]);

  // filters and sort queries
  const filteredQueries = queries
    .filter((query) => {
      const matchesStatus =
        statusFilter === "all" || query.status === statusFilter;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        query.user_name.toLowerCase().includes(searchLower) ||
        query.user_email.toLowerCase().includes(searchLower) ||
        query.message.toLowerCase().includes(searchLower) ||
        query.interests.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  // status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return {
          variant: "default" as const,
          text: "Completed",
          className: "bg-green-100 text-green-800",
        };
      case "in_progress":
        return {
          variant: "secondary" as const,
          text: "In Progress",
          className: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          variant: "outline" as const,
          text: "New",
          className: "bg-blue-100 text-blue-800",
        };
    }
  };

  // sorting order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && queries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading queries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          <p>Error loading queries: {error}</p>
          <Button onClick={() => fetchQueries(accessToken)} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Queries</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all user inquiries and support requests
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <HelpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {queries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {queries.filter((q) => q.status === "new").length} new,{" "}
              {queries.filter((q) => q.status === "in_progress").length} in
              progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {Array.from(new Set(queries.map((q) => q.user_email))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredQueries.length} shown
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Query</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-semibold !text-blue">
              {queries.length > 0 ? formatDate(queries[0].created_at) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {queries.length > 0
                ? `from ${queries[0].user_name}`
                : "No queries"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Query History</CardTitle>
          <CardDescription>
            All user inquiries and support requests (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative max-w-4xl w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              className="w-48"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {sortOrder === "latest" ? "Latest First" : "Oldest First"}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Interests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Created
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueries.map((query) => {
                const statusBadge = getStatusBadge(query.status);
                return (
                  <TableRow key={query.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{query.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{query.user_email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {query.message}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {query.interests}
                    </TableCell>
                    <TableCell className="max-w-sm">
                      <Badge
                        variant={statusBadge.variant}
                        className={statusBadge.className}
                      >
                        {statusBadge.text}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(query.created_at)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredQueries.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No queries found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

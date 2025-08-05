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
  Loader2,
  HelpCircle,
  Calendar,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
];

export default function Queries() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { queries, loading, error, fetchQueries, updateQueryStatus } =
    useQueriesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (accessToken) {
      fetchQueries(accessToken);
    }
  }, [accessToken, fetchQueries]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return {
          variant: "default" as const,
          text: "In Progress",
          className: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          variant: "outline" as const,
          text: "Pending",
          className: "bg-yellow-100 text-yellow-800",
        };
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  const handleStatusUpdate = async (
    queryId: number,
    currentStatus: "pending" | "in_progress"
  ) => {
    const newStatus = currentStatus === "pending" ? "in_progress" : "pending";
    try {
      setUpdatingId(queryId);
      await updateQueryStatus(accessToken, queryId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
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
              {queries.filter((q) => q.status === "pending").length} pending,{" "}
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
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Query History</CardTitle>
          <CardDescription>
            All user inquiries and support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
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
              className="w-[180px]"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {sortOrder === "latest" ? "Latest First" : "Oldest First"}
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">User</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[200px]">Message</TableHead>
                  <TableHead className="min-w-[150px]">Interests</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Created</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query) => {
                  const statusBadge = getStatusBadge(query.status);
                  return (
                    <TableRow key={query.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2 truncate">
                          <span>{query.user_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{query.user_email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {query.message}
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {query.interests}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusBadge.variant}
                          className={statusBadge.className}
                        >
                          {statusBadge.text}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(query.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`status-${query.id}`}
                            checked={query.status === "in_progress"}
                            onCheckedChange={() =>
                              handleStatusUpdate(query.id, query.status)
                            }
                            disabled={updatingId === query.id}
                          />
                          <Label
                            htmlFor={`status-${query.id}`}
                            className="text-sm"
                          >
                            {updatingId === query.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : query.status === "in_progress" ? (
                              "In Progress"
                            ) : (
                              "Pending"
                            )}
                          </Label>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

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

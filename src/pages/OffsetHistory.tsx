import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Mail,
  AlertCircle,
  Hash,
  Coins,
  CreditCard,
  User,
  BadgeCheck,
} from "lucide-react";
import { useOffsetStore } from "@/store/offsetStore";
import { useAuthStore } from "@/store/auth";

interface OffsetHistoryItem {
  confirmation_number: string;
  certificate_number: string;
  project_name: string;
  carbon_emission_metric_tons: number;
  price_per_metric_ton_usd: number;
  total_cost_usd: number;
  carbon_expiration_date: string;
  gold_standard_confirmation: string;
  date_of_issue: string;
  certification_name: string;
}

export default function OffsetHistory() {
  const { accessToken } = useAuthStore();
  const {
    offsetHistory,
    historyLoading,
    historyError,
    fetchOffsetHistoryByEmail,
  } = useOffsetStore();

  const [email, setEmail] = useState("");

  const handleSearch = () => {
    if (!email.trim()) return;
    fetchOffsetHistoryByEmail(email, accessToken);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Empty state
  if (offsetHistory.length === 0 && !historyLoading && !historyError) {
    return (
      <div className="space-y-8 animate-fade-in max-w-3xl mx-auto px-4">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-foreground">
            Offset History
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Search for carbon offset history by email address
          </p>
        </header>

        <section className="bg-card rounded-lg border border-gray-200 p-8 shadow-md max-w-xl mx-auto">
          <Label
            htmlFor="email-search"
            className="mb-3 block text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <Mail className="w-5 h-5 text-gray-500" /> Email Address
          </Label>
          <div className="flex gap-4">
            <Input
              id="email-search"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter email address to search"
              className="flex-grow rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              autoComplete="email"
              aria-label="Email address input"
            />
            <Button
              onClick={handleSearch}
              disabled={historyLoading}
              className="px-6 bg-carbon-gradient hover:bg-carbon-600 text-white font-semibold rounded-md shadow"
              aria-label="Search offset history"
            >
              {historyLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
              ) : (
                <Search className="w-5 h-5 mr-2 inline-block" />
              )}
              {historyLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-16 text-center max-w-md mx-auto text-gray-500"
        >
          <p className="text-xl font-light leading-relaxed">
            Enter an email address above to search for carbon offset
            certificates. Results will appear here once you perform a search.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-10 animate-fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-foreground">
          Offset History
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {offsetHistory.length > 0
            ? `Found ${offsetHistory.length} offset certificate${
                offsetHistory.length > 1 ? "s" : ""
              } for ${email}`
            : "Search for carbon offset history by email address"}
        </p>
      </header>

      <section className="bg-card rounded-lg border border-gray-200 p-8 shadow-md max-w-xl mx-auto">
        <Label
          htmlFor="email-search"
          className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2"
        >
          <Mail className="w-5 h-5 text-gray-500" /> Email Address
        </Label>
        <div className="flex gap-4">
          <Input
            id="email-search"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter email address to search"
            className="flex-grow rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            autoComplete="email"
            aria-label="Email address input"
          />
          <Button
            onClick={handleSearch}
            disabled={historyLoading}
            className="px-6 bg-carbon-gradient hover:bg-carbon-600 text-white font-semibold rounded-md shadow"
            aria-label="Search offset history"
          >
            {historyLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
            ) : (
              <Search className="w-5 h-5 mr-2 inline-block" />
            )}
            {historyLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </section>

      {historyError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto bg-red-50 border border-red-300 rounded-lg p-6 flex items-start gap-4 text-red-700"
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-lg">Error</h4>
            <p className="mt-1 text-sm">{historyError}</p>
          </div>
        </motion.div>
      )}

      {historyLoading && (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Searching offset history...
            </p>
          </div>
        </div>
      )}

      {offsetHistory.length > 0 && (
        <div className="grid gap-6 mx-auto">
          {offsetHistory.map((offset, index) => (
            <motion.div
              key={offset.confirmation_number}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Card className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Project Info */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {offset.project_name}
                    </h3>
                    <p className="flex items-center text-sm text-muted-foreground gap-2">
                      <Hash className="w-4 h-4" /> Confirmation #:{" "}
                      {offset.confirmation_number}
                    </p>
                    <p className="text-xs text-gray-400">
                      Certificate #: {offset.certificate_number}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-3">
                      <Coins className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">
                          {offset.carbon_emission_metric_tons}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Metric Tons CO₂
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold">
                          {formatCurrency(offset.total_cost_usd)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Cost
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certification & Dates */}
                  <div className="md:border-l border-gray-200 md:pl-6 flex flex-col justify-between gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">
                          {offset.certification_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Certified To
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">
                          {offset.gold_standard_confirmation}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Standard
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-6 text-xs">
                      <div>
                        <p className="font-semibold text-foreground">Issued</p>
                        <p>{formatDate(offset.date_of_issue)}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Expires</p>
                        <p>{formatDate(offset.carbon_expiration_date)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

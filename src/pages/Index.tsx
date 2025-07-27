
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  BarChart3, 
  Users, 
  Globe, 
  ArrowRight, 
  TrendingUp,
  Shield
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-carbon-gradient">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Leaf className="h-8 w-8" />
                <span className="text-2xl font-bold">Emission Lab</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Carbon Emission &<br />
              <span className="text-carbon-200">Offset Management</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-carbon-100 max-w-3xl mx-auto">
              Comprehensive admin dashboard for tracking, managing, and optimizing carbon emissions 
              and offset programs across your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-carbon-600 hover:bg-white/90 font-semibold">
                <Link to="/dashboard">
                  Access Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Admin Features</h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Everything you need to manage carbon emissions, offset projects, and sustainability initiatives
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-carbon-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-carbon-600" />
                  </div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive analytics with real-time carbon emission tracking, offset monitoring, 
                  and detailed reporting with interactive charts and insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>User Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced user management system with role-based permissions, subscription tracking, 
                  and comprehensive user analytics for better engagement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Offset Projects</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage carbon offset projects, verify credits, track impact, and maintain 
                  a comprehensive database of environmental initiatives.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>API Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete API documentation, endpoint management, rate limiting, 
                  and integration tools for seamless third-party connections.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Subscription Plans</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Flexible subscription management with customizable pricing, 
                  carbon credit allocations, and automated billing systems.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Leaf className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Content Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Blog management system for sustainability content, educational resources, 
                  and environmental news with full CRUD capabilities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-carbon-600 mb-2">2,847</div>
              <div className="text-muted-foreground">Tons CO₂ Offset</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3,456</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">89.2K</div>
              <div className="text-muted-foreground">API Requests</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">$45K</div>
              <div className="text-muted-foreground">Monthly Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-carbon-gradient">
        <div className="container mx-auto px-6 text-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-carbon-100 max-w-2xl mx-auto">
              Join thousands of organizations using Emission Lab to manage their environmental impact 
              and achieve sustainability goals.
            </p>
            <Button asChild size="lg" className="bg-white text-carbon-600 hover:bg-white/90 font-semibold">
              <Link to="/dashboard">
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-carbon-600" />
              <span className="text-xl font-bold">Emission Lab</span>
            </div>
            <div className="text-muted-foreground">
              © 2025 Emission Lab. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { ComponentType } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ApiDocs from "./pages/ApiDocs";
import Blogs from "./pages/Blogs";
import Subscriptions from "./pages/Subscriptions";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Faqs from "./pages/Faq";
import Billing from "./pages/Billing";
import Queries from "./pages/Queries";
import OffsetProjects from "./pages/Offset-Projects";

// Optionally, type the route objects
export interface AppRoute {
  path: string;
  component: ComponentType;
  layout?: "dashboard";
}

export const routes: AppRoute[] = [
  { path: "/", component: Dashboard, layout: "dashboard" },
  { path: "/", component: Dashboard, layout: "dashboard" },
  { path: "/api-docs", component: ApiDocs, layout: "dashboard" },
  { path: "/blogs", component: Blogs, layout: "dashboard" },
  { path: "/blogs/create", component: Blogs, layout: "dashboard" },
  // { path: "/blogs/categories", component: Blogs, layout: "dashboard" },
  { path: "/subscriptions", component: Subscriptions, layout: "dashboard" },
  { path: "/subscriptions/create", component: Subscriptions, layout: "dashboard" },
  { path: "/subscriptions/pricing", component: Subscriptions, layout: "dashboard" },
  { path: "/users", component: Users, layout: "dashboard" },
  { path: "/users/analytics", component: Users, layout: "dashboard" },
  { path: "/users/permissions", component: Users, layout: "dashboard" },
  { path: "/settings", component: Settings, layout: "dashboard" },
  { path: "/profile", component: Settings, layout: "dashboard" },
  { path: "/analytics", component: Dashboard, layout: "dashboard" },
  { path: "/calculator", component: Dashboard, layout: "dashboard" },
  { path: "/offset-projects", component: OffsetProjects, layout: "dashboard" },
  { path: "/faqs", component: Faqs, layout: "dashboard" },
  { path: "/billing", component: Billing, layout: "dashboard" },
  { path: "/queries", component: Queries, layout: "dashboard" },
  { path: "*", component: NotFound }
];
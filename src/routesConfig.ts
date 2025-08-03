import { ComponentType } from "react";
import Dashboard from "./pages/AdminDashboard";
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
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import MySubscription from "./pages/mySubscriptions";
import Pricing from "./pages/Pricing";
import SettingsPage from "./app/(dashboard)/settings/page";
import BlogDetails from "./pages/BlogDetails";
import ContactPage from "./pages/ContactPage";
import TermsAndConditions from "./pages/Terms";

// route objects
export interface AppRoute {
  path: string;
  component: ComponentType;
  layout?: "dashboard";
  roles?: string[];
}

export const routes: AppRoute[] = [
  {
    path: "/",
    component: Dashboard,
    layout: "dashboard",
    roles: ["super_admin", "business", "individual"],
  },
  {
    path: "/api-docs",
    component: ApiDocs,
    layout: "dashboard",
    roles: ["super_admin", "business"],
  },
  {
    path: "/blogs",
    component: Blogs,
    layout: "dashboard",
    roles: ["super_admin"],
  },
    {
    path: "/blogs/:id",
    component: BlogDetails,
    layout: "dashboard",
    roles: ["super_admin"],
  },
  {
    path: "/blogs/create",
    component: BlogDetails,
    layout: "dashboard",
    roles: ["super_admin"],
  },
  {
    path: "/subscriptions",
    component: Subscriptions,
    layout: "dashboard",
    roles: ["super_admin", "business"],
  },
  {
    path: "/my-subscription",
    component: MySubscription,
    layout: "dashboard",
    roles: ["business"],
  },
  {
    path: "/subscriptions/pricing",
    component: Pricing,
    layout: "dashboard",
    roles: ["super_admin", "business"],
  },
  {
    path: "/users",
    component: Users,
    layout: "dashboard",
    roles: ["super_admin"],
  },
    {
    path: "/contact",
    component: ContactPage,
    layout: "dashboard",
    roles: ["business"],
  },
  {
    path: "/settings",
    component: SettingsPage,
    layout: "dashboard",
    roles: ["super_admin", "business", "individual"],
  },
  // { path: "/profile", component: Settings, layout: "dashboard", roles: ["super_admin", "business", "individual"] },
  {
    path: "/offset-projects",
    component: OffsetProjects,
    layout: "dashboard",
    roles: ["super_admin", "business"],
  },
  {
    path: "/faqs",
    component: Faqs,
    layout: "dashboard",
    roles: ["super_admin"],
  },
  {
    path: "/billing",
    component: Billing,
    layout: "dashboard",
    roles: ["super_admin", "business"],
  },
  {
    path: "/queries",
    component: Queries,
    layout: "dashboard",
    roles: ["super_admin"],
  },
    {
    path: "/terms",
    component: TermsAndConditions,
    layout: "dashboard",
    roles: ["super_admin", "business", "individual"],
  },
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  { path: "*", component: NotFound },
];

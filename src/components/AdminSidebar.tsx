import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Users,
  Globe,
  FileQuestion,
  MailQuestion,
  Settings,
  ChevronDown,
  ChevronRight,
  CreditCardIcon,
  DollarSignIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { useState } from "react";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Blogs",
    url: "/blogs",
    icon: BookOpen,
  },
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: CreditCard,
    subItems: [
      { title: "All Plans", url: "/subscriptions" },
      { title: "Pricing", url: "/subscriptions/pricing" },
    ],
  },
  {
    title: "FAQ",
    url: "/faqs",
    icon: FileQuestion,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: DollarSignIcon,
  },
  {
    title: "Queries",
    url: "/queries",
    icon: MailQuestion,
  },
  // {
  //   title: "Calculator",
  //   url: "/calculator",
  //   icon: Calculator,
  // },
  {
    title: "Offset Projects",
    url: "/offset-projects",
    icon: Globe,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
            <img
              src="/carbon-Fav.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Emission Lab{" "}
            </h2>
            <p className="text-sm text-sidebar-foreground/70">
              Admin Dashboard
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium uppercase tracking-wider mb-4">
            Main Navigations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible
                      open={openItems.includes(item.title)}
                      onOpenChange={() => toggleItem(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive(item.url) &&
                              "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {openItems.includes(item.title) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-6 mt-2 space-y-1">
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  to={subItem.url}
                                  className={cn(
                                    "text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isActive(subItem.url) &&
                                      "bg-sidebar-accent text-sidebar-accent-foreground"
                                  )}
                                >
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center space-x-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive(item.url) &&
                            "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

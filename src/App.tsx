import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes, AppRoute } from "./routesConfig.ts";
import { DashboardLayout } from "./components/DashboardLayout";
import { RequireAuth } from "./components/RequireAuth.tsx";
import { RequireRole } from "./components/RequireRole.tsx";

const queryClient = new QueryClient();

const getLayout = (route: AppRoute, element: JSX.Element) => {
  if (route.layout === "dashboard") {
    const wrapped = route.roles ? (
      <RequireRole allowedRoles={route.roles}>{element}</RequireRole>
    ) : (
      element
    );
    return (
      <RequireAuth>
        <DashboardLayout>{wrapped}</DashboardLayout>
      </RequireAuth>
    );
  }
  return element;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {routes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={getLayout(route, <route.component />)}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

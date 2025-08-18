import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import RootLayout from "./app/layout";
import { routes as AppRoutes } from "./routesConfig";
import { DashboardLayout } from "./components/DashboardLayout";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <RootLayout>
        <Routes>
          {AppRoutes.map(({ path, component: Component, layout, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                layout === "dashboard" ? (
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Component />
                    </DashboardLayout>
                  </ProtectedRoute>
                ) : (
                  <Component />
                )
              }
            />
          ))}
        </Routes>
      </RootLayout>
    </AuthProvider>
  </BrowserRouter>
);

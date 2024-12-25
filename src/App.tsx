import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import Search from "./pages/Search";
import Upgrade from "./pages/Upgrade";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile/setup" element={<ProfileSetup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <Create />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:id?"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />
            <Route
              path="/upgrade"
              element={
                <PrivateRoute>
                  <Upgrade />
                </PrivateRoute>
              }
            />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
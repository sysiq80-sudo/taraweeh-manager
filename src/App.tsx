import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import PublicScheduleView from "./pages/PublicScheduleView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Dashboard - Protected, requires auth AND profile */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute requireProfile={true}>
                <Index />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Dashboard - Protected, requires auth AND profile */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireProfile={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Super Admin Dashboard - Protected, requires auth AND profile */}
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute requireProfile={true}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Schedule View - NO AUTH REQUIRED */}
          <Route path="/view/:token" element={<PublicScheduleView />} />
          
          {/* Auth - Public routes */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Onboarding - Protected by auth, doesn't require profile */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute requireProfile={false}>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CultivationProvider } from "@/context/CultivationContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import PlantDetails from "@/components/PlantDetails";
import Tasks from "@/pages/Tasks";
import Fertilizers from "@/pages/Fertilizers";
import Varieties from "@/pages/Varieties";
import HelpChat from "@/pages/HelpChat";

// Optimize by creating the query client outside of component render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CultivationProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/fertilizers" element={
              <ProtectedRoute>
                <Fertilizers />
              </ProtectedRoute>
            } />
            
            <Route path="/plants" element={
              <ProtectedRoute>
                <Varieties />
              </ProtectedRoute>
            } />
            
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } />
            
            <Route path="/help" element={
              <ProtectedRoute>
                <HelpChat />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* Add route for individual plant details */}
            <Route path="/plant/:plantId" element={
              <ProtectedRoute>
                <PlantDetails standalone={true} />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CultivationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

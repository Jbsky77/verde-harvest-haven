
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { CultivationProvider } from "@/context/CultivationContext";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Optimize by creating the query client outside of component render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CultivationProvider>
          <Toaster />
          <Sonner position="top-right" />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/spaces" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/fertilizers" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/plants" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CultivationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

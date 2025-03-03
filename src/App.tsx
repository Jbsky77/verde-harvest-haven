
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CultivationProvider } from "@/context/CultivationContext";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/spaces" element={<Index />} />
          <Route path="/analytics" element={<Index />} />
          <Route path="/fertilizers" element={<Index />} />
          <Route path="/plants" element={<Index />} />
          <Route path="/settings" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CultivationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

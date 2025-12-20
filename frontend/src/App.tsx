import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PredictionHistoryProvider } from "@/contexts/PredictionHistoryContext";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import BulkUpload from "./pages/BulkUpload";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PredictionHistoryProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navigation />
                  <Index />
                </>
              }
            />
            <Route
              path="/prediction"
              element={
                <>
                  <Navigation />
                  <Index />
                </>
              }
            />
            <Route
              path="/history"
              element={
                <>
                  <Navigation />
                  <History />
                </>
              }
            />
            <Route
              path="/analytics"
              element={
                <>
                  <Navigation />
                  <Analytics />
                </>
              }
            />
            <Route
              path="/csv-upload"
              element={
                <>
                  <Navigation />
                  <BulkUpload />
                </>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PredictionHistoryProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

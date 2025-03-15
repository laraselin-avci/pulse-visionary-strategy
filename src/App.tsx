
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Topics from "./pages/Topics";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const App = () => {
  const [hasSubmittedWebsite, setHasSubmittedWebsite] = useState<boolean>(false);
  
  // Check localStorage on component mount to see if user has already submitted a website
  useEffect(() => {
    const websiteSubmitted = localStorage.getItem('websiteSubmitted');
    if (websiteSubmitted === 'true') {
      setHasSubmittedWebsite(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/onboarding" element={<Onboarding onWebsiteSubmit={() => setHasSubmittedWebsite(true)} />} />
            <Route path="/" element={
              hasSubmittedWebsite ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={
              hasSubmittedWebsite ? <NotFound /> : <Navigate to="/onboarding" replace />
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

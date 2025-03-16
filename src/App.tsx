
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Report from "./pages/Report";
import Topics from "./pages/Topics";
import LiveUpdates from "./pages/LiveUpdates";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const App = () => {
  const [hasSubmittedWebsite, setHasSubmittedWebsite] = useState<boolean>(false);
  
  // Check localStorage on component mount to see if user has already submitted a website
  useEffect(() => {
    const websiteSubmitted = localStorage.getItem('websiteSubmitted');
    const analyzedWebsite = localStorage.getItem('analyzedWebsite');
    
    console.log('App init - Website submitted:', websiteSubmitted);
    console.log('App init - Analyzed website:', analyzedWebsite);
    
    if (websiteSubmitted === 'true' && analyzedWebsite) {
      setHasSubmittedWebsite(true);
    } else {
      // Clear incomplete state if needed
      if (websiteSubmitted === 'true' && !analyzedWebsite) {
        localStorage.removeItem('websiteSubmitted');
      }
    }
  }, []);

  // Handle website submission from onboarding
  const handleWebsiteSubmit = (websiteUrl: string) => {
    // Ensure the URL is properly formatted
    const formattedUrl = websiteUrl.trim();
    if (!formattedUrl) {
      console.error('Empty website URL provided');
      return;
    }
    
    // Store the analyzed website URL in localStorage
    console.log('Storing analyzed website:', formattedUrl);
    localStorage.setItem('analyzedWebsite', formattedUrl);
    localStorage.setItem('websiteSubmitted', 'true');
    setHasSubmittedWebsite(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/report" element={<Report />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/live-updates" element={<LiveUpdates />} />
            <Route path="/onboarding" element={<Onboarding onWebsiteSubmit={handleWebsiteSubmit} />} />
            <Route path="/" element={
              hasSubmittedWebsite ? <Navigate to="/report" replace /> : <Navigate to="/onboarding" replace />
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

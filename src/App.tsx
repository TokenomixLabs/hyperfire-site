
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ContentLibrary from "./pages/ContentLibrary";
import LiveEvents from "./pages/LiveEvents";
import DocumentVault from "./pages/DocumentVault";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import ContentApproval from "./pages/ContentApproval";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/content" element={<ContentLibrary />} />
          <Route path="/live" element={<LiveEvents />} />
          <Route path="/documents" element={<DocumentVault />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/content-approval" element={<ContentApproval />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

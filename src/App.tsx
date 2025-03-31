import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "./context/AuthContext";
import { ReferralProvider } from "./context/ReferralContext";
import { MembershipProvider } from "./context/MembershipContext";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme-preference">
      <BrowserRouter>
        <AuthProvider>
          <MembershipProvider>
            <ReferralProvider>
              <div className="min-h-screen bg-background font-sans">
                <AppRoutes />
                <Toaster />
              </div>
            </ReferralProvider>
          </MembershipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

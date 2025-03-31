
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { MembershipProvider } from "./context/MembershipContext";
import { ReferralProvider } from "./context/ReferralContext";
import { ActivityFeedProvider } from "./context/ActivityFeedContext";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <MembershipProvider>
              <ReferralProvider>
                <ActivityFeedProvider>
                  <AppRoutes />
                  <Toaster />
                </ActivityFeedProvider>
              </ReferralProvider>
            </MembershipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

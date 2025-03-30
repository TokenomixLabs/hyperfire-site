import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ReferralProvider } from "./context/ReferralContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import ContentExample from "./pages/ContentExample";
import SignalSeriesViewer from "./pages/SignalSeriesViewer";
import BrowseSignalSeries from "./pages/BrowseSignalSeries";
import SignalLibrary from "./pages/SignalLibrary";
import SignalSeriesDetail from "./pages/SignalSeriesDetail";
import UserProfilePage from "./pages/UserProfilePage";

// SignalBoard pages
import SignalBoardLayout from "./components/signalboard/SignalBoardLayout";
import SignalBoardPage from "./pages/signalboard/SignalBoardPage";
import ThreadDetailPage from "./pages/signalboard/ThreadDetailPage";
import ThreadCreationPage from "./pages/signalboard/ThreadCreationPage";

// Protected pages
import ProfileSetup from "./pages/auth/ProfileSetup";
import ProfileEditPage from "./pages/ProfileEditPage";
import UserDashboard from "./pages/UserDashboard";
import ContentLibrary from "./pages/ContentLibrary";
import LiveEvents from "./pages/LiveEvents";
import DocumentVault from "./pages/DocumentVault";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import ContentApproval from "./pages/ContentApproval";
import MediaLibrary from "./pages/MediaLibrary";
import SeoTools from "./pages/SeoTools";
import IntegrationTools from "./pages/IntegrationTools";
import ReferralTrackingStats from "./components/referrals/ReferralTrackingStats";
import SignalSeriesAdmin from "./pages/admin/SignalSeriesAdmin";
import MySignalFunnels from "./pages/user/MySignalFunnels";
import MySignalDuplicates from "./pages/user/MySignalDuplicates";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ReferralProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/content-example" element={<ContentExample />} />
              <Route path="/content-example/:contentId" element={<ContentExample />} />
              <Route path="/s/:slug" element={<SignalSeriesViewer />} />
              <Route path="/browse-signals" element={<BrowseSignalSeries />} />
              <Route path="/signal-library" element={<SignalLibrary />} />
              <Route path="/signal/:slug" element={<SignalSeriesDetail />} />
              <Route path="/u/:username" element={<UserProfilePage />} />
              
              {/* SignalBoard Routes */}
              <Route path="/signalboard" element={<SignalBoardLayout />}>
                <Route index element={<SignalBoardPage />} />
                <Route path="thread/:threadId" element={<ThreadDetailPage />} />
                <Route 
                  path="create" 
                  element={
                    <ProtectedRoute>
                      <ThreadCreationPage />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              {/* Protected Routes */}
              <Route 
                path="/profile-setup" 
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/edit" 
                element={
                  <ProtectedRoute>
                    <ProfileEditPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/content" 
                element={
                  <ProtectedRoute>
                    <ContentLibrary />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/live" 
                element={
                  <ProtectedRoute>
                    <LiveEvents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <DocumentVault />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/signal-series" 
                element={
                  <ProtectedRoute>
                    <SignalSeriesAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/content-approval" 
                element={
                  <ProtectedRoute>
                    <ContentApproval />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/media-library" 
                element={
                  <ProtectedRoute>
                    <MediaLibrary />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seo-tools" 
                element={
                  <ProtectedRoute>
                    <SeoTools />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/integration-tools" 
                element={
                  <ProtectedRoute>
                    <IntegrationTools />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/referral-stats" 
                element={
                  <ProtectedRoute>
                    <ReferralTrackingStats />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-signal-funnels" 
                element={
                  <ProtectedRoute>
                    <MySignalFunnels />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-signal-duplicates" 
                element={
                  <ProtectedRoute>
                    <MySignalDuplicates />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ReferralProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Routes, Route } from "react-router-dom";
import { Fragment } from "react";

// Import all pages for direct use in Routes
import Index from "../pages/Index";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";
import ContentExample from "../pages/ContentExample";
import SignalSeriesViewer from "../pages/SignalSeriesViewer";
import BrowseSignalSeries from "../pages/BrowseSignalSeries";
import SignalLibrary from "../pages/SignalLibrary";
import SignalSeriesDetail from "../pages/SignalSeriesDetail";
import UserProfilePage from "../pages/UserProfilePage";
import ProfileSetup from "../pages/auth/ProfileSetup";
import ProfileEditPage from "../pages/ProfileEditPage";
import UserDashboard from "../pages/UserDashboard";
import ContentLibrary from "../pages/content-library";
import LiveEvents from "../pages/LiveEvents";
import DocumentVault from "../pages/DocumentVault";
import ReferralTrackingStats from "../components/referrals/ReferralTrackingStats";
import MySignalFunnels from "../pages/user/MySignalFunnels";
import MySignalDuplicates from "../pages/user/MySignalDuplicates";
import Admin from "../pages/Admin";
import UserManagement from "../pages/UserManagement";
import ContentApproval from "../pages/ContentApproval";
import MediaLibrary from "../pages/MediaLibrary";
import SeoTools from "../pages/SeoTools";
import IntegrationTools from "../pages/IntegrationTools";
import SignalSeriesAdmin from "../pages/admin/SignalSeriesAdmin";
import CommunityCloningSystem from "../pages/admin/CommunityCloningSystem";
import SignalBoardRoutes from "./SignalBoardRoutes";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Learn pages
import Learn from "../pages/learn";
import CoursePage from "../pages/learn/CoursePage";
import VideoCoursePage from "../pages/learn/VideoCoursePage";
import CourseSeriesPage from "../pages/learn/CourseSeriesPage";
import CoursesAdmin from "../pages/admin/CoursesAdmin";
import CourseAnalytics from "../pages/admin/CourseAnalytics";
import CourseEditor from "../pages/admin/CourseEditor";

const AppRoutes = () => {
  return (
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
      <Route path="*" element={<NotFound />} />

      {/* Education Hub Routes */}
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn/:slug" element={<CoursePage />} />
      <Route path="/learn/video/:slug" element={<VideoCoursePage />} />
      <Route path="/learn/series/:slug" element={<CourseSeriesPage />} />

      {/* User Routes */}
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

      {/* Admin Routes */}
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
        path="/admin/courses" 
        element={
          <ProtectedRoute>
            <CoursesAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/courses/new" 
        element={
          <ProtectedRoute>
            <CourseEditor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/courses/edit/:courseId" 
        element={
          <ProtectedRoute>
            <CourseEditor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/courses/analytics/:courseId" 
        element={
          <ProtectedRoute>
            <CourseAnalytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/community-cloning" 
        element={
          <ProtectedRoute>
            <CommunityCloningSystem />
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

      {/* SignalBoard Routes */}
      <Route path="/signalboard/*" element={<SignalBoardRoutes />} />
    </Routes>
  );
};

export default AppRoutes;

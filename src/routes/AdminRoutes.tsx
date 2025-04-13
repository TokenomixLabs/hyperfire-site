
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Admin from "../pages/Admin";
import UserManagement from "../pages/UserManagement";
import ContentApproval from "../pages/ContentApproval";
import MediaLibrary from "../pages/MediaLibrary";
import SeoTools from "../pages/SeoTools";
import IntegrationTools from "../pages/IntegrationTools";
import ActivityFeedPage from "../pages/ActivityFeedPage";
import NotificationsPage from "../pages/NotificationsPage";
import SignalSeriesAdmin from "../pages/admin/SignalSeriesAdmin";
import CoursesAdmin from "../pages/admin/CoursesAdmin";
import CourseEditor from "../pages/admin/CourseEditor";
import CourseAnalytics from "../pages/admin/CourseAnalytics";
import Funnels from "../pages/admin/Funnels";
import FunnelBuilder from "../pages/admin/FunnelBuilder";
import CommunityCloningSystem from "../pages/admin/CommunityCloningSystem";
import StripeIntegrationAdmin from "../pages/admin/StripeIntegrationAdmin";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="signal-series" 
        element={
          <ProtectedRoute>
            <SignalSeriesAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="courses" 
        element={
          <ProtectedRoute>
            <CoursesAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="courses/edit/:courseId" 
        element={
          <ProtectedRoute>
            <CourseEditor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="courses/analytics/:courseId" 
        element={
          <ProtectedRoute>
            <CourseAnalytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="funnels" 
        element={
          <ProtectedRoute>
            <Funnels />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="funnels/new" 
        element={
          <ProtectedRoute>
            <FunnelBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="funnels/:funnelId" 
        element={
          <ProtectedRoute>
            <FunnelBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="stripe"
        element={
          <ProtectedRoute>
            <StripeIntegrationAdmin />
          </ProtectedRoute>
        }
      />
      <Route 
        path="users" 
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="content-approval" 
        element={
          <ProtectedRoute>
            <ContentApproval />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="media-library" 
        element={
          <ProtectedRoute>
            <MediaLibrary />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="seo-tools" 
        element={
          <ProtectedRoute>
            <SeoTools />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="integration-tools" 
        element={
          <ProtectedRoute>
            <IntegrationTools />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="activity-feed" 
        element={
          <ProtectedRoute>
            <ActivityFeedPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="notifications" 
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="community-cloning" 
        element={
          <ProtectedRoute>
            <CommunityCloningSystem />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;


import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Admin from "../pages/Admin";
import UserManagement from "../pages/UserManagement";
import ContentApproval from "../pages/ContentApproval";
import MediaLibrary from "../pages/MediaLibrary";
import SeoTools from "../pages/SeoTools";
import IntegrationTools from "../pages/IntegrationTools";
import SignalSeriesAdmin from "../pages/admin/SignalSeriesAdmin";
import Funnels from "../pages/admin/Funnels";
import FunnelBuilder from "../pages/admin/FunnelBuilder";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="admin/signal-series" 
        element={
          <ProtectedRoute>
            <SignalSeriesAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="admin/funnels" 
        element={
          <ProtectedRoute>
            <Funnels />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="admin/funnels/new" 
        element={
          <ProtectedRoute>
            <FunnelBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="admin/funnels/:funnelId" 
        element={
          <ProtectedRoute>
            <FunnelBuilder />
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
    </Routes>
  );
};

export default AdminRoutes;

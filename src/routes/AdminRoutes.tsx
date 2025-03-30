
import { Route, Fragment } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Admin pages
import Admin from "../pages/Admin";
import UserManagement from "../pages/UserManagement";
import ContentApproval from "../pages/ContentApproval";
import MediaLibrary from "../pages/MediaLibrary";
import SeoTools from "../pages/SeoTools";
import IntegrationTools from "../pages/IntegrationTools";
import SignalSeriesAdmin from "../pages/admin/SignalSeriesAdmin";

const AdminRoutes = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default AdminRoutes;

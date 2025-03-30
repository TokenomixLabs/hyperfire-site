
import { Route, Fragment } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Protected user pages
import ProfileSetup from "../pages/auth/ProfileSetup";
import ProfileEditPage from "../pages/ProfileEditPage";
import UserDashboard from "../pages/UserDashboard";
import ContentLibrary from "../pages/content-library"; // Updated import
import LiveEvents from "../pages/LiveEvents";
import DocumentVault from "../pages/DocumentVault";
import ReferralTrackingStats from "../components/referrals/ReferralTrackingStats";
import MySignalFunnels from "../pages/user/MySignalFunnels";
import MySignalDuplicates from "../pages/user/MySignalDuplicates";

const UserRoutes = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

export default UserRoutes;

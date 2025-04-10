
import { Routes, Route } from "react-router-dom";
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
import Pricing from "../pages/Pricing";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfUse from "../pages/TermsOfUse";
import CustomDomainSetupPage from "../pages/CustomDomainSetupPage";
import AdminLoginTest from "../pages/AdminLoginTest";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="content-example" element={<ContentExample />} />
      <Route path="content-example/:contentId" element={<ContentExample />} />
      <Route path="s/:slug" element={<SignalSeriesViewer />} />
      <Route path="browse-signals" element={<BrowseSignalSeries />} />
      <Route path="signal-library" element={<SignalLibrary />} />
      <Route path="signal/:slug" element={<SignalSeriesDetail />} />
      <Route path="u/:username" element={<UserProfilePage />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="terms-of-use" element={<TermsOfUse />} />
      <Route path="domain-setup" element={<CustomDomainSetupPage />} />
      <Route path="admin-test" element={<AdminLoginTest />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;

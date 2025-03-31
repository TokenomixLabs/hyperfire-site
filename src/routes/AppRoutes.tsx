
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import SignalBoardRoutes from "./SignalBoardRoutes";
import Header from "../components/header/HeaderContainer";
import NotFound from "../pages/NotFound";
import FunnelPage from "../pages/FunnelPage";
import { Outlet } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Not Found Route */}
      <Route path="*" element={
        <Header isScrolled={false}>
          <NotFound />
        </Header>
      } />
      
      {/* Funnel Route - No Header for Clean Funnel Experience */}
      <Route path="/funnel/:slug" element={<FunnelPage />} />
      <Route path="/vip-invite" element={<FunnelPage />} />
      
      {/* Routes with Header */}
      <Route element={
        <Header isScrolled={false}>
          <Outlet />
        </Header>
      }>
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />
        
        {/* Admin Routes */}
        <Route path="/*" element={<AdminRoutes />} />
        
        {/* User Routes */}
        <Route path="/*" element={<UserRoutes />} />
        
        {/* SignalBoard Routes */}
        <Route path="/*" element={<SignalBoardRoutes />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

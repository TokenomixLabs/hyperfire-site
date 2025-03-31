
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import SignalBoardRoutes from "./SignalBoardRoutes";
import Header from "../components/header/HeaderContainer";
import NotFound from "../pages/NotFound";
import FunnelPage from "../pages/FunnelPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Funnel Route - No Header for Clean Funnel Experience */}
      <Route path="/funnel/:slug" element={<FunnelPage />} />
      <Route path="/vip-invite" element={<FunnelPage />} />
      
      {/* Routes with Header */}
      <Route 
        element={<Header isScrolled={false} />} 
      >
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />
        
        {/* Admin Routes */}
        <Route path="admin/*" element={<AdminRoutes />} />
        
        {/* User Routes */}
        <Route path="/*" element={<UserRoutes />} />
        
        {/* SignalBoard Routes */}
        <Route path="signalboard/*" element={<SignalBoardRoutes />} />
      </Route>
      
      {/* Not Found Route - Must be last */}
      <Route path="*" element={
        <Header isScrolled={false}>
          <NotFound />
        </Header>
      } />
    </Routes>
  );
};

export default AppRoutes;

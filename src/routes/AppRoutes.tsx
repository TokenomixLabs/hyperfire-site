
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
      <Route path="*" element={
        <Header isScrolled={false}>
          <NotFound />
        </Header>
      } />
      
      {/* Funnel Route - No Header for Clean Funnel Experience */}
      <Route path="/funnel/:slug" element={<FunnelPage />} />
      <Route path="/vip-invite" element={<FunnelPage />} />
      
      {/* Public, Admin, User, and SignalBoard Routes with Header */}
      <Route element={
        <Header isScrolled={false}>
          {/* Header will render its children here */}
        </Header>
      }>
        <Route path="/" element={<PublicRoutes />} />
        {AdminRoutes()}
        {UserRoutes()}
        <Route path="/*" element={<SignalBoardRoutes />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

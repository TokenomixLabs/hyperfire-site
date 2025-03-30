
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SignalBoardRoutes from "./SignalBoardRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Spread the route elements from each route component */}
      <PublicRoutes />
      <UserRoutes />
      <AdminRoutes />
      
      {/* For SignalBoardRoutes which returns a Route component with nested routes */}
      <Route path="/signalboard/*" element={<SignalBoardRoutes />} />
    </Routes>
  );
};

export default AppRoutes;

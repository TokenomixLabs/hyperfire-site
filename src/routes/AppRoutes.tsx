
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import SignalBoardRoutes from "./SignalBoardRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Include the route components directly */}
      <PublicRoutes />
      <UserRoutes />
      <AdminRoutes />
      
      {/* For SignalBoardRoutes which returns a Route component with nested routes */}
      <Route path="/signalboard/*" element={<SignalBoardRoutes />} />
    </Routes>
  );
};

export default AppRoutes;

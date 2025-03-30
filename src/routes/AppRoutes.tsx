
import { Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SignalBoardRoutes from "./SignalBoardRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <SignalBoardRoutes />
      <UserRoutes />
      <AdminRoutes />
      <PublicRoutes />
    </Routes>
  );
};

export default AppRoutes;

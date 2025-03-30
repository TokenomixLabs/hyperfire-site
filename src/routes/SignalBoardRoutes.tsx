
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import SignalBoardLayout from "../components/signalboard/SignalBoardLayout";
import SignalBoardPage from "../pages/signalboard/SignalBoardPage";
import ThreadDetailPage from "../pages/signalboard/ThreadDetailPage";
import ThreadCreationPage from "../pages/signalboard/ThreadCreationPage";

const SignalBoardRoutes = () => {
  return (
    <Route path="/signalboard" element={<SignalBoardLayout />}>
      <Route index element={<SignalBoardPage />} />
      <Route path="thread/:threadId" element={<ThreadDetailPage />} />
      <Route 
        path="create" 
        element={
          <ProtectedRoute>
            <ThreadCreationPage />
          </ProtectedRoute>
        } 
      />
    </Route>
  );
};

export default SignalBoardRoutes;

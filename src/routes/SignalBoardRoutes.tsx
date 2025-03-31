
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import SignalBoardLayout from "../components/signalboard/SignalBoardLayout";
import SignalBoardPage from "../pages/signalboard/SignalBoardPage";
import ThreadDetailPage from "../pages/signalboard/ThreadDetailPage";
import ThreadCreationPage from "../pages/signalboard/ThreadCreationPage";

const SignalBoardRoutes = () => {
  return (
    <Routes>
      <Route path="signalboard" element={<SignalBoardLayout><SignalBoardPage /></SignalBoardLayout>} />
      <Route path="signalboard/thread/:threadId" element={<SignalBoardLayout><ThreadDetailPage /></SignalBoardLayout>} />
      <Route 
        path="signalboard/create" 
        element={
          <SignalBoardLayout>
            <ProtectedRoute>
              <ThreadCreationPage />
            </ProtectedRoute>
          </SignalBoardLayout>
        } 
      />
    </Routes>
  );
};

export default SignalBoardRoutes;

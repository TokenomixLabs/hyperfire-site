
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import SignalBoardLayout from "../components/signalboard/SignalBoardLayout";
import SignalBoardPage from "../pages/signalboard/SignalBoardPage";
import ThreadDetailPage from "../pages/signalboard/ThreadDetailPage";
import ThreadCreationPage from "../pages/signalboard/ThreadCreationPage";

const SignalBoardRoutes = () => {
  return (
    <SignalBoardLayout>
      <Routes>
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
      </Routes>
    </SignalBoardLayout>
  );
};

export default SignalBoardRoutes;

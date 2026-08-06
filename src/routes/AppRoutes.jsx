import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import Dashboard from "../features/dashboard/Dashboard";
import CandidateDashboard from "../features/candidate/CandidateDashboard";
import CandidateList from "../features/candidate/CandidateList";
import CandidateForm from "../features/candidate/CandidateForm";
import TestList from "../features/tests/TestList";
import TestForm from "../features/tests/TestForm";
import ResultList from "../features/results/ResultList";
import CandidateTest from "../features/candidate/CandidateTest";
import TestPackageManager from "../features/admin/test-packages/TestPackageManager";
import ResultsDashboard from "../features/admin/results/ResultsDashboard";
import ResultDetail from "../features/admin/results/ResultDetail";
import CandidateAssignments from "../features/candidate/CandidateAssignments";
import QuestionManager from "../features/admin/questions/QuestionManager";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/candidate-dashboard" replace />;

  return children;
};

const CandidateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "candidate") return <Navigate to="/dashboard" replace />;

  return children;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />

        <Route path="/candidates" element={<AdminRoute><CandidateList /></AdminRoute>} />
        <Route path="/candidates/create" element={<AdminRoute><CandidateForm /></AdminRoute>} />
        <Route path="/candidates/edit/:id" element={<AdminRoute><CandidateForm /></AdminRoute>} />

        <Route path="/tests" element={<AdminRoute><TestList /></AdminRoute>} />
        <Route path="/tests/create" element={<AdminRoute><TestForm /></AdminRoute>} />
        <Route path="/tests/edit/:id" element={<AdminRoute><TestForm /></AdminRoute>} />

        <Route path="/admin/test-packages" element={<AdminRoute><TestPackageManager /></AdminRoute>} />
        <Route path="/admin/test-packages/create" element={<AdminRoute><TestForm /></AdminRoute>} />
        <Route path="/admin/test-packages/edit/:id" element={<AdminRoute><TestForm /></AdminRoute>} />

        <Route path="/admin/questions" element={<AdminRoute><QuestionManager /></AdminRoute>} />

        <Route path="/results" element={<AdminRoute><ResultsDashboard /></AdminRoute>} />
        <Route path="/results/:id" element={<AdminRoute><ResultDetail /></AdminRoute>} />

        <Route path="/candidate-dashboard" element={<CandidateRoute><CandidateDashboard /></CandidateRoute>} />
        <Route path="/candidate/assignments" element={<CandidateRoute><CandidateAssignments /></CandidateRoute>} />
        <Route path="/candidate/test/:sessionId" element={<CandidateRoute><CandidateTest /></CandidateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
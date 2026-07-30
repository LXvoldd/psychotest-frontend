import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import Dashboard from "../features/dashboard/Dashboard";
import CandidateDashboard from "../features/candidate/CandidateDashboard";
import CandidateList from "../features/candidate/CandidateList";
import TestList from "../features/tests/TestList";
import ResultList from "../features/results/ResultList";
import CandidateTest from "../features/candidate/CandidateTest";

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

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/candidates"
          element={
            <AdminRoute>
              <CandidateList />
            </AdminRoute>
          }
        />

        <Route
          path="/tests"
          element={
            <AdminRoute>
              <TestList />
            </AdminRoute>
          }
        />

        <Route
          path="/results"
          element={
            <AdminRoute>
              <ResultList />
            </AdminRoute>
          }
        />

        <Route
          path="/candidate-dashboard"
          element={
            <CandidateRoute>
              <CandidateDashboard />
            </CandidateRoute>
          }
        />

        <Route
          path="/candidate/test/:sessionId"
          element={
            <CandidateRoute>
              <CandidateTest />
            </CandidateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
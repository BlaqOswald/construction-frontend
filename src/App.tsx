import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/projects";
import Tasks from "./pages/tasks";
import Materials from "./pages/materials";
import Subcontractors from "./pages/subcontractors";
import Reports from "./pages/reports";
import ProtectedRoute from "./pages/ProtectedRoute";
import { ProjectProvider } from "./context/context";

function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />

          <Route
            path="/projects"
            element={<ProtectedRoute><Projects /></ProtectedRoute>}
          />

          <Route
            path="/projects/:projectId/tasks"
            element={<ProtectedRoute><Tasks /></ProtectedRoute>}
          />

          <Route
            path="/projects/:projectId/materials"
            element={<ProtectedRoute><Materials /></ProtectedRoute>}
          />

          <Route
            path="/projects/:projectId/subcontractors"
            element={<ProtectedRoute><Subcontractors /></ProtectedRoute>}
          />

          <Route
            path="/projects/:projectId/reports"
            element={<ProtectedRoute><Reports /></ProtectedRoute>}
          />

          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;

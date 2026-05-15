import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/projects";
import Tasks from "./pages/tasks";
import Materials from "./pages/materials";
import Subcontractors from "./pages/subcontractors";
import Reports from "./pages/reports";
import Users from "./pages/users";
import SetPassword from "./pages/set-password";

import ProtectedRoute from "./pages/ProtectedRoute";
import { ProjectProvider } from "./context/ProjectContext";

function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>

          {/* DEFAULT ROUTE */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* USERS (ADMIN ONLY) */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* DASHBOARD (ALL LOGGED IN USERS) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "client"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* PROJECTS */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "client"]}>
                <Projects />
              </ProtectedRoute>
            }
          />

          {/* PROJECT-BASED ROUTES */}
          <Route
            path="/projects/:projectId/tasks"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "client"]}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:projectId/materials"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "client"]}>
                <Materials />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:projectId/subcontractors"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "client"]}>
                <Subcontractors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:projectId/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "client"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;
// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
} from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

// Authentication components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Dashboard components
import EmployeeDashboard from "./components/dashboard/EmployeeDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

// Context for global state
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

// -------------------- Navigation --------------------
const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === "Admin";
  const dashboardPath = isAdmin ? "/admin/dashboard" : "/employee/dashboard";

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Daily Work Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to={dashboardPath}>
                  Dashboard
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin/dashboard">
                    Admin
                  </Nav.Link>
                )}
                <Nav.Link onClick={logout} className="text-warning">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// -------------------- ProtectedRoute Wrapper --------------------
function ProtectedRoute({ requiredAdmin = false }) {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "Admin";

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredAdmin && !isAdmin)
    return <Navigate to="/employee/dashboard" replace />;

  if (!requiredAdmin && isAdmin)
    return <Navigate to="/admin/dashboard" replace />;

  return <Outlet />;
}

// -------------------- App Content --------------------
function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "Admin";

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root path redirection */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"}
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Employee Dashboard */}
          <Route element={<ProtectedRoute requiredAdmin={false} />}>
            <Route
              path="/employee/dashboard"
              element={<EmployeeDashboard />}
            />
          </Route>

          {/* Admin Dashboard */}
          <Route element={<ProtectedRoute requiredAdmin={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  isAuthenticated
                    ? isAdmin
                      ? "/admin/dashboard"
                      : "/employee/dashboard"
                    : "/login"
                }
                replace
              />
            }
          />
        </Routes>
      </Container>
    </>
  );
}

// -------------------- Root App --------------------
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

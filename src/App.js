// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
// Authentication components
import Login from './components/auth/Login'; 
import Register from './components/auth/Register';
// Dashboard component
import EmployeeDashboard from './components/dashboard/EmployeeDashboard'; 
// Context for global state
import { AuthProvider, useAuth } from './context/AuthContext'; 
import './App.css'; 

// --- Placeholder Component ---
// Renamed for clarity, and it renders the Admin Dashboard content
const AdminDashboard = () => <h2>Admin Dashboard - User Approval & Task Management</h2>;

// --- Navigation Component ---
const Navigation = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();

    // Determine the dashboard link based on role
    const dashboardPath = isAdmin ? '/admin' : '/employee/dashboard';

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">Daily Work Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto"> 
                        {isAuthenticated ? (
                            <>
                                {/* Dashboard link uses the determined path */}
                                <Nav.Link as={Link} to={dashboardPath}>Dashboard</Nav.Link>
                                
                                {/* Admin link uses the simpler /admin path */}
                                {isAdmin && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>} 
                                
                                <Nav.Link onClick={logout} className="text-warning">Logout</Nav.Link> 
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

// --- App Content with Routing Logic ---
function AppContent() {
    const { isAuthenticated, isAdmin } = useAuth();
    
    // Component to protect routes based on auth status and role
    const ProtectedRoute = ({ element, requiredAuth = true, requiredAdmin = false }) => {
        if (requiredAuth && !isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        if (requiredAdmin && !isAdmin) {
            // Redirect non-admins away from the admin page
            return <Navigate to="/employee/dashboard" replace />;
        }
        return element;
    };

    return (
        <>
            <Navigation />
            <Container className="mt-4"> 
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Root path redirects based on auth state */}
                    <Route 
                        path="/" 
                        // Default redirection logic for logged in users
                        element={isAuthenticated 
                            ? <Navigate to={isAdmin ? "/admin" : "/employee/dashboard"} replace /> 
                            : <Navigate to="/login" replace />
                        } 
                    />

                    {/* Protected Routes: Employee Dashboard */}
                    <Route 
                        path="/employee/dashboard" 
                        element={<ProtectedRoute element={<EmployeeDashboard />} />} 
                    />

                    {/* Protected Routes: Admin Panel */}
                    <Route 
                        path="/admin" 
                        element={<ProtectedRoute element={<AdminDashboard />} requiredAdmin={true} />} 
                    />
                    
                    {/* Catch-all route to redirect back to login or their respective dashboard */}
                    <Route path="*" element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin" : "/employee/dashboard") : "/login"} replace />} />
                </Routes>
            </Container>
        </>
    );
}


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

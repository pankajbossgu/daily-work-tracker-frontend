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

// --- Placeholder Component (Corrected Name) ---
// This will render when you hit /admin/dashboard
const AdminDashboard = () => <h2>Admin Dashboard - User Approval & Task Management</h2>;

// --- Navigation Component ---
// Uses the useAuth hook to determine which links to show
const Navigation = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">Daily Work Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto"> {/* Use ms-auto to push links to the right */}
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                                {/* FIX 1: Updated link to match the dashboard path */}
                                {isAdmin && <Nav.Link as={Link} to="/admin/dashboard">Admin</Nav.Link>} 
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
            return <Navigate to="/dashboard" replace />;
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
                        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
                    />

                    {/* Protected Routes */}
                    <Route 
                        path="/employee/dashboard" 
                        element={<ProtectedRoute element={<EmployeeDashboard />} />} 
                    />

                    {/* FIX 2 & 3: Updated path to match the login redirect, and using the new component name */}
                    <Route 
                        path="/admin/dashboard" 
                        element={<ProtectedRoute element={<AdminDashboard />} requiredAdmin={true} />} 
                    />

                    {/* Default Catch-all */}
                    <Route path="*" element={<h2>404 Not Found</h2>} />
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

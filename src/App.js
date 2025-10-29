// src/App.js (LOCAL FILE UPDATE)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
// IMPORT NEW COMPONENTS
import Login from './components/auth/Login'; 
import Register from './components/auth/Register';
// IMPORT CONTEXT
import { AuthProvider, useAuth } from './context/AuthContext'; 
import './App.css'; 

// --- Placeholder Components (Keep these for now) ---
const Dashboard = () => <h2>Employee Dashboard - Time Logging & Personal Logs</h2>;
const AdminPanel = () => <h2>Admin Panel - User Approval & Task Management</h2>;

// --- Navigation Component (Extracted for clarity) ---
const Navigation = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Daily Work Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                                {isAdmin && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
                                <Nav.Link onClick={logout}>Logout</Nav.Link> {/* Use actual logout function */}
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

// --- Main App Component ---
function AppContent() {
    const { isAuthenticated, isAdmin } = useAuth();
    
    // Simple Protected Route Component
    const ProtectedRoute = ({ element, requiredAuth = true, requiredAdmin = false }) => {
        if (requiredAuth && !isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        if (requiredAdmin && !isAdmin) {
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
                    <Route path="/login" element={<Login />} />  {/* Use actual Login component */}
                    <Route path="/register" element={<Register />} /> {/* Use actual Register component */}
                    
                    {/* Redirect root based on auth state */}
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} requiredAdmin={true} />} />

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
            <AuthProvider> {/* Wrap the entire application content with the AuthProvider */}
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;

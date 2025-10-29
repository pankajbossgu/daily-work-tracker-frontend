// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
// Authentication components
import Login from './components/auth/Login'; 
import Register from './components/auth/Register';
// Dashboard components
import EmployeeDashboard from './components/dashboard/EmployeeDashboard'; 
// FIX APPLIED: Corrected import path to match the user's file location
import AdminDashboard from './components/dashboard/AdminDashboard'; 
// Context for global state
import { AuthProvider, useAuth } from './context/AuthContext'; 
import './App.css'; 

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
    const ProtectedRoute = ({ requiredAdmin = false }) => {
        // 1. If not authenticated, redirect to login (highest priority check)
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        
        // 2. If admin is required and user ISN'T admin, redirect to employee dashboard
        if (requiredAdmin && !isAdmin) {
            return <Navigate to="/employee/dashboard" replace />;
        }
        
        // 3. If this is the employee route (requiredAdmin=false) 
        //    AND the user IS an admin, redirect them to the admin dashboard on refresh/access
        if (!requiredAdmin && isAdmin) {
             return <Navigate to="/admin" replace />;
        }

        // 4. Otherwise, the user is authorized for this path, render the child route
        return <Outlet />;
    };

    return (
        <>
            <Navigation />
            <Container className="mt-4"> 
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Root path redirection: 
                        If authenticated, send to their respective dashboard.
                        If not, send to login.
                    */}
                    <Route 
                        path="/" 
                        element={
                            isAuthenticated 
                            ? <Navigate to={isAdmin ? "/admin" : "/employee/dashboard"} replace /> 
                            : <Navigate to="/login" replace />
                        } 
                    />

                    {/* ----------------------------------------------------- */}
                    {/* Protected Routes (using the Outlet pattern) */}
                    {/* ----------------------------------------------------- */}

                    {/* 1. EMPLOYEE DASHBOARD (Not requiredAdmin) */}
                    <Route element={<ProtectedRoute requiredAdmin={false} />}>
                        <Route 
                            path="/employee/dashboard" 
                            element={<EmployeeDashboard />} 
                        />
                    </Route>

                    {/* 2. ADMIN PANEL (Required Admin) */}
                    <Route element={<ProtectedRoute requiredAdmin={true} />}>
                        <Route 
                            path="/admin" 
                            element={<AdminDashboard />} 
                        />
                    </Route>
                    
                    {/* Catch-all route for unknown paths */}
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

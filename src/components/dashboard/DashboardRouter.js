// src/components/dashboard/DashboardRouter.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Alert } from 'react-bootstrap';
import EmployeeDashboard from './EmployeeDashboard';
import AdminDashboard from './AdminDashboard';

/**
 * Component responsible for displaying the correct dashboard based on the user's role.
 */
const DashboardRouter = () => {
    const { user } = useAuth();
    const role = user?.role;

    if (!role) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">
                    Error: Could not determine user role. Please try logging in again.
                </Alert>
            </Container>
        );
    }

    // Conditional rendering based on the role
    switch (role) {
        case 'Admin':
            return <AdminDashboard />;
        case 'Employee':
            return <EmployeeDashboard />;
        default:
            return (
                <Container className="mt-5">
                    <Alert variant="danger">
                        Unknown user role: {role}. Access denied.
                    </Alert>
                </Container>
            );
    }
};

export default DashboardRouter;

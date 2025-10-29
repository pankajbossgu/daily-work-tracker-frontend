// src/components/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Alert, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement'; 
import TaskAssignment from './TaskAssignment'; 

const AdminDashboard = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Function to fetch ALL users (for management/reporting)
    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            // NOTE: This endpoint likely needs to be created on the backend (e.g., /api/admin/users)
            const response = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch users for admin:', err);
            // It's common to get 404/500 here if the backend route is missing
            setError('Failed to load user data. (Hint: Create the backend route /api/admin/users)');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAllUsers();
        }
    }, [token]);

    if (loading) {
        return <Container className="mt-5"><p>Loading Admin Dashboard data...</p></Container>;
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Admin Dashboard - User Approval & Task Management</h1>
            {error && <Alert variant="danger">{error}</Alert>}

            <Tabs defaultActiveKey="users" id="admin-dashboard-tabs" className="mb-3">
                
                {/* 1. USER MANAGEMENT TAB */}
                <Tab eventKey="users" title="User Management & Approval">
                    <UserManagement 
                        users={users} 
                        token={token} 
                        onUserUpdate={fetchAllUsers} 
                    />
                </Tab>

                {/* 2. TASK ASSIGNMENT TAB */}
                <Tab eventKey="tasks" title="Assign New Tasks">
                    <TaskAssignment 
                        users={users}
                        token={token}
                    />
                </Tab>

                {/* 3. REPORTING (Placeholder) */}
                <Tab eventKey="reports" title="Activity Reports" disabled>
                    <Alert variant="info" className="mt-3">
                        This section will show aggregated daily logs and user reports once backend routes are implemented.
                    </Alert>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AdminDashboard;

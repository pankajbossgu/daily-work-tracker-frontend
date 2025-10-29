// src/components/dashboard/UserManagement.js
import React from 'react';
import { Card, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios'; // <-- REQUIRED: Import axios for API calls

/**
 * Renders the User Management dashboard for Admins.
 * It displays pending and approved users and provides an 'Approve' action.
 * * @param {Array} users - The list of all users fetched from the backend.
 * @param {string} token - The authorization token for the API calls.
 * @param {function} onUserUpdate - A callback function to refresh the user list after an action.
 */
const UserManagement = ({ users, token, onUserUpdate }) => {
    
    // Function to handle the approval API call to the new backend route
    const handleApprove = async (userId) => {
        // Use a custom modal or window.confirm, as per previous instructions
        if (!window.confirm(`Are you sure you want to approve user ID ${userId}?`)) {
            return; // User cancelled
        }
        
        try {
            // API call to the new backend route defined in your Canvas (PUT /api/admin/users/:userId/approve)
            await axios.put(`/api/admin/users/${userId}/approve`, {}, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            
            // Success: Notify user and refresh the list via the parent component
            window.alert(`User ${userId} approved successfully!`);
            onUserUpdate(); 
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to approve user. Check the backend server.';
            console.error('Approval failed:', errorMessage);
            window.alert(errorMessage);
        }
    };
    
    // Filter users for display: Pending users first, then others (Approved)
    const pendingUsers = users.filter(u => u.status === 'Pending');
    const approvedUsers = users.filter(u => u.status !== 'Pending');

    return (
        <Card className="shadow-sm mt-3">
            <Card.Body>
                <Card.Title>Users & Approval Status</Card.Title>
                
                {/* Pending Users Section: Highlighted for Admin action */}
                <h4 className="text-warning">Pending for Approval ({pendingUsers.length})</h4>
                <Table striped bordered hover size="sm" className="mb-4">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.length > 0 ? pendingUsers.map(user => (
                            <tr key={user.user_id} className="table-warning">
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td><span className="fw-bold">{user.status}</span></td>
                                <td>
                                    <Button 
                                        variant="success" 
                                        size="sm" 
                                        // Attach the new handler to the button
                                        onClick={() => handleApprove(user.user_id)}
                                    >
                                        Approve
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center">No users currently pending approval.</td></tr>
                        )}
                    </tbody>
                </Table>
                
                {/* Approved Users Section */}
                <h4 className="mt-4">Approved Users ({approvedUsers.length})</h4>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedUsers.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td><span className="text-success">{user.status}</span></td>
                                <td>-</td> 
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </Card.Body>
        </Card>
    );
};

export default UserManagement;

// src/components/dashboard/UserManagement.js
import React from 'react';
import { Card, Button, Table, Alert } from 'react-bootstrap';

const UserManagement = ({ users, token, onUserUpdate }) => {
    // This is the placeholder for approving users and viewing their status
    
    return (
        <Card className="shadow-sm mt-3">
            <Card.Body>
                <Card.Title>Users & Approval Status</Card.Title>
                <Alert variant="warning">
                    **Backend API Required:** The full user list and approval functionality require the `/api/admin/users` route and logic to be fully implemented on the backend.
                </Alert>
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
                        {users.length > 0 ? users.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.status}</td>
                                <td>
                                    {user.status === 'Pending' && (
                                        <Button variant="success" size="sm" /*onClick={() => handleApprove(user.user_id)}*/>
                                            Approve
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center">No users found.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default UserManagement;

// src/components/dashboard/TaskAssignment.js
import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const TaskAssignment = ({ users, token }) => {
    // This is the placeholder for the task assignment form
    
    return (
        <Card className="shadow-sm mt-3">
            <Card.Body>
                <Card.Title>Assign a New Task</Card.Title>
                <Alert variant="warning">
                    **Backend API Required:** Task creation requires the backend route and logic (e.g., POST to `/api/admin/tasks`) to be implemented.
                </Alert>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Task Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Describe the task..." />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Assign to Employee</Form.Label>
                        <Form.Control as="select">
                            <option>Select Employee (Filter by role 'Employee')</option>
                            {users.filter(u => u.role === 'Employee').map(user => (
                                <option key={user.user_id} value={user.user_id}>{user.email}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Assign Task
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TaskAssignment;

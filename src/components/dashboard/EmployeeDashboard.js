// src/components/dashboard/EmployeeDashboard.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import TimeLogForm from './TimeLogForm'; 
import PersonalLogHistory from './PersonalLogHistory'; 

const EmployeeDashboard = () => {
    const { user, token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Function to fetch active tasks
    const fetchActiveTasks = async () => {
        try {
            // FIX APPLIED: Corrected endpoint to match logRoutes.js: GET /api/logs/tasks
            const response = await axios.get('/api/logs/tasks', { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (err) {
            // Updated error message to be more informative
            setError('Failed to load tasks. Please ensure the backend is running and the API is accessible.');
            console.error('Task fetch error:', err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchActiveTasks();
        }
    }, [token]);

    if (loading) {
        return <Container className="mt-5"><p>Loading dashboard...</p></Container>;
    }

    if (error) {
        return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Welcome, {user?.email}!</h1>
            <Row>
                <Col md={12} lg={6} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-primary">Submit Daily Log</Card.Title>
                            <TimeLogForm 
                                tasks={tasks} 
                                token={token} 
                                onLogSuccess={() => {
                                    console.log('Time log submitted, dashboard needs refresh!');
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={12} lg={6} className="mb-4">
                    <Tabs defaultActiveKey="history" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="history" title="Your Log History">
                            <PersonalLogHistory 
                                user={user} 
                                token={token} 
                            />
                        </Tab>
                        <Tab eventKey="tasks" title="Available Tasks">
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>Active Tasks</Card.Title>
                                    <ul>
                                        {tasks.length > 0 ? (
                                            tasks.map(task => (
                                                <li key={task.task_id}>{task.task_name}</li>
                                            ))
                                        ) : (
                                            <p className="text-muted">No active tasks available. Contact your administrator.</p>
                                        )}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default EmployeeDashboard;

// src/components/dashboard/EmployeeDashboard.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import TimeLogForm from './TimeLogForm'; // Will create this next
import PersonalLogHistory from './PersonalLogHistory'; // Will create this next

const EmployeeDashboard = () => {
    // NOTE: apiBaseUrl is correctly defined as '' in AuthContext after proxy setup, so it resolves to http://localhost:3001
    const { user, token } = useAuth(); // Removed apiBaseUrl as it's not needed directly here if proxy is set
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Function to fetch active tasks
    const fetchActiveTasks = async () => {
        try {
            // FIX APPLIED: Changed endpoint from /admin/tasks/active to the correct /api/logs/tasks
            const response = await axios.get(`/api/logs/tasks`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (err) {
            // Revert error message to default if needed, as the server error is now known to be fixed
            setError('Failed to load tasks. Please check server connection.');
            console.error('Task fetch error:', err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // We only fetch if the user and token exist (meaning they are logged in)
        if (user && token) { 
            fetchActiveTasks();
        }
    }, [user, token]); // Added user to dependencies just in case

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
                {/* Time Logging Section */}
                <Col md={12} lg={6} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-primary">Submit Daily Log</Card.Title>
                            {/* Pass only tasks and token */}
                            <TimeLogForm 
                                tasks={tasks} 
                                token={token} 
                                onLogSuccess={() => {
                                    // Placeholder: This prop will be used to refresh log history
                                    console.log('Time log submitted, dashboard needs refresh!');
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Tabs for History and Tasks */}
                <Col md={12} lg={6} className="mb-4">
                    <Tabs defaultActiveKey="history" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="history" title="Your Log History">
                            {/* PersonalLogHistory will need to fetch logs from /api/logs */}
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

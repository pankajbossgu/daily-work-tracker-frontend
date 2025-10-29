// src/components/dashboard/PersonalLogHistory.js

import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

// NOTE: apiBaseUrl removed from props as it's not needed with the proxy setup
const PersonalLogHistory = ({ token }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            // FIX APPLIED: Corrected endpoint to match logRoutes.js: GET /api/logs
            const response = await axios.get(`/api/logs`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data); 
        } catch (err) {
            console.error('Log fetch error:', err.response?.data || err.message);
            setError('Failed to load log history.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch logs on component mount
    useEffect(() => {
        if (token) {
            fetchLogs();
        }
    }, [token]);
    
    // --- Helper Functions ---
    // Adapted to handle 'hours_logged' (float) as returned by the backend query
    const formatHours = (hours) => {
        if (typeof hours !== 'number' || isNaN(hours)) return '0.0h';
        return `${hours.toFixed(1)}h`;
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        // Using toLocaleDateString() to format the date part (e.g., 10/29/2025)
        return date.toLocaleDateString();
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="text-center p-5"><Spinner animation="border" size="sm" /> Loading History...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Card className="shadow-sm">
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {logs.length === 0 ? (
                    <Alert variant="info">No log history found. Submit your first work log!</Alert>
                ) : (
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Task</th>
                                <th>Time Spent</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.log_id}>
                                    <td>{formatDate(log.work_date)}</td>
                                    <td>{log.task_name}</td>
                                    {/* Using log.hours_logged from the backend query */}
                                    <td>{formatHours(log.hours_logged)}</td> 
                                    <td>{log.description.substring(0, 50)}...</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default PersonalLogHistory;

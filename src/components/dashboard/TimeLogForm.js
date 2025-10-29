// src/components/dashboard/TimeLogForm.js

import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

// NOTE: apiBaseUrl removed from props as it's not needed with the proxy setup
const TimeLogForm = ({ tasks, token, onLogSuccess }) => {
    const [task, setTask] = useState('');
    const [timeSpent, setTimeSpent] = useState(''); // Time in hours
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Basic validation
        if (!task || !timeSpent || !description) {
            setError('All fields are required.');
            return;
        }

        // We will send timeSpent directly as a float for clarity
        const hoursLogged = parseFloat(timeSpent);

        if (isNaN(hoursLogged) || hoursLogged <= 0) {
            setError('Please enter a valid time spent in hours (e.g., 2.5).');
            return;
        }
        
        setLoading(true);

        try {
            // FIX APPLIED: Corrected endpoint to match logRoutes.js: POST /api/logs/log
            await axios.post(`/api/logs/log`, {
                task_id: parseInt(task), // Task ID from the dropdown
                hours_logged: hoursLogged,
                description,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Time log submitted successfully!');
            // Reset form fields
            setTask('');
            setTimeSpent('');
            setDescription('');
            onLogSuccess(); // Tell the parent component to refresh the history

        } catch (err) {
            console.error('Time log submission error:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Failed to submit log. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            
            {/* Task Selection */}
            <Form.Group className="mb-3" controlId="formTask">
                <Form.Label>Select Task</Form.Label>
                <Form.Control 
                    as="select" 
                    value={task} 
                    onChange={(e) => setTask(e.target.value)} 
                    required
                >
                    <option value="">Choose...</option>
                    {tasks.map((t) => (
                        <option key={t.task_id} value={t.task_id}>{t.task_name}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Row>
                {/* Time Spent Input */}
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="formTimeSpent">
                        <Form.Label>Time Spent (Hours)</Form.Label>
                        <Form.Control 
                            type="number" 
                            step="0.5" 
                            placeholder="e.g., 2.5" 
                            value={timeSpent} 
                            onChange={(e) => setTimeSpent(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Description */}
            <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description / Details</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Details about the work performed." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Work Log'}
            </Button>
        </Form>
    );
};

export default TimeLogForm;

// src/components/dashboard/PersonalLogHistory.js

import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const PersonalLogHistory = ({ token, apiBaseUrl }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${apiBaseUrl}/timelogs/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Logs are sorted descending by log_date_time in the backend
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
    const formatMinutesToHours = (minutes) => {
        if (!minutes || minutes === 0) return '0h';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                                <th>Date & Time</th>
                                <th>Task</th>
                                <th>Time Spent</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.log_id}>
                                    <td>{formatDate(log.log_date_time)}</td>
                                    <td>{log.task_name}</td>
                                    <td>{formatMinutesToHours(log.time_spent_minutes)}</td>
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
```
4.  Add a commit message (e.g., **`Feat: Create PersonalLogHistory component`**) and click **"Commit new file."**

---

## 3. Restart the Frontend Server

Now that all three dashboard components (`EmployeeDashboard`, `TimeLogForm`, `PersonalLogHistory`) exist, the compilation should succeed.

1.  **Stop the Frontend Server:** In the CMD window running the frontend, press **`Ctrl + C`**.
2.  **Run Git Pull:** Since you created the files on GitHub, you need to pull them locally again.
    ```bash
    git pull
    ```
3.  **Start the Server:**
    ```bash
    npx react-scripts start
    

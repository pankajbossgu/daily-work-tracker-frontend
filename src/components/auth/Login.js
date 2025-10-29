// src/components/auth/Login.js

import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// --- TEMPORARY FIX: HARDCODE THE CORRECT BACKEND URL ---
// This ensures the request hits your Node.js server running on port 3000
const LOGIN_ENDPOINT = 'http://localhost:3000/api/users/login';
// --------------------------------------------------------

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // We remove 'apiBaseUrl' from the destructuring for this test
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // FIX APPLIED: Using the hardcoded full URL
            const response = await axios.post(LOGIN_ENDPOINT, { 
                email,
                password,
            });

            // Extract necessary data from the response payload
            // Note: The backend now returns { token, role, user_id, email, message }
            const { token, role, user_id, email: userEmail } = response.data;
            
            // Update global state
            login(token, { user_id, email: userEmail, role });
            
            // Navigate based on role (standard practice)
            if (role === 'Admin') {
                navigate('/admin/dashboard'); 
            } else {
                navigate('/employee/dashboard'); 
            }

        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            // Use the specific error message from the backend if available
            setError(err.response?.data?.message || 'Failed to login. Check credentials or approval status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg p-3 mx-auto" style={{ maxWidth: '400px' }}>
            <Card.Body>
                <h2 className="text-center mb-4">Employee Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Logging In...' : 'Login'}
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    Need an account? <a href="/register">Register Here</a>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Login;

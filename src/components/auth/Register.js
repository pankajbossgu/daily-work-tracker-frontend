// src/components/auth/Register.js

import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { apiBaseUrl } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await axios.post(`${apiBaseUrl}/users/register`, {
                email,
                password,
            });

            setMessage('Registration successful! Please wait for an administrator to approve your account.');
            // Optionally redirect after a delay
            setTimeout(() => navigate('/login'), 5000); 

        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg p-3 mx-auto" style={{ maxWidth: '400px' }}>
            <Card.Body>
                <h2 className="text-center mb-4">Employee Registration</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
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
                        <Form.Text className="text-muted">
                            Your account requires admin approval before you can log in.
                        </Form.Text>
                    </Form.Group>
                    
                    <Button variant="success" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    Already have an account? <a href="/login">Login Here</a>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Register;

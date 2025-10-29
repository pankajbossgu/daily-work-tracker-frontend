// src/components/auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('http://localhost:3005/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.user); // store user in context/localStorage
      // redirect by role
      if ((data.user.role || '').toLowerCase() === 'admin') navigate('/admin/dashboard');
      else navigate('/employee/dashboard');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h3 className="mb-3 text-center">Login</h3>
      {err && <Alert variant="danger">{err}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </Form.Group>
        <Button type="submit" className="w-100">Login</Button>
      </Form>
    </Card>
  );
}

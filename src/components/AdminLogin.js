import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Default password - you can change this
  const ADMIN_PASSWORD = 'golf2026';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Header as="h5">Admin Login</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
              <Form.Text className="text-muted">
                Default password: golf2026
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminLogin;

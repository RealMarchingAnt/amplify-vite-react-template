import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

interface CreateTodoProps {
  newTodo: string;
  validateTodo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  createTodo: () => void;
}

const CreateTodo: React.FC<CreateTodoProps> = ({ newTodo, validateTodo, createTodo }) => (
  <Row>
    <Col md={6}>
      <Form.Control type="text" value={newTodo} onChange={validateTodo} placeholder="Enter todo" />
    </Col>
    <Col md={{ span: 2, offset: 4 }}>
      <Button variant="primary" onClick={createTodo}>Create</Button>{' '}
    </Col>
  </Row>
);

export default CreateTodo;
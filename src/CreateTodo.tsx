import React from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

interface CreateTodoProps {
  newTodo: string;
  validateTodo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  createTodo: () => void;
}

const CreateTodo: React.FC<CreateTodoProps> = ({ newTodo, validateTodo, createTodo }) => (
  <Row className="align-items-center">
    <Col md={{ span: 8, offset: 2 }}>
      <InputGroup>
        <Form.Control
          type="text"
          value={newTodo}
          onChange={validateTodo}
          placeholder="Enter a new todo"
        />
        <Button variant="primary" onClick={createTodo}>
          Add Todo
        </Button>
      </InputGroup>
    </Col>
  </Row>
);

export default CreateTodo;
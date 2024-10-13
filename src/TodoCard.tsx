import React from 'react';
import { Card, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TodoCardProps {
  todo: {
    id: string;
    content?: any;
    isDone: boolean;
  };
  updateTodo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteTodoWithConfirmation: (id: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, updateTodo, deleteTodoWithConfirmation }) => (
  <Card key={todo.id} className={`mb-3 ${todo.isDone ? 'bg-light text-muted' : ''}`}>
    <Card.Body className="d-flex flex-wrap align-items-center">
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${todo.id}`}>Mark as done</Tooltip>}
      >
        <Form.Check
          type={'checkbox'}
          id={`${todo.id}`}
          defaultChecked={todo.isDone ? true : false}
          onChange={updateTodo}
          className="me-2"
        />
      </OverlayTrigger>
      <div className={`flex-grow-1 ${todo.isDone ? 'text-decoration-line-through' : ''}`}>
        {todo.content}
      </div>
      <Button variant="danger" onClick={() => deleteTodoWithConfirmation(todo.id)} className="ms-auto">
        Delete
      </Button>
    </Card.Body>
  </Card>
);

export default TodoCard;
// Import the necessary libraries
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from "react";

// Amplify components
import { Authenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { fetchUserAttributes } from 'aws-amplify/auth';

// Bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';

// Custom components
import Title from "./Title";
import CreateTodo from "./CreateTodo";
import NavBar from "./NavBar";
import Footer from "./Footer";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [userAttributes, setUserAttributes] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data: any) => setTodos([...data.items]),
    });
    fetchUserAttributes().then((data) => {
      setUserAttributes(data);
      setLoading(false);
    });
  }, []);

  function createTodo() {
    if (!newTodo) return;
    client.models.Todo.create({ content: newTodo, isDone: false });
    setNewTodo("");
  }

  function validateTodo(e: React.ChangeEvent<HTMLInputElement>) {
    setNewTodo(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createTodo();
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  async function updateTodo(e: React.ChangeEvent<HTMLInputElement>) {
    const todo = {
      id: e.target.id,
      isDone: e.target.checked
    };
    client.models.Todo.update(todo);
  }

  return (
    <Authenticator>
      {({ signOut = () => {} }) => (
        <main>
          {loading ? (
            <Container fluid>
              <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center bg-white justify-content-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </Container>
          ) : (
            <>
              <Container fluid className="p-3">
                <NavBar username={userAttributes?.preferred_username} signOut={signOut} />
                <Form onSubmit={handleSubmit} className="mb-4">
                  <Title username={userAttributes?.preferred_username} />
                  <CreateTodo newTodo={newTodo} validateTodo={validateTodo} createTodo={createTodo} />
                </Form>
                <Row className="mb-3 d-flex align-items-center">
                  <Col sm={1}><h4>Done?</h4></Col>
                  <Col sm={8}><h4>Todo</h4></Col>
                  <Col sm={3}><h4>Action</h4></Col>
                </Row>
                {todos.map((todo) => (
                  <Card key={todo.id} className="mb-3">
                    <Card.Body>
                      <Row className="d-flex align-items-center">
                        <Col sm={1}>
                          <Form.Check
                            type={'checkbox'}
                            id={`${todo.id}`}
                            defaultChecked={todo.isDone ? true : false}
                            onChange={updateTodo}
                          />
                        </Col>
                        <Col sm={8}>{todo.content}</Col>
                        <Col sm={3} className="text-end">
                          <Button variant="danger" onClick={() => deleteTodo(todo.id)}>Delete</Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Footer />
              </Container>
            </>
          )}
        </main>
      )}
    </Authenticator>
  );
}

export default App;

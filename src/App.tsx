import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { fetchUserAttributes } from 'aws-amplify/auth';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [userAttributes, setUserAttributes] = useState<any>();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data: any) => setTodos([...data.items]),
    });
    fetchUserAttributes().then((data) => setUserAttributes(data));
  }, []);

  function createTodo() {
    if (!newTodo) return;
    client.models.Todo.create({ content: newTodo, isDone: false });
    setNewTodo("");
  }

  function validateTodo(e: React.ChangeEvent<HTMLInputElement>) {
    // TODO do some basic validation
    setNewTodo(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {''
    // Prevent the browser from reloading the page
    e.preventDefault();
    createTodo();
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  async function updateTodo(e: React.FormEvent<HTMLFormElement>) {
    const todo = {
      id: e.target.id,
      isDone: e.target.checked
    };
    client.models.Todo.update(todo);
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
          <main>
            <Container>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <h1>{userAttributes?.preferred_username}'s todos</h1>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Control type="text" value={newTodo} onChange={validateTodo} placeholder="Enter todo" />
                </Col>
                <Col md={{ span: 2, offset: 4 }}>
                  <Button variant="primary" onClick={createTodo}>Create</Button>{' '}
                </Col>
              </Row>
              </form>
              <br />
              {todos.map((todo) => (
                <Row key={todo.id} >
                  <Col md={7}>{todo.content}</Col>
                  <Col md={1}>
                  <Form.Check // prettier-ignore
                    type={'checkbox'}
                    id={`${todo.id}`}
                    label={`Done`}
                    defaultChecked={todo.isDone}
                    onChange={updateTodo}
                  />
                  </Col>
                  <Col md={{ span: 2, offset: 2 }}>
                    <Button variant="danger" onClick={() => deleteTodo(todo.id)}>Delete</Button>{' '}
                  </Col>
                </Row>
              ))}
            </Container>


            <div>
              🥳 Welcome {userAttributes?.preferred_username}! Try creating a new todo.
              <br />
              <br />
            </div>
            <Button onClick={signOut}>Sign out</Button>
          </main>

      )}
    </Authenticator>
  )
}

export default App;

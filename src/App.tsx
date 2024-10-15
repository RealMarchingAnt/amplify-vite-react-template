// Import the necessary libraries
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Spinner, Button, InputGroup, Row, Col } from 'react-bootstrap';

// Amplify components
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { fetchUserAttributes } from 'aws-amplify/auth';

// Custom components
import Title from './Title';
import CreateTodo from './CreateTodo';
import NavBar from './NavBar';
import Footer from './Footer';
import TodoCard from './TodoCard'; // Import the new TodoCard component

const client = generateClient<Schema>();


function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterByDone, setFilterByDone] = useState<boolean>(false);
  const [userAttributes, setUserAttributes] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      client.models.Todo.observeQuery().subscribe({
        next: (data: any) => setTodos([...data.items]),
      });
      client.queries.sayHello({ name: "Amplify" }).then((data) => console.log(data));
      fetchUserAttributes().then((data) => {
        setUserAttributes(data);
        setLoading(false);
      });
      return;
    }
  }, []);

  useEffect(() => {
    searchTodos();
  }, [filterByDone, searchTerm]);

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

  function deleteTodoWithConfirmation(id: string) {
    const confirmed = window.confirm("Are you sure you want to delete this todo?");
    if (confirmed) {
      deleteTodo(id);
    }
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

  async function searchTodos() {

    if (!searchTerm) {
      // If search term is empty, fetch all todos
      if (filterByDone) {
        const data = await client.models.Todo.list({ filter: { isDone: { eq: filterByDone } } });
        setTodos(data.data);
      } else {
        const data = await client.models.Todo.list();
        setTodos(data.data);
      }
    } else {
      // Query the backend with the search term
      if (filterByDone) {
        const data = await client.models.Todo.list({
          filter: {
            content: {
              contains: searchTerm
            },
            isDone: {
              eq: filterByDone
            }
          }
        });
        setTodos(data.data);
      } else {
        const data = await client.models.Todo.list({
          filter: {
            content: {
              contains: searchTerm
            }
          }
        });
        setTodos(data.data);
      }
    }
  }

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);

  }

  function clearSearch() {
    setSearchTerm("");

  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchTodos();
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
                <Form className="mb-4" onSubmit={handleSearchSubmit}>
                  <Form.Group controlId="search" as={Row}>
                    <Col xs={8}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          value={searchTerm}
                          placeholder="Search todos"
                          onChange={handleSearchInput}
                        />
                        <Button variant="primary" type="submit">
                          Search
                        </Button>
                        <Button variant="secondary" onClick={() => clearSearch()}>
                          Clear
                        </Button>
                      </InputGroup>
                    </Col>
                    <Col xs={4}>
                      <Form.Check // prettier-ignore
                          type="switch"
                          id="filterByDone"
                          defaultChecked={filterByDone}
                          onChange={() => setFilterByDone((prev) => !prev)}
                          label="Filter by done"
                        />
                    </Col>
                  </Form.Group>
                </Form>
                {todos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={{ ...todo, isDone: todo.isDone ?? false }}
                      updateTodo={updateTodo}
                      deleteTodoWithConfirmation={deleteTodoWithConfirmation}
                    />
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

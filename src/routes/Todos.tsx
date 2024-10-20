import React, { useEffect, useState } from 'react';

import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';

// Custom components
import Title from '../components/Title';
import CreateTodo from '../components/CreateTodo';
import TodoCard from '../components/TodoCard'; // Import the new TodoCard component
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

// export const loader = ({ params }: { params: { username: string } }) => {
//     const userName = params.username;
//     return { userName };
// }

// export const loader = ({ params }: LoaderFunctionArgs) => {
//     const userName = params.username;
//     return { userName };
// }

export async function loader({ params }: LoaderFunctionArgs) {
    const userName = params.username;
    return { username: userName };
}

interface TodosProps {
}

const client = generateClient<Schema>();

const Todos: React.FC<TodosProps> = () => {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const [newTodo, setNewTodo] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterByDone, setFilterByDone] = useState<boolean>(false);
    // const username = useLoaderData().userName;
    // const username = "test";
    const { username } = useLoaderData() as { username: string };

    useEffect(() => {
          client.models.Todo.observeQuery().subscribe({
            next: (data: any) => setTodos([...data.items]),
          });
          return;
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
        <>
            <Form onSubmit={handleSubmit} className="mb-4">
                <Title username={username} />
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
        </>
    );
};

export default Todos;
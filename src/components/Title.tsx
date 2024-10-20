import React from 'react';
import { Row, Col } from 'react-bootstrap';

interface TitleProps {
  username: string;
}

const Title: React.FC<TitleProps> = ({ username }) => (
  <Row>
    <Col sm={12}>
      <h1>{username}'s todos</h1>
    </Col>
    <Col sm={12}>
      <p>Manage your todos</p>
      🥳 Welcome {username}! Try creating a new todo.
    </Col>
  </Row>
);

export default Title;
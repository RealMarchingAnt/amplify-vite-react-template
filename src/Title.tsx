import React from 'react';
import { Row, Col } from 'react-bootstrap';

interface TitleProps {
  username: string;
}

const Title: React.FC<TitleProps> = ({ username }) => (
  <Row>
    <Col md={12}>
      <h1>{username}'s todos</h1>
    </Col>
  </Row>
);

export default Title;
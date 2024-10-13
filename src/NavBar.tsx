import { Navbar, Nav } from "react-bootstrap";

interface NavBarProps {
  username: string;
  signOut: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ username, signOut }) => (
  <Navbar bg="white" variant="light" fixed="top" expand="sm" className="w-100">
    <Navbar.Brand href="#home">
      <img
        src="/logo.svg"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="Todos"
      />
      <span className="ml-2">Todos</span>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
      <Nav className="mr-auto">
        <Navbar.Text>
          Logged in as {username}
        </Navbar.Text>
        <Nav.Link role="button" onClick={signOut}>Sign out</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
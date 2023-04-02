import * as React from "react";
import * as ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar,
} from "@progress/kendo-react-layout";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
const NavBar = () => {
  return (
    <React.Fragment>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand>Virus Scanner</Navbar.Brand>
        <Container>
          <Nav className="me-auto">
            <Nav.Link>
              <span>
                <NavLink to="/">URL</NavLink>
              </span>
            </Nav.Link>
            <Nav.Link>
              <span>
                <NavLink to="/file">File</NavLink>
              </span>
            </Nav.Link>
            <Nav.Link>
              <span>
                <NavLink to="/about">About</NavLink>
              </span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </React.Fragment>
  );
};
export default NavBar;

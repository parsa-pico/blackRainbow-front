import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { clearUser, getUser } from "../../Services/authService";
export default function MyNav() {
  const user = getUser();
  const expand = "md";
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <Navbar
        id="my-nav"
        fixed="top"
        key={expand}
        expand={expand}
        className="bg-body-tertiary mb-3"
      >
        <Container fluid>
          <Navbar.Toggle
            onClick={toggleMenu}
            aria-controls={`offcanvasNavbar-expand-${expand}`}
          />
          <Navbar.Brand href="/">
            <img className="nav-logo" src="/logo.png" alt="" />
          </Navbar.Brand>
          <Navbar.Offcanvas
            show={menuOpen}
            onHide={() => {
              setMenuOpen(false);
            }}
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Black Rainbow
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="">
              <Form className="nav-search-wrapper d-flex">
                <Form.Control
                  // type="search"
                  placeholder="جستجو"
                  className="nav-search"
                  aria-label="Search"
                />

                <SearchIcon className="nav-search-icon" />
              </Form>
              <Nav className=" flex-grow-1 pe-3 mt-2">
                {user && user.isAdmin && (
                  <div>
                    <NavLink style={{ all: "inherit" }} to={"/admin/new-item"}>
                      مدیریت محصولات
                    </NavLink>
                  </div>
                )}
                <div>
                  {!user && (
                    <NavLink style={{ all: "inherit" }} to={"/login"}>
                      ورود/ثبت نام
                    </NavLink>
                  )}
                  {user && (
                    <NavLink
                      onClick={() => {
                        clearUser();
                        window.location = "/";
                        //TODO:remove cookies from server side
                      }}
                      style={{ all: "inherit" }}
                    >
                      خروج
                    </NavLink>
                  )}
                </div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <div>
            <ShoppingCartIcon />
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { clearUser, getUser } from "../../Services/authService";
import MenuIcon from "@mui/icons-material/Menu";
export default function MyNav() {
  const nav = useNavigate();
  const user = getUser();
  const expand = "xl";
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
        className="bg-body-tertiary mb-3"
      >
        <Container fluid>
          <MenuIcon
            sx={{ cursor: "pointer" }}
            fontSize="large"
            onClick={toggleMenu}
          />
          <Navbar.Brand href="/">
            <img className="nav-logo" src="/logo.png" alt="" />
          </Navbar.Brand>
          <Offcanvas
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
              <Nav className=" flex-grow-1 pe-3 mt-2">
                {user && user.isAdmin && (
                  <div>
                    <CustuomLink to="/admin/new-item">
                      مدیریت محصولات
                    </CustuomLink>
                    <CustuomLink to="/admin/options">آپشن ها</CustuomLink>
                  </div>
                )}
                <div>
                  {!user && <CustuomLink to="/login">ورود/ثبت نام</CustuomLink>}
                  {user && (
                    <CustuomLink
                      onClick={() => {
                        console.log("here");
                        clearUser();
                        window.location = "/";
                        //TODO:remove cookies from server side
                      }}
                    >
                      خروج
                    </CustuomLink>
                  )}
                </div>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
          <div>
            <ShoppingCartIcon />
          </div>
        </Container>
        <Container className="d-flex mt-2" style={{ justifyContent: "center" }}>
          <Form className="nav-search-wrapper d-flex">
            <Form.Control
              // type="search"
              placeholder="جستجو"
              className="nav-search mb-2"
              aria-label="Search"
            />

            <SearchIcon className="nav-search-icon" />
          </Form>
        </Container>
      </Navbar>
    </div>
  );
  function CustuomLink({ to, onClick, children }) {
    return (
      <Nav.Link
        onClick={() => {
          if (onClick) onClick();
          if (to) nav(to);
          setMenuOpen(false);
        }}
      >
        {children}
      </Nav.Link>
    );
  }
}

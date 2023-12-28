import React from "react";

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
import { Button } from "@mui/material";
import { searchText } from "../../Common/commonFuncs";

export default function MyNav() {
  const nav = useNavigate();
  const user = getUser();
  const [searchValue, setSearchValue] = useState("");
  const expand = "xl";
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div id="my-nav" key={expand} className="bg-body-tertiary py-1">
        <Container
          style={{ display: "flex", justifyContent: "space-between" }}
          fluid
        >
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
                منو
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="">
              {user && user.isAdmin && (
                <>
                  <CustuomLink to="/admin/new-item">مدیریت محصولات</CustuomLink>
                  <CustuomLink to="/admin/options">آپشن ها</CustuomLink>
                </>
              )}
              <>
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
              </>
            </Offcanvas.Body>
          </Offcanvas>
          <div>
            <ShoppingCartIcon />
          </div>
        </Container>
        <Container className="d-flex mt-2" style={{ justifyContent: "center" }}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              searchText(searchValue);
            }}
            className="nav-search-wrapper d-flex"
          >
            <Form.Control
              value={searchValue}
              onChange={({ target }) => setSearchValue(target.value)}
              // type="search"
              placeholder="جستجو"
              className="nav-search mb-2"
              aria-label="Search"
            />
            <Button style={{ color: "var(--dark)" }}>
              <SearchIcon className="nav-search-icon" />
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
  function CustuomLink({ to, onClick, children }) {
    return (
      <p
        style={{ display: "block", cursor: "pointer" }}
        onClick={() => {
          if (onClick) onClick();
          if (to) nav(to);
          setMenuOpen(false);
        }}
      >
        {children}
      </p>
    );
  }
}

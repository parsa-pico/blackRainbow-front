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
import { searchText, tryHTTP } from "../../Common/commonFuncs";
import { useCartCount } from "../../context/cartCountContext";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
export default function MyNav() {
  const [cartCount] = useCartCount();
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
                  <CustuomLink
                    onClick={() => {
                      window.location = "/admin/new-item";
                    }}
                  >
                    محصول جدید
                  </CustuomLink>
                  <CustuomLink to="/admin/options">مدیریت آپشن ها</CustuomLink>
                  <CustuomLink to="/admin/orders">مدیریت سفارشات</CustuomLink>
                  <hr />
                </>
              )}
              <>
                {!user && <CustuomLink to="/login">ورود/ثبت نام</CustuomLink>}
                {user && (
                  <div>
                    <CustuomLink to="/orders">سفارشات من</CustuomLink>
                    <CustuomLink
                      onClick={() => {
                        console.log("here");
                        clearUser();
                        tryHTTP(async (http) => {
                          const { data } = await http.post("/customers/logout");
                          console.log(data);
                        });
                        window.location = "/";
                        //TODO:remove cookies from server side
                      }}
                    >
                      خروج
                    </CustuomLink>
                  </div>
                )}
              </>
            </Offcanvas.Body>
          </Offcanvas>
          <div>
            <IconButton
              onClick={() => {
                window.location = "/cart";
              }}
              aria-label="cart"
            >
              <StyledBadge badgeContent={cartCount} color="secondary">
                <ShoppingCartIcon fontSize="medium" />
              </StyledBadge>
            </IconButton>
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
            <Button type="submit" style={{ color: "var(--dark)" }}>
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

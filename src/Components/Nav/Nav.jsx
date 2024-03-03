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
import NavCategories from "./NavCategories";
import { CustuomLink } from "../../Common/commonComponents";
import CloseIcon from "@mui/icons-material/Close";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
export default function MyNav({ search }) {
  const [searchValue, setSearchValue] = search;
  const [cartCount] = useCartCount();
  const nav = useNavigate();
  const user = getUser();

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
            style={{ zIndex: 9999999 }}
            show={menuOpen}
            onHide={() => {
              setMenuOpen(false);
            }}
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header
              // closeButton
              // style={{ justifyContent: "space-between" }}
              className="justify-content-space-between"
            >
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                فروشگاه بلک رینبو
                {/* <hr /> */}
              </Offcanvas.Title>
              <CloseIcon onClick={toggleMenu} className="pointer" />
            </Offcanvas.Header>
            <Offcanvas.Body className="">
              {user && user.isAdmin && (
                <>
                  <NavCustomLink
                    onClick={() => {
                      window.location = "/admin/new-item";
                    }}
                  >
                    محصول جدید
                  </NavCustomLink>
                  <NavCustomLink to="/admin/options">
                    مدیریت آپشن ها
                  </NavCustomLink>
                  <NavCustomLink to="/admin/orders">
                    مدیریت سفارشات
                  </NavCustomLink>
                  <NavCustomLink to="/admin/customers">
                    مدیریت کاربران
                  </NavCustomLink>
                  <NavCustomLink to="/admin/get-liked">
                    علاقمندی های کاربران
                  </NavCustomLink>
                  <NavCustomLink to="/admin/background">
                    انتخاب پس زمینه
                  </NavCustomLink>
                  <hr />
                </>
              )}
              <NavCategories />
              <>
                {!user && (
                  <NavCustomLink to="/login">ورود/ثبت نام</NavCustomLink>
                )}
                {user && (
                  <div>
                    <NavCustomLink to="/orders">سفارشات من</NavCustomLink>
                    <NavCustomLink to="/likes">علاقه مندی ها</NavCustomLink>
                    <NavCustomLink
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
                    </NavCustomLink>
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
              nav(`/items/?search=${searchValue}`);
              // searchText(searchValue);
            }}
            className="nav-search-wrapper d-flex"
          >
            <Form.Control
              value={searchValue}
              onChange={({ target }) => setSearchValue(target.value)}
              // type="search"
              name="search"
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
  function NavCustomLink({ to, onClick, children }) {
    return (
      <CustuomLink
        to={to}
        onClick={onClick}
        children={children}
        setMenuOpen={setMenuOpen}
        nav={nav}
      />
    );
  }
}

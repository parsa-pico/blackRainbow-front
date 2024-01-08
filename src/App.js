import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {
  clearUser,
  getAnonymousId,
  getToken,
  getUser,
} from "./Services/authService";
import { useEffect, useState } from "react";
import Item from "./Components/Items/Item";

import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import { Button, ToastContainer } from "react-bootstrap";
import NewItem from "./Components/Admin/Item/NewItem";
import GetOptions from "./Components/Admin/Options/GetOptions";
import NotFound from "./Components/NotFound";
import OptionsPage from "./Components/Admin/Options/OptionsPage";
import SelectPictures from "./Components/Admin/Item/SelectPictures/SelectPictures";
import GetItems from "./Components/GetItems/GetItems";
import { tryHTTP } from "./Common/commonFuncs";
import { useCartCount } from "./context/cartCountContext";
import CartPage from "./Components/Cart/CartPage";
import Order from "./Components/Orders/Order";
import Orders from "./Components/Orders/Orders";
import AdminOrders from "./Components/Admin/Orders/AdminOrders";
import AdminOrder from "./Components/Admin/Orders/AdminOrder";
import GetLikedItems from "./Components/Liked/GetLikedItems";
import SelectBackground from "./Components/Admin/Background/SelectBackground";

function App() {
  const loc = useLocation();
  const [showNav, setShowNav] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [marginTop, setMarginTop] = useState(10);
  const [cartCount, setCartCount] = useCartCount();
  // hide menu
  useEffect(() => {
    // Your scroll event listener code here
    document.body.style.backgroundImage = `url(${process.env.REACT_APP_API_URL}/pictures/bg.jpg)`;
    var prevScrollpos = window.pageYOffset;
    const handleScroll = () => {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("my-nav").style.top = "0";
      } else {
        document.getElementById("my-nav").style.top = "-300px";
      }
      prevScrollpos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => {
      // Remove the scroll event listener when the component is unmounted
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //
  useEffect(() => {
    const user = getUser();
    const now = new Date().getTime();

    if (!user && !getAnonymousId()) {
      tryHTTP(async (http) => {
        await http.post("/customers/login-anonymous");
      });
    }
    if (user && now > user.exp) {
      clearUser();
      window.location = "/";
    }

    // if (user || getAnonymousId())
    tryHTTP(
      async (http) => {
        const { data } = await http.post("/carts/count-cart");
        setCartCount(data.count);
      },
      undefined,
      (e) => {
        if (e.response && e.response.status === 403) window.location = "/";
      }
    );

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const nav = document.getElementById("my-nav");
    if (nav) {
      const navHeight = nav.clientHeight;
      setMarginTop(navHeight + 10);
    }
    if (loc.pathname.includes("login")) setShowNav(false);
    else setShowNav(true);
  }, [loc]);

  return (
    <div className="App">
      {showNav && <Nav search={[searchValue, setSearchValue]} />}
      {showNav && <div style={{ marginTop: `${marginTop}px` }} />}
      <Routes>
        <Route path="/" exact element={<Navigate to="/items" />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/items/:itemId" exact element={<Item />} />
        <Route
          path="/items"
          exact
          element={<GetItems setSearchValue={setSearchValue} />}
        />
        <Route path="/cart" exact element={<CartPage />} />
        <Route path="/orders" exact element={<Orders />} />
        <Route path="/orders/:orderId" exact element={<Order />} />
        <Route path="/likes" exact element={<GetLikedItems />} />

        <Route path="/admin">
          <Route path="new-item" element={<NewItem />} />
          <Route path="options" element={<OptionsPage />} />
          <Route path="orders" exact element={<AdminOrders />} />
          <Route path="orders/:orderId" exact element={<AdminOrder />} />
          <Route path="background" exact element={<SelectBackground />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <div style={{ marginTop: "200px" }} />
      <ToastContainer />
    </div>
  );
}

export default App;

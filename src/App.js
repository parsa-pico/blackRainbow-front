import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import {
  clearUser,
  getAnonymousId,
  getToken,
  getUser,
  setSessionId,
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
import { throttle } from "lodash";
import Footer from "./Components/Footer/Footer";
import GetCustomers from "./Components/Admin/Customers/GetCustomers";
import AdminGetLiked from "./Components/Admin/GetLikedItems/AdminGetLiked";
import SiteMap from "./Components/SiteMap";

function App() {
  const loc = useLocation();
  const [showNav, setShowNav] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [marginTop, setMarginTop] = useState(10);
  const [cartCount, setCartCount] = useCartCount();
  const isSitemapRoute = loc.pathname === "/sitemap.xml";

  // hide menu
  useEffect(() => {
    if (isSitemapRoute) return;
    document.body.style.backgroundImage = `url(${process.env.REACT_APP_API_URL}/pictures/bg.jpg)`;
    // Your scroll event listener code here
    var lastScrolls = [];
    const max = 2;
    for (let i = 0; i < max; i++) {
      lastScrolls.push(window.scrollY);
    }
    const handleScroll = () => {
      var currentScrollPos = window.scrollY;
      lastScrolls.shift();
      lastScrolls.push(currentScrollPos);
      if (lastScrolls[0] > currentScrollPos) {
        document.getElementById("my-nav").style.top = "0";
        handleScrollThrottled.cancel();
      } else {
        document.getElementById("my-nav").style.top = "-300px";
      }
    };
    const handleScrollThrottled = throttle(handleScroll, 100); // Adjust the delay as needed (300 milliseconds in this example)

    window.addEventListener("scroll", handleScrollThrottled);

    // Cleanup function
    return () => {
      if (isSitemapRoute) return;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //
  useEffect(() => {
    if (isSitemapRoute) return;

    const user = getUser();
    if (!user) {
      tryHTTP(async (http) => {
        const { data } = await http.post("/customers/login-anonymous");
        setSessionId(data.sessionId);
        setCartCount(0);
      });
    }
  }, []);
  useEffect(() => {
    if (isSitemapRoute) return;
    const user = getUser();
    const now = new Date().getTime();

    if (user && now > user.exp) {
      clearUser();
      window.location = "/";
    }

    tryHTTP(async (http) => {
      const { data } = await http.post("/carts/count-cart");
      setCartCount(data.count);
    });

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
      {!isSitemapRoute && (
        <>
          {showNav && <Nav search={[searchValue, setSearchValue]} />}
          {showNav && (
            <div id="push-top" style={{ marginTop: `${marginTop}px` }} />
          )}
        </>
      )}
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/sitemap.xml" exact element={<SiteMap />} />
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
          <Route path="customers" exact element={<GetCustomers />} />
          <Route path="get-liked" exact element={<AdminGetLiked />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isSitemapRoute && (
        <>
          <div style={{ marginTop: "200px" }} />
          <Footer />
          <ToastContainer />
        </>
      )}
    </div>
  );
}

export default App;

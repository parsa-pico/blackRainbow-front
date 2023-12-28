import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { clearUser, getToken, getUser } from "./Services/authService";
import { useEffect, useState } from "react";
import Item from "./Components/Items/Item";

import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import { Button, ToastContainer } from "react-bootstrap";
import NewItem from "./Components/Admin/Item/NewItem";
import GetOptions from "./Components/Admin/Options/GetOptions";
import NotFound from "./Components/NotFound";

function App() {
  const loc = useLocation();
  const [showNav, setShowNav] = useState(true);
  const [marginTop, setMarginTop] = useState(10);

  useEffect(() => {
    const user = getUser();
    const now = new Date().getTime();
    if (user && now > user.exp) {
      clearUser();
      window.location = "/";
    }
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
      {showNav && <Nav />}
      {showNav && <div style={{ marginTop: `${marginTop}px` }} />}
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/items/:itemId" exact element={<Item />} />
        <Route path="/admin">
          <Route path="new-item" element={<NewItem />} />
          <Route path="options" element={<GetOptions />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;

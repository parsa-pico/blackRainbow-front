import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { getToken } from "./Services/authService";
import { useEffect, useState } from "react";
import Item from "./Components/Items/Item";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
function App() {
  const loc = useLocation();
  const darkTheme = createTheme({
    direction: "rtl",
    palette: {
      mode: "dark",
    },
  });
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [loc]);

  return (
    <div className="App">
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Routes>
            <Route path="/" exact element={<Navigate to={"/items"} />} />
            <Route path="/items/:itemId" exact element={<Item />} />
          </Routes>
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
}

export default App;

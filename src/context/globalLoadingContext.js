import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useState, createContext, useContext } from "react";

export const globalLoadingContext = createContext();

export const GlobalLoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoding] = useState(false);
  return (
    <globalLoadingContext.Provider value={[globalLoading, setGlobalLoding]}>
      {children}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={globalLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </globalLoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(globalLoadingContext);

  return context;
};

import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useState, createContext, useContext } from "react";
import { tryHTTP } from "../Common/commonFuncs";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    tryHTTP(async (http) => {
      const { data } = await http.get("/categories");

      setCategories(data);
    });
  }, []);
  return (
    <CategoryContext.Provider value={[categories, setCategories]}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);

  return context;
};

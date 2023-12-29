import { useEffect } from "react";
import { useState, createContext, useContext } from "react";

export const cartCountContext = createContext();

export const CartCountProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <cartCountContext.Provider value={[count, setCount]}>
      {children}
    </cartCountContext.Provider>
  );
};

export const useCartCount = () => {
  const context = useContext(cartCountContext);

  return context;
};

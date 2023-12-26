import { useEffect } from "react";
import { useState, createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer className="my-toast" />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  return context;
};

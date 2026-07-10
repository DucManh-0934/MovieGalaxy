import React, { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";
import { useNavigate } from "react-router-dom";
export const ContextLogin = createContext();

export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const login = localStorage.getItem("isLogin");
    if (login) {
      setIsLogin(JSON.parse(login));
    }
  }, []);
  const handleLogin = (account) => {
    localStorage.setItem("isLogin", JSON.stringify(account));
    setIsLogin(account);
  };
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(null);
    navigate("/");
  };
  return (
    <ContextLogin.Provider value={{ isLogin, handleLogin, handleLogout }}>
      {children}
    </ContextLogin.Provider>
  );
};

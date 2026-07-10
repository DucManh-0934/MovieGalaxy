import { useContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomeAdmin from "./pages/admin/home_admin/HomeAdmin";
import NoelBackground from "./components/admin/NoelBackground";
import Home from "./pages/clients/home/Home";
import TableWatch from "./pages/clients/watch/TableWatch";
import { ContextLogin } from "./contexts/LoginProvide";

function App() {
  const { isLogin } = useContext(ContextLogin);
    
    
  return (
    <>
      <NoelBackground />
      {isLogin?.role == "admin" || isLogin?.role == "staff" ? <HomeAdmin /> : <Home />}
   
    </>
  );
}

export default App;
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomeAdmin from "./pages/admin/home_admin/HomeAdmin";
import NoelBackground from "./components/admin/NoelBackground";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NoelBackground />
      <HomeAdmin />
    </>
  );
}

export default App;

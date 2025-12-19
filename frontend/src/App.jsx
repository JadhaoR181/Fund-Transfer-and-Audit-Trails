import { useState } from "react";
import Login from "./pages/Login";
import Transfer from "./pages/Transfer";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Transfer onTransfer={() => {}} />;
}

export default App;

import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transfer from "./pages/Transfer";

function App() {
  // 🔐 Auth state from token (single source of truth)
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // login | register
  const [page, setPage] = useState("login");

  // 🔐 Auth pages
  if (!isLoggedIn) {
    return (
      <>
        {page === "login" && (
          <Login
            onLogin={() => setIsLoggedIn(true)}
            onSwitchToRegister={() => setPage("register")}
          />
        )}

        {page === "register" && (
          <Register
            onSwitchToLogin={() => setPage("login")}
          />
        )}
      </>
    );
  }

  // 💸 Main app
  return <Transfer />;
}

export default App;

import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Header({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();

  return (
    <header>
      <h1>Keeper</h1>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <span className="username">Welcome, {username}</span>
            <Button
              variant="contained"
              color="secondary"
              onClick={onLogout}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/register")}
              sx={{ ml: 2 }}
            >
              Register
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

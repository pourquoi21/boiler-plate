import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="users">Users</Link>
            </li>
          </ul>
        </nav> */}
        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={LandingPage()} />
          <Route path="/login" element={LoginPage()} />
          <Route path="/register" element={RegisterPage()} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

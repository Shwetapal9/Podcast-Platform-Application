import React, { useState } from "react";
import "./styles.css";
import logo from "../../../assets/podcast.png"
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {toast} from "react-toastify"

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("User Logged Out!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="navbar">
      <div className="gradient"></div>
      <img src={logo} className="podcast-img" />
      <div className="links">
        {user ? "":<Link to="/" className={currentPath === "/" ? "active" : ""}>
          SignUp
        </Link>}
        <Link
          to="/podcasts"
          className={currentPath === "/podcasts" ? "active" : ""}
        >
          Podcasts
        </Link>
        <Link
          to="/start-a-podcast"
          className={currentPath === "/start-a-podcast" ? "active" : ""}
        >
          Create A Podcast
        </Link>
        <Link
          to="/profile"
          className={currentPath === "/profile" ? "active" : ""}
        >
          Profile
        </Link>
        {user ?<Link to="/" onClick={handleLogout}>Logout</Link>: ""}
      </div>
    </div>
  );
}

export default Header;

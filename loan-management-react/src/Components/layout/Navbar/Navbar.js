import React, { useContext } from "react";
import { Link } from "react-router-dom";
import profile from "./profile.png";
import loanimg from "./loan.jfif";
import AuthContext from "../../auth/auth-context";

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  
  
  if (authCtx.authData) {
    const {type, username} = authCtx.authData;
 
    const setPath = () => {
      //Setting the route path according to the logged In type.
      switch (type) {
        case "Admin":
          return "/admin";

        case "User":
          return "/user";
        
        default:
          return ""
      }
    };

    return (
      <nav
        className="navbar p-2 shadow navbar-dark navbar-expand-sm"
        style={{ backgroundColor: "#5161ce" }}
      >
        <div className="navbar-brand">
          <Link to={setPath()}>
            {" "}
            <img
              className="ml-3 rounded-circle"
              src={loanimg}
              width="45"
              height="45"
              alt="logo"
            />
          </Link>
          <span className="ml-2 h4"> Loan Management system</span>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-list-4"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar-list-4">
          <ul className="navbar-nav ml-auto ">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                role="button"
                data-toggle="dropdown"
              >
                <img
                  src={profile}
                  width="40"
                  height="40"
                  className="rounded-circle"
                  alt="profile"
                />
                <span className="h6 text-light p-1 font-weight-normal">
                  {" "}
                  {username}
                </span>
              </a>
              <div className="dropdown-menu">
                <Link to={setPath()} className="dropdown-item">
                  Dashboard
                </Link>
                {type === "User" ? (
                  <Link to="/profile" className="dropdown-item">
                    Edit Profile
                  </Link>
                ) : null}
                <Link
                  to="/login"
                  onClick={authCtx.logoutHandler}
                  className="dropdown-item"
                >
                  Log Out
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  } else {
    return null;
  }
};

export default Navbar;

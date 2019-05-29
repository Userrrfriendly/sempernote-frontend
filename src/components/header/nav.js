import React from "react";
// import M from "materialize-css";
// import "./nav.css";
import Logo from "../svg-icons/platypus-logo";
import Drawer from "../drawer/drawer";
import M from "materialize-css";
import { Link } from "react-router-dom";

/**
 * SEMPERNOTE LOGO OVERFLOWS!
 */
class Nav extends React.Component {
  componentDidMount() {
    M.AutoInit();
  }
  render() {
    return (
      <>
        <div className="navbar-fixed">
          <nav className="orange darken-2">
            <div className="nav-wrapper">
              <a href="#!" className="semper-logo left">
                <Logo
                  classes="hide-on-med-and-down"
                  style={{
                    margin: "0.5rem 0.5rem"
                    // position: "absolute",
                    // top: "0.5rem",
                    // left: "0.5rem"
                  }}
                />
              </a>
              {/* Sounds SOUND to change #slide-out to smth like #mobile-nave */}
              <a
                href="#somewhere"
                data-target="slide-out"
                className="sidenav-trigger show-on-large nav-hamburger left"
                // style={{ margin: "0 6rem" }}
              >
                <i className="material-icons">menu</i>
              </a>

              <ul className="right hide-on-med-and-down">
                <li>
                  <a href="sass.html">
                    <i className="material-icons">search</i>
                  </a>
                </li>
                <li>
                  {/* <a href="badges.html">
                    <i className="material-icons">view_module</i>
                  </a> */}
                  <Link to="/main/">
                    <i className="material-icons">arrow_back</i>
                  </Link>
                </li>

                <li>
                  <a href="collapsible.html">
                    <i className="material-icons">refresh</i>
                  </a>
                </li>
                <li>
                  <a href="mobile.html">
                    <i className="material-icons">more_vert</i>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <Drawer />
      </>
    );
  }
}

export default Nav;

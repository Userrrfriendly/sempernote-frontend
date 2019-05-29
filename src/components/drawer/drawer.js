import React, { Component } from "react";

import "./drawer.css";
import Logo from "../svg-icons/platypus-logo";

class Drawer extends Component {
  render() {
    return (
      // add .sidenav-fixed to the ul to make it fixed on left (it overlayes the main content so need to find a fix)
      <ul id="slide-out" className="sidenav">
        <li className="center-align">
          {/* <a href="#!" className="brand-logo center-align"> */}
          <Logo
            width="5rem"
            style={{
              margin: "1rem",
              maxWidth: "5rem" //without maxWitdth the svg in firefox takes all space around it
            }}
          />
          {/* </a> */}
        </li>
        <li>
          <a href="#name">
            <span className="black-text name">John Doe</span>
          </a>
          <a href="#email">
            <span className="black-text email">jdandturk@gmail.com</span>
          </a>
        </li>
        <li>
          <div className="divider" />
        </li>
        <li>
          <a className="waves-effect" href="#!">
            <i className="waves-effect material-icons black-text">
              playlist_add_check
            </i>
            All Notes
          </a>
        </li>
        <li>
          <a className="waves-effect" href="#!">
            <i className="material-icons black-text">library_books</i>
            NoteBooks
          </a>
        </li>
        <li>
          <a className="waves-effect" href="#!">
            <i className="material-icons black-text">style</i>
            Tags
          </a>
        </li>
        <li>
          <a className="waves-effect" href="#!">
            <i className="material-icons black-text">folder_special</i>
            Bookmarks
          </a>
        </li>
        <li>
          <a className="waves-effect" href="#!">
            <i className="material-icons black-text">delete</i>
            Delete
          </a>
        </li>
      </ul>

      // test
      // <>

      // </>
    );
  }
}

export default Drawer;

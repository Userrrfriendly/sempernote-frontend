import React, { Component } from "react";

import "./drawer.css";
import Logo from "../svg-icons/platypus-logo";
import Icon from "../svg-icons/Icon";
class Drawer extends Component {
  render() {
    return (
      <aside
        className={
          this.props.drawerVisible
            ? "drawer drawer-visible"
            : " drawer drawer-hidden"
        }
      >
        <header style={{ height: "4rem" }}>
          <Logo width="64" height="64" />
          <button
            title="Close Menu"
            onClick={this.props.closeDrawer}
            className="close-drawer-btn"
          >
            <Icon name="closeIcon" fill={"red"} width="35" />
          </button>
          <div className="drawer-email">tesingemail@homtail.com</div>
        </header>
        <hr />
        <main>
          <ul className="drawer-ul">
            <li className="drawer-li" tabIndex="0">
              <Icon name="allnotes" fill="white" className="drawer-icon" />
              All Notes
            </li>
            <li className="drawer-li" tabIndex="0">
              <Icon name="notebooks" fill="white" className="drawer-icon" />
              Notebooks
            </li>
            <li className="drawer-li" tabIndex="0">
              <Icon name="tags" fill="white" className="drawer-icon" />
              Tags
            </li>
            <li className="drawer-li" tabIndex="0">
              <Icon name="bookmarks" fill="white" className="drawer-icon" />
              Bookmarks
            </li>
            <li className="drawer-li" tabIndex="0">
              <Icon name="trash" fill="white" className="drawer-icon" />
              Trash
            </li>
          </ul>
        </main>
      </aside>
    );
  }
}

export default Drawer;

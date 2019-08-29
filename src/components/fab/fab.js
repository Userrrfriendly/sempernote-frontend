import React from "react";
import {
  LibraryAddRounded,
  NoteAddRounded,
  StarRounded,
  LibraryBooksRounded,
  StyleRounded,
  Add
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import CreateTagIcon from "../svgCreateTag/svgCreateTag";
import { Fab, Action } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";

const useStyles = makeStyles(theme => ({
  action_btn_background: {
    backgroundColor: "#000"
  },
  action_btn_icon: {
    color: "#000"
  }
}));

const FAB = props => {
  const position = { bottom: 0, right: 0, zIndex: "1200" };
  const mainButtonStyles = { backgroundColor: "#1976d2" };
  const classes = useStyles();
  return (
    <Fab
      mainButtonStyles={mainButtonStyles}
      position={position}
      icon={<Add />}
      event="click"
    >
      <Action
        text="Create Note"
        style={{ backgroundColor: "#ffffff" }}
        onClick={props.createNote}
      >
        <NoteAddRounded className={classes.action_btn_icon} />
      </Action>
      <Action
        text="Create Notebook"
        onClick={props.createNotebook}
        style={{ backgroundColor: "#ffffff" }}
      >
        <LibraryAddRounded className={classes.action_btn_icon} />
      </Action>

      <Action
        text="Create Tag"
        onClick={props.createTag}
        style={{ backgroundColor: "#ffffff" }}
      >
        <CreateTagIcon styles={{ color: "#000" }} />
      </Action>

      <Action
        text="Favorites"
        style={{ backgroundColor: "#ffffff" }}
        onClick={props.toggleDrawer.bind(this, "favorites", true)}
      >
        <StarRounded className={classes.action_btn_icon} />
      </Action>
      <Action
        style={{ backgroundColor: "#ffffff" }}
        text="Notebooks"
        onClick={props.toggleDrawer.bind(this, "notebooks", true)}
      >
        <LibraryBooksRounded className={classes.action_btn_icon} />
      </Action>
      <Action
        style={{ backgroundColor: "#ffffff" }}
        text="Tags"
        onClick={props.toggleDrawer.bind(this, "tags", true)}
      >
        <StyleRounded className={classes.action_btn_icon} />
      </Action>
    </Fab>
  );
};

export default FAB;

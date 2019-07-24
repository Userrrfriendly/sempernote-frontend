import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, Tooltip } from "@material-ui/core";
import {
  NoteAddRounded,
  DescriptionRounded,
  LibraryAddRounded
} from "@material-ui/icons";
import { SET_NOTE_FILTER } from "../../context/rootReducer";
import DispatchContext from "../../context/DispatchContext";

import { NOTES } from "../../context/activeUItypes";

import CreateTagIcon from "../svgCreateTag/svgCreateTag";
import NotebookDrawer from "../notebookDrawer/notebookDrawer";
import TagsDrawer from "../tagsDrawer/tagsDrawer";
import TrashDrawer from "../trashDrawer/trashDrawer";
import SearchDrawer from "../searchDrawer/searchDrawer";
import FavoritesDrawer from "../favoritesDrawer/favoritesDrawer";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 60,
    backgroundColor: theme.palette.background.paper,
    height: "100vh",
    position: "fixed",
    top: "0",
    boxShadow:
      "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
    zIndex: 1301 //override the drawers zIndex
  },
  list_item: {
    marginBottom: "1rem"
  },
  hr: {
    margin: "2rem 0"
  }
}));

const SideNav = props => {
  const classes = useStyles();

  const dispatch = useContext(DispatchContext);

  const openCreateNoteModal = () => {
    props.toggleDrawer();
    props.openCreateNoteModal();
  };

  const openCreateNotebook = () => {
    props.toggleDrawer();
    props.openCreateNotebookModal();
  };

  const openCreateTag = () => {
    props.toggleDrawer();
    props.openCreateTagModal();
  };

  return (
    <div className={classes.root}>
      <List component="nav">
        <Tooltip title="Create Note" placement="right">
          <ListItem
            style={{ marginTop: "2rem" }}
            className={classes.list_item}
            button
            onClick={openCreateNoteModal}
          >
            <ListItemIcon>
              <NoteAddRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>

        <Tooltip title="Create Notebook" placement="right">
          <ListItem
            className={classes.list_item}
            button
            onClick={openCreateNotebook}
          >
            <ListItemIcon>
              <LibraryAddRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>

        <Tooltip title="Create Tag" placement="right">
          <ListItem
            className={classes.list_item}
            button
            onClick={openCreateTag}
          >
            <ListItemIcon>
              <CreateTagIcon />
            </ListItemIcon>
          </ListItem>
        </Tooltip>

        <hr className={classes.hr} />
        {/* </List>
      <List component="nav"> */}
        <SearchDrawer
          toggleDrawer={props.toggleDrawer}
          drawerState={props.drawerState}
        />

        <FavoritesDrawer
          toggleDrawer={props.toggleDrawer}
          drawerState={props.drawerState}
        />

        <Tooltip title="All Notes" placement="right">
          <ListItem
            className={classes.list_item}
            button
            onClick={() => {
              dispatch({
                type: SET_NOTE_FILTER,
                name: NOTES
              });
              props.toggleDrawer();
            }}
          >
            <ListItemIcon>
              <DescriptionRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>

        <NotebookDrawer
          toggleDrawer={props.toggleDrawer}
          drawerState={props.drawerState}
        />

        <TagsDrawer
          toggleDrawer={props.toggleDrawer}
          drawerState={props.drawerState}
        />

        <TrashDrawer
          toggleDrawer={props.toggleDrawer}
          drawerState={props.drawerState}
          restoreNote={props.restoreNote}
          openDeleteDialog={props.openDeleteDialog}
        />
      </List>
    </div>
  );
};

export default SideNav;

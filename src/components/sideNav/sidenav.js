import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from "@material-ui/core";
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

import { useScreenWidth } from "../../helpers/customHooks/useScreenWidth";
import { useScreenHeight } from "../../helpers/customHooks/useScreenHeight";

const SideNav = props => {
  const scrWidth600up = useScreenWidth();
  const scrHeight600up = useScreenHeight();

  const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      heigth: "100vh",
      position: "fixed",
      top: "0",
      boxShadow:
        "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
      zIndex: 1301 //override the drawers zIndex
    },
    list_item: {
      marginBottom: scrWidth600up ? "1rem" : "0.25rem"
    },
    hr: {
      margin: scrWidth600up ? "2rem 0" : "1rem 0"
    },
    smallScreen: {
      color: "black",
      width: "240px"
    },
    largeScreen: {
      width: "60px"
    }
  }));

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
      <List
        component="nav"
        style={
          scrWidth600up && scrHeight600up
            ? { width: "60px", height: "100vh" }
            : { width: "240px", height: "100vh" }
        }
        className={
          scrWidth600up && scrHeight600up
            ? classes.largeScreen
            : classes.smallScreen
        }
      >
        <Tooltip title="Create Note" placement="right">
          <ListItem
            style={{ marginTop: scrWidth600up ? "2rem" : "0.75rem" }}
            className={classes.list_item}
            onClick={openCreateNoteModal}
            button
          >
            <ListItemIcon>
              <NoteAddRounded />
            </ListItemIcon>
            {(!scrWidth600up || !scrHeight600up) && (
              <ListItemText primary="Create Note" />
            )}
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
            {(!scrWidth600up || !scrHeight600up) && (
              <ListItemText primary="Create Notebook" />
            )}
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
            {(!scrWidth600up || !scrHeight600up) && (
              <ListItemText primary="Create Tag" />
            )}
          </ListItem>
        </Tooltip>

        <hr className={classes.hr} />

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
            {(!scrWidth600up || !scrHeight600up) && (
              <ListItemText primary="All Notes" />
            )}
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

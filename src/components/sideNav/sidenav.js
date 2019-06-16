import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, Tooltip } from "@material-ui/core";
import {
  NoteAddRounded,
  SearchRounded,
  StarRounded,
  DescriptionRounded,
  // LibraryBooksRounded,
  LibraryAddRounded,
  StyleRounded,
  DeleteSweepRounded
} from "@material-ui/icons";

import Context from "../../context/context";
import { NOTES, NOTEBOOKS, FAVORITES, TAGS } from "../../context/activeUItypes";
// import NoteDialog from "../createNoteModal/noteModal_failed";

import NotebookDrawer from "../notebookDrawer/notebookDrawer";

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
  const [selectedIndex, setSelectedIndex] = React.useState(NOTES);
  const context = useContext(Context);

  function handleListItemClick(event, index) {
    //Should I be worried here? are hooks syncronous?
    setSelectedIndex(index);
    context.setActiveUI(index);
    // console.log(index);
  }

  return (
    <div className={classes.root}>
      <List component="nav">
        <Tooltip title="Create Note" placement="right">
          <ListItem
            style={{ marginTop: "2rem" }}
            className={classes.list_item}
            button
            selected={selectedIndex === 0}
            onClick={props.openCreateNoteModal}
            // onClick={event => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              <NoteAddRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        {/* <NoteDialog
          activeNote={context.activeNote}
          notebooks={context.notebooks}
          moveNoteToNotebook={context.moveNoteToNotebook}
        /> */}
        {/* </Tooltip> */}
        <Tooltip title="Create Notebook" placement="right">
          <ListItem
            className={classes.list_item}
            button
            selected={selectedIndex === 1}
            onClick={props.openCreateNotebookModal}
          >
            <ListItemIcon>
              <LibraryAddRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        <hr className={classes.hr} />
        {/* </List>
      <List component="nav"> */}
        <Tooltip title="Search" placement="right">
          <ListItem
            className={classes.list_item}
            button
            selected={selectedIndex === 2}
            onClick={event => handleListItemClick(event, 2)}
          >
            <ListItemIcon>
              <SearchRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        <Tooltip title="Favorites" placement="right">
          <ListItem
            className={classes.list_item}
            button
            selected={selectedIndex === FAVORITES}
            onClick={event => handleListItemClick(event, FAVORITES)}
          >
            <ListItemIcon>
              <StarRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        <Tooltip title="Notes" placement="right">
          <ListItem
            className={classes.list_item}
            button
            selected={selectedIndex === NOTES}
            onClick={event => handleListItemClick(event, NOTES)}
          >
            <ListItemIcon>
              <DescriptionRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>

        {/* <Tooltip title="Notebooks" placement="right"> */}
        {/* <ListItem
          className={classes.list_item}
          button
          selected={selectedIndex === NOTEBOOKS}
          onClick={event => handleListItemClick(event, NOTEBOOKS)}
        > */}
        <NotebookDrawer
          listSelected={selectedIndex === NOTEBOOKS}
          listClick={event => handleListItemClick(event, NOTEBOOKS)}
          createNotebook={props.openCreateNotebookModal}
        />

        {/* <ListItemIcon>
              <LibraryBooksRounded />
            </ListItemIcon> */}
        {/* </ListItem> */}
        {/* </Tooltip> */}

        <Tooltip title="Tags" placement="right">
          <ListItem
            className={classes.list_item}
            button
            selected={selectedIndex === TAGS}
            onClick={event => handleListItemClick(event, TAGS)}
          >
            <ListItemIcon>
              <StyleRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>

        <Tooltip title="Trash" placement="right">
          <ListItem
            className={classes.list_item}
            button
            selected={selectedIndex === TAGS}
            onClick={event => handleListItemClick(event, TAGS)}
          >
            <ListItemIcon>
              <DeleteSweepRounded />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
      </List>
    </div>
  );
};

export default SideNav;

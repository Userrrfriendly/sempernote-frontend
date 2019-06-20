import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, Tooltip } from "@material-ui/core";
import {
  NoteAddRounded,
  SearchRounded,
  StarRounded,
  DescriptionRounded,
  LibraryAddRounded
} from "@material-ui/icons";

import Context from "../../context/context";
import {
  NOTES,
  NOTEBOOK,
  FAVORITES,
  TAG,
  TRASH
} from "../../context/activeUItypes";

import NotebookDrawer from "../notebookDrawer/notebookDrawer";
import TagsDrawer from "../tagsDrawer/tagsDrawer";
import TrashDrawer from "../trashDrawer/trashDrawer";
import CreateTagIcon from "../svgCreateTag/svgCreateTag";

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
  const [openDrawer, setOpenDrawer] = React.useState("");
  const context = useContext(Context);

  function handleListItemClick(event, index) {
    console.log(index);
    closeDrawers(index);
    setSelectedIndex(index);
    index === NOTES && context.setNoteFilter(NOTES);
  }

  const closeDrawers = openDrawer => {
    setOpenDrawer(openDrawer);
  };

  const openCreateNoteModal = async () => {
    //why async/await? beacause the drawer needs to close before the modal opens
    //otherwise the focus stays on sidenav (conflic between react-modal and materialUI drawer which is also a modal)
    await closeDrawers("");
    props.openCreateNoteModal();
  };

  const openCreateNotebook = async () => {
    await closeDrawers("");
    props.openCreateNotebookModal();
  };

  const openCreateTag = async () => {
    await closeDrawers("");
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
            selected={selectedIndex === 0}
            onClick={openCreateNoteModal}
            // onClick={props.openCreateNoteModal}
            // onClick={event => handleListItemClick(event, 0)}
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
            selected={selectedIndex === 1}
            // onClick={props.openCreateNotebookModal}
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
            selected={selectedIndex === 2}
            // onClick={props.openCreateTagModal}
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

        <NotebookDrawer
          listSelected={selectedIndex === NOTEBOOK}
          listClick={event => handleListItemClick(event, NOTEBOOK)}
          closed={openDrawer}
          // createNotebook={props.openCreateNotebookModal}
        />

        <TagsDrawer
          listSelected={selectedIndex === TAG}
          listClick={event => handleListItemClick(event, TAG)}
          openCreateTagModal={props.openCreateTagModal}
          closed={openDrawer}
        />

        <TrashDrawer
          listSelected={selectedIndex === TRASH}
          listClick={event => handleListItemClick(event, TRASH)}
          closed={openDrawer}
        />
      </List>
    </div>
  );
};

export default SideNav;

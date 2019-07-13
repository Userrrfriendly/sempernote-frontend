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

import {
  NOTES,
  NOTEBOOK,
  FAVORITES,
  TAG,
  TRASH,
  SEARCH
} from "../../context/activeUItypes";

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
  const [selectedIndex, setSelectedIndex] = React.useState(NOTES);
  const [openDrawer, setOpenDrawer] = React.useState("");
  const dispatch = useContext(DispatchContext);

  function handleListItemClick(event, index) {
    closeDrawers(index);
    setSelectedIndex(index);
    index === NOTES &&
      dispatch({
        type: SET_NOTE_FILTER,
        name: NOTES
      });
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
          listSelected={selectedIndex === SEARCH}
          listClick={event => handleListItemClick(event, SEARCH)}
          closed={openDrawer}
        />

        <FavoritesDrawer
          listSelected={selectedIndex === FAVORITES}
          listClick={event => handleListItemClick(event, FAVORITES)}
          closed={openDrawer}
        />

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
        />

        <TagsDrawer
          listSelected={selectedIndex === TAG}
          listClick={event => handleListItemClick(event, TAG)}
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

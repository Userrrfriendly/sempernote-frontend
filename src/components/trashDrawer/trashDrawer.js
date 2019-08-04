import React, { useEffect, useState, useContext, Fragment } from "react";
import { withRouter } from "react-router-dom";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";

import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  List,
  Divider,
  Drawer,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Menu,
  MenuItem
} from "@material-ui/core";

import { DeleteSweepRounded, ChevronLeft, MoreVert } from "@material-ui/icons";
import { SET_ACTIVE_NOTE } from "../../context/rootReducer";
import { useScreenSize } from "../../helpers/useScreenSize";

const TrashDrawer = props => {
  const scrSize = useScreenSize();

  const drawerWidth = scrSize ? 400 : "75vw";

  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      left: "62px"
    },
    drawerPaperSm: {
      width: drawerWidth,
      left: "0"
    },
    drawerHeader: {
      display: "flex",
      padding: "0 8px",
      ...theme.mixins.toolbar,
      justifyContent: "space-between",
      flexDirection: "column"
    },
    drawerSubHeader: {
      display: "flex",
      justifyContent: "space-between"
    },
    drawerTitle: {
      marginTop: "8px"
    }
  }));

  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [trash, setTrash] = useState(appState.trash);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElID, setAnchorElID] = React.useState(null);

  function handleNotebookMenuClick(event, id) {
    setAnchorElID(id);
    setAnchorEl(event.currentTarget);
  }

  function closeTrashMenu(e) {
    setAnchorEl(null);
    setAnchorElID(null);
  }

  //DELETE
  const deleteForever = () => {
    closeTrashMenu();
    const noteToDelete = appState.trash.filter(
      note => note._id === anchorElID
    )[0];
    props.openDeleteDialog(noteToDelete);
  };

  const restoreNote = () => {
    closeTrashMenu();
    const noteToRestore = appState.trash.filter(
      note => note._id === anchorElID
    )[0];
    props.restoreNote(noteToRestore);
  };
  //end menu
  const classes = useStyles();

  const handleTrashNoteClick = trashID => {
    props.toggleDrawer();
    dispatch({
      type: SET_ACTIVE_NOTE,
      _id: trashID,
      trash: true
    });
    let path = `/main/editor`;
    props.history.push(path);
  };

  useEffect(() => {
    console.log("useEffect from Trash drawer");
    setTrash(appState.trash);
  }, [appState.trash]);

  return (
    <div className={classes.root}>
      <Tooltip title="Trash" placement="right">
        <ListItem
          className={classes.list_item}
          button
          onClick={props.toggleDrawer.bind(this, "trash", true)}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <DeleteSweepRounded />
          </ListItemIcon>
          {!scrSize && <ListItemText primary="Trash" />}
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.drawerState.trash}
        onClose={props.toggleDrawer.bind(this, "trash", false)}
        classes={{
          paper: scrSize ? classes.drawerPaper : classes.drawerPaperSm
        }}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.drawerSubHeader}>
            <Typography
              variant="h5"
              component="p"
              className={classes.drawerTitle}
            >
              Trash
            </Typography>

            <IconButton onClick={props.toggleDrawer.bind(this, "trash", false)}>
              <ChevronLeft />
            </IconButton>
          </div>
        </div>

        <Divider />

        <List>
          {trash
            ? trash.map(trashNote => {
                return (
                  <Fragment key={trashNote._id}>
                    <ListItem
                      button
                      onClick={handleTrashNoteClick.bind(this, trashNote._id)}
                    >
                      <ListItemText
                        primary={trashNote.title}
                        // secondary={numberOfNotes.length + " notes"}
                        primaryTypographyProps={
                          //if the  name is very long and doesn't contain spaces it is trancated
                          (trashNote.title.length > 25 &&
                            trashNote.title.indexOf(" ") > 30) ||
                          trashNote.title.indexOf(" ") === -1
                            ? {
                                noWrap: true,
                                component: "p"
                              }
                            : {}
                        }
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="More"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={e =>
                            handleNotebookMenuClick(e, trashNote._id)
                          }
                        >
                          <MoreVert />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </Fragment>
                );
              })
            : "Loading Notes..."}
          <Menu
            elevation={1}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeTrashMenu}
          >
            {/* <MenuItem onClick={closeTrashMenu}>Info</MenuItem> */}
            <MenuItem onClick={deleteForever}>Permanent Delete</MenuItem>
            <MenuItem onClick={restoreNote}>Restore Note</MenuItem>
          </Menu>
        </List>
      </Drawer>
    </div>
  );
};

export default withRouter(TrashDrawer);

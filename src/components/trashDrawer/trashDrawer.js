import React, { useEffect, useState, useContext, Fragment } from "react";
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
import StateContext from "../../context/StateContext";
import { TRASH } from "../../context/activeUItypes";

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },

  menuButton: {
    marginRight: theme.spacing(2),
    position: "fixed",
    left: "40rem",
    zIndex: 3
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    left: "62px"
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
  },
  textField: {
    margin: "8px 8px 16px"
  }
}));

export default function TrashDrawer(props) {
  const appState = useContext(StateContext);
  const [trash, setTrash] = useState(appState.trash);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElID, setAnchorElID] = React.useState(null);

  function handleNotebookMenuClick(event, id) {
    console.log(id);
    setAnchorElID(id);
    setAnchorEl(event.currentTarget);
  }

  function closeTrashMenu(e) {
    console.log(e);
    // console.log(anchorEl); //either extract the value through the data-trashID
    console.log(anchorElID); //or get the notebook._id that will be modified from state
    setAnchorEl(null);
    setAnchorElID(null);
  }
  //end menu
  const classes = useStyles();

  const handleTrashNoteClick = trashID => {
    props.toggleDrawer();
    appState.setNoteFilter(TRASH, trashID);
  };

  useEffect(() => {
    console.log("useEffect from Trash drawer");
    setTrash(appState.trash);
    // console.log(context.notebooks);
    // if (!search) {
    //   setTrash(context.trash);
    // } else {
    //   const filteredTrash = context.trash.filter(note =>
    //     note.name.toLowerCase().includes(search.toLowerCase())
    //   );
    //   console.log(`searching... for ${search} & found :`);
    //   console.log(filteredTrash);
    //   setTrash(filteredTrash);
    // }
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
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.drawerState.trash}
        onClose={props.toggleDrawer.bind(this, "trash", false)}
        classes={{
          paper: classes.drawerPaper
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
                          // data-trashID={notebook._id}
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
            <MenuItem onClick={closeTrashMenu}>Info</MenuItem>
            <MenuItem onClick={closeTrashMenu}>Delete</MenuItem>
            <MenuItem onClick={closeTrashMenu}>Favourite</MenuItem>
          </Menu>
        </List>
      </Drawer>
    </div>
  );
}

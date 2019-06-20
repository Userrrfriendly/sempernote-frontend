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
  // TextField,
  // InputAdornment,
  Menu,
  MenuItem
} from "@material-ui/core";

import {
  DeleteSweepRounded,
  // Close,
  ChevronLeft,
  MoreVert
  // StarRounded
} from "@material-ui/icons";
import Context from "../../context/context";
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
  const context = useContext(Context);
  const [open, setOpen] = useState(false);
  const [trash, setTrash] = useState(context.notebooks);

  //closes this drawer if another one is opened
  useEffect(() => {
    console.log("tags useEffect");
    if (props.closed !== TRASH) {
      setOpen(false);
    }
  }, [props.closed]);

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
  // const theme = useTheme();

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  const handleListClick = e => {
    //props.listClick handles listItem selection
    props.listClick();
    handleDrawerOpen();
  };

  const handleTrashNoteClick = trashID => {
    handleDrawerClose();
    context.setNoteFilter(TRASH, trashID);
  };

  useEffect(() => {
    console.log("useEffect from Trash drawer");
    setTrash(context.trash);
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
  }, [context.trash]);

  return (
    <div
      className={classes.root}
      // role="presentation"
      // onClick={handleDrawerClose}
    >
      <Tooltip title="Trash" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={handleListClick}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <DeleteSweepRounded />
          </ListItemIcon>
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        // variant="persistent"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
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

            <IconButton onClick={handleDrawerClose}>
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
                      {/* <ListItemIcon style={{ minWidth: "3rem" }}>
                        <StarRounded
                          style={trashNote.favorite ? { color: "gold" } : {}}
                        />
                      </ListItemIcon> */}
                      <ListItemText
                        primary={trashNote.title}
                        // secondary={numberOfNotes.length + " notes"}
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

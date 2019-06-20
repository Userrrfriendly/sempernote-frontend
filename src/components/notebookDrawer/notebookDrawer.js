import React, { useEffect, useState, useContext, Fragment } from "react";
// import clsx from "clsx";
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
  TextField,
  InputAdornment,
  Menu,
  MenuItem
  // Popover
} from "@material-ui/core";

import {
  LibraryBooksRounded,
  Close,
  ChevronLeft,
  MoreVert,
  StarRounded
  // LibraryAddRounded
} from "@material-ui/icons";
import Context from "../../context/context";
import { NOTEBOOK } from "../../context/activeUItypes";

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

export default function NotebookDrawer(props) {
  const context = useContext(Context);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notebooks, setNotebooks] = useState(context.notebooks);

  //closes this drawer if another one is opened
  useEffect(() => {
    console.log("tags useEffect");
    if (props.closed !== NOTEBOOK) {
      setOpen(false);
    }
  }, [props.closed]);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElID, setAnchorElID] = React.useState(null);

  function handleNotebookMenuClick(event, id) {
    // console.log(event);
    console.log(id);
    setAnchorElID(id);
    setAnchorEl(event.currentTarget);
  }

  function handleNotebookMenuClose(e) {
    console.log(e);
    // console.log(anchorEl); //either extract the value through the data-notebookid
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

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const handleNotebookClick = notebookID => {
    handleDrawerClose();
    context.setActiveNotebook(notebookID);
    context.setNoteFilter(NOTEBOOK, notebookID);
  };

  useEffect(() => {
    console.log("useEffect from Notebook drawer");
    console.log(context.notebooks);
    if (!search) {
      setNotebooks(context.notebooks);
    } else {
      const filteredNotebooks = context.notebooks.filter(notebook =>
        notebook.name.toLowerCase().includes(search.toLowerCase())
      );
      console.log(`searching... for ${search} & found :`);
      console.log(filteredNotebooks);
      setNotebooks(filteredNotebooks);
    }
  }, [search, context.notebooks]);

  return (
    <div
      className={classes.root}
      // role="presentation"
      // onClick={handleDrawerClose}
    >
      <Tooltip title="Notebooks" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={handleListClick}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <LibraryBooksRounded />
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
              Notebooks
            </Typography>

            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </div>
        </div>
        <TextField
          label="Find a notebook"
          className={classes.textField}
          value={search}
          onChange={handleSearch}
          placeholder="Find a notebook"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  // edge="end"
                  size="small"
                  aria-label="clear"
                  onClick={clearSearch}
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Divider />

        <List>
          {notebooks
            ? notebooks.map(notebook => {
                const numberOfNotes = notebook.notes.filter(
                  note => !note.trash
                );
                return (
                  <Fragment key={notebook._id}>
                    <ListItem
                      button
                      onClick={handleNotebookClick.bind(this, notebook._id)}
                    >
                      <ListItemIcon style={{ minWidth: "3rem" }}>
                        <StarRounded
                          style={notebook.favorite ? { color: "gold" } : {}}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={notebook.name}
                        secondary={numberOfNotes.length + " notes"}
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="More"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={e =>
                            handleNotebookMenuClick(e, notebook._id)
                          }
                          // data-notebookid={notebook._id}
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
            onClose={handleNotebookMenuClose}
          >
            <MenuItem onClick={handleNotebookMenuClose}>Info</MenuItem>
            <MenuItem onClick={handleNotebookMenuClose}>Delete</MenuItem>
            <MenuItem onClick={handleNotebookMenuClose}>Favourite</MenuItem>
          </Menu>
        </List>
      </Drawer>
    </div>
  );
}

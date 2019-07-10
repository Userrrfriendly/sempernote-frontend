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
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox
} from "@material-ui/core";

import {
  LibraryBooksRounded,
  Close,
  ChevronLeft,
  MoreVert,
  StarRounded
} from "@material-ui/icons";
import { NOTEBOOK } from "../../context/activeUItypes";
import RenameNotebookDialog from "./renameNotebookDialog";
import DeleteNotebookDialog from "./deleteNotebookDialog";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import { notebookToggleFavoriteReq } from "../../requests/requests";
import {
  NOTEBOOK_TOGGLE_FAVORITE,
  SET_NOTE_FILTER
} from "../../context/rootReducer";
const drawerWidth = 400;

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
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notebooks, setNotebooks] = useState(appState.notebooks);
  // const [renameOpen, setRenameOpen] = useState({open:false,notebook:null});

  //Rename Notebook Dialog
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [dialogTargetNotebook, setDialogTargetNotebook] = React.useState(null);

  function handleClickRename() {
    handleNotebookMenuClose();
    setRenameOpen(true);
    const notebook = appState.notebooks.filter(
      book => book._id === anchorElID
    )[0];
    setDialogTargetNotebook(notebook);
  }

  const handleClickDelete = () => {
    handleNotebookMenuClose();
    setDeleteOpen(true);
    const notebook = appState.notebooks.filter(
      book => book._id === anchorElID
    )[0];
    setDialogTargetNotebook(notebook);
  };

  function handleRenameClose() {
    setRenameOpen(false);
  }

  function handleDeleteClose() {
    setDeleteOpen(false);
  }

  //closes this drawer if another one is opened
  useEffect(() => {
    console.log("Notebook Drawer useEffect");
    if (props.closed !== NOTEBOOK) {
      setOpen(false);
    }
  }, [props.closed]);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElID, setAnchorElID] = React.useState(null);

  function handleNotebookMenuClick(event, id) {
    setAnchorElID(id);
    setAnchorEl(event.currentTarget);
  }

  function handleNotebookMenuClose(e) {
    // console.log(anchorEl); //either extract the value through the data-notebookid
    // console.log(anchorElID); //or get the notebook._id that will be modified from state
    setAnchorEl(null);
    setAnchorElID(null);
  }
  //end menu
  const classes = useStyles();

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

  const handleNotebookClick = (notebookID, e) => {
    if (e.target.type === "checkbox") {
      //executes only if the star icon was clicked:
      const notebook = appState.notebooks.filter(
        book => book._id === notebookID
      )[0];

      notebookToggleFavoriteReq(notebook, appState.token).then(res => {
        console.log(res);
      });
      dispatch({
        type: NOTEBOOK_TOGGLE_FAVORITE,
        notebook: notebook
      });
    } else {
      //default behaviour (if the list item was clicked anywhere except the Star Checkbox or the Menu)
      handleDrawerClose();
      // appState.setActiveNotebook(notebookID);
      // appState.setNoteFilter(NOTEBOOK, notebookID);
      dispatch({
        type: SET_NOTE_FILTER,
        name: NOTEBOOK,
        options: notebookID
      });
    }
  };

  useEffect(() => {
    console.log("useEffect from Notebook drawer");
    if (!search) {
      setNotebooks(appState.notebooks);
    } else {
      const filteredNotebooks = appState.notebooks.filter(notebook =>
        notebook.name.toLowerCase().includes(search.toLowerCase())
      );
      // console.log(`searching... for ${search} & found :`);
      // console.log(filteredNotebooks);
      setNotebooks(filteredNotebooks);
    }
  }, [search, appState.notebooks]);

  return (
    <div className={classes.root}>
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
                        <Checkbox
                          disableRipple
                          checked={notebook.favorite}
                          icon={<StarRounded />}
                          checkedIcon={
                            <StarRounded style={{ color: "gold" }} />
                          }
                          value={notebook.favorite}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={notebook.name}
                        secondary={numberOfNotes.length + " notes"}
                        primaryTypographyProps={
                          //if the notebook name is very long and doesn't contain spaces it is trancated
                          (notebook.name.length > 25 &&
                            notebook.name.indexOf(" ") > 30) ||
                          notebook.name.indexOf(" ") === -1
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
                            handleNotebookMenuClick(e, notebook._id)
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
            : "Loading Notesbooks..."}
          <Menu
            elevation={1}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleNotebookMenuClose}
          >
            <MenuItem onClick={handleNotebookMenuClose}>Info</MenuItem>
            <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
            <MenuItem onClick={handleClickRename}>Rename</MenuItem>
          </Menu>
          <RenameNotebookDialog
            notebook={dialogTargetNotebook}
            open={renameOpen}
            close={handleRenameClose}
            // handleNotebookMenuClose={handleNotebookMenuClose}
          />
          <DeleteNotebookDialog
            notebook={dialogTargetNotebook}
            open={deleteOpen}
            close={handleDeleteClose}
            // closeMenu={handleNotebookMenuClose}
            // handleNotebookMenuClose={handleNotebookMenuClose}
          />
        </List>
      </Drawer>
    </div>
  );
}

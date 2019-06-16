import React, { useEffect, useState, useContext, Fragment } from "react";
// import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// import Drawer from "@material-ui/core/Drawer";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import List from "@material-ui/core/List";
// import Typography from "@material-ui/core/Typography";
// import Divider from "@material-ui/core/Divider";
import {
  IconButton,
  List,
  Divider,
  Drawer,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField,
  InputAdornment
} from "@material-ui/core";
// import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import {
  LibraryBooksRounded,
  Close,
  LibraryAddRounded
} from "@material-ui/icons";
import Context from "../../context/context";

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  // appBar: {
  //   transition: theme.transitions.create(["margin", "width"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen
  //   })
  // },
  // appBarShift: {
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   marginLeft: drawerWidth,
  //   transition: theme.transitions.create(["margin", "width"], {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen
  //   })
  // },
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
    // alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    // justifyContent: "flex-end",
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
  // content: {
  //   flexGrow: 1,
  //   padding: theme.spacing(3),
  //   transition: theme.transitions.create("margin", {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen
  //   }),
  //   marginLeft: -drawerWidth
  // },
  // contentShift: {
  //   transition: theme.transitions.create("margin", {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen
  //   }),
  //   marginLeft: 0
  // }
}));

export default function PersistentDrawerLeft(props) {
  const context = useContext(Context);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notebooks, setNotebooks] = useState(context.notebooks);

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
    const filteredNotes = context.notes.filter(
      note => note.notebook._id === notebookID
    );
    context.setFilteredNotes(filteredNotes);
    //set activeNotebook
    //set filtered notes
    //close modal
  };

  // const createNotebook = () => {
  //   handleDrawerClose();
  //   props.createNotebook();
  // };

  useEffect(() => {
    console.log("useEffect from Notebook drawer");
    console.log(context.notebooks);
    if (!search) {
      setNotebooks(context.notebooks);
    } else {
      const filteredNotebooks = context.notebooks.filter(notebook =>
        notebook.name.includes(search)
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

      {/* <IconButton
        color="inherit"
        aria-label="Open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        className={clsx(classes.menuButton, open && classes.hide)}
      >
        <MenuIcon />
      </IconButton> */}

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

            <IconButton
              onClick={handleDrawerClose}
              // onClick={createNotebook}
            >
              {/* <LibraryAddRounded /> */}
              <ChevronLeftIcon />
            </IconButton>
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
        </div>
        <Divider />

        <List>
          {notebooks
            ? notebooks.map(notebook => (
                <Fragment key={notebook._id}>
                  <ListItem
                    button
                    onClick={handleNotebookClick.bind(this, notebook._id)}
                  >
                    <ListItemIcon>
                      <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary={notebook.name} />
                  </ListItem>
                  <Divider />
                </Fragment>
              ))
            : "Loading Notes..."}
        </List>
      </Drawer>
    </div>
  );
}

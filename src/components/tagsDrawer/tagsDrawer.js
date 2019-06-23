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
} from "@material-ui/core";

import {
  StyleRounded,
  Close,
  ChevronLeft,
  MoreVert,
  StarRounded
  // LibraryAddRounded
} from "@material-ui/icons";
import Context from "../../context/context";
import { TAG } from "../../context/activeUItypes";

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
    // alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    // justifyContent: "flex-end",
    justifyContent: "space-between",
    flexDirection: "column"
    // minHeight: "150px"
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
  },
  fab: {
    margin: "1rem"
  }
}));

const TagDrawer = props => {
  const context = useContext(Context);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(context.tags);

  useEffect(() => {
    console.log("tags useEffect");
    if (props.closed !== TAG) {
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

  function handleNotebookMenuClose(e) {
    console.log(e);
    console.log(anchorElID); //or get the notebook._id that will be modified from state
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
    props.listClick();
    handleDrawerOpen();
  };

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const handleTagClick = tagID => {
    handleDrawerClose();
    context.setNoteFilter("TAG", tagID);
  };

  useEffect(() => {
    console.log("useEffect from Notebook drawer");
    console.log(context.tags);
    if (!search) {
      setTags(context.tags);
    } else {
      const filteredTags = context.tags.filter(tag =>
        tag.tagname.toLowerCase().includes(search.toLowerCase())
      );
      console.log(`searching... for ${search} & found :`);
      console.log(filteredTags);
      setTags(filteredTags);
    }
  }, [search, context.tags]);

  return (
    <div
      className={classes.root}
      // role="presentation"
    >
      <Tooltip title="Tags" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={handleListClick}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <StyleRounded />
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
              TAGS
            </Typography>

            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </div>
        </div>
        <TextField
          label="Find a Tag"
          className={classes.textField}
          value={search}
          onChange={handleSearch}
          placeholder="Find a tag"
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
          {tags
            ? tags.map(tag => {
                const numberOfNotes = tag.notes.filter(note => !note.trash);
                console.log(numberOfNotes);
                return (
                  <Fragment key={tag._id}>
                    <ListItem
                      button
                      onClick={handleTagClick.bind(this, tag._id)}
                    >
                      <ListItemIcon style={{ minWidth: "3rem" }}>
                        <StarRounded
                          style={tag.favorite ? { color: "gold" } : {}}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tag.tagname}
                        secondary={numberOfNotes.length + " notes"}
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="More"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={e => handleNotebookMenuClick(e, tag._id)}
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
};

export default TagDrawer;

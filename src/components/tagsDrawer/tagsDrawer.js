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
  StyleRounded,
  Close,
  ChevronLeft,
  MoreVert,
  StarRounded
} from "@material-ui/icons";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import { TAG } from "../../context/activeUItypes";
import { tagToggleFavoriteReq } from "../../requests/requests";
import {
  TAG_TOGGLE_FAVORITE,
  SET_NOTE_FILTER
} from "../../context/rootReducer";

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
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(appState.tags);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElID, setAnchorElID] = React.useState(null);

  function handleNotebookMenuClick(event, id) {
    console.log(id);
    setAnchorElID(id);
    setAnchorEl(event.currentTarget);
  }

  function closeMenu(e) {
    console.log(anchorElID); //or get the notebook._id that will be modified from state
    setAnchorEl(null);
    setAnchorElID(null);
  }

  const starTag = (tagID, e) => {
    e.stopPropagation();
    const tag = appState.tags.filter(tag => tag._id === tagID)[0];
    //send a request to change toggle the tag
    tagToggleFavoriteReq(tag, appState.token);
    //update appState
    dispatch({
      type: TAG_TOGGLE_FAVORITE,
      tag
    });
  };

  //end menu
  const classes = useStyles();

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const handleTagClick = tagID => {
    props.toggleDrawer();
    dispatch({
      type: SET_NOTE_FILTER,
      name: TAG,
      options: tagID
    });
  };

  useEffect(() => {
    console.log("useEffect from Notebook drawer");
    if (!search) {
      setTags(appState.tags);
    } else {
      const filteredTags = appState.tags.filter(tag =>
        tag.tagname.toLowerCase().includes(search.toLowerCase())
      );
      setTags(filteredTags);
    }
  }, [search, appState.tags]);

  return (
    <div className={classes.root}>
      <Tooltip title="Tags" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={props.toggleDrawer.bind(this, "tags", true)}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <StyleRounded />
          </ListItemIcon>
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.drawerState.tags}
        onClose={props.toggleDrawer.bind(this, "tags", false)}
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

            <IconButton onClick={props.toggleDrawer.bind(this, "tags", false)}>
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
                return (
                  <Fragment key={tag._id}>
                    <ListItem
                      button
                      onClick={handleTagClick.bind(this, tag._id)}
                    >
                      <ListItemIcon style={{ minWidth: "3rem" }}>
                        <Checkbox
                          onClick={starTag.bind(this, tag._id)}
                          disableRipple
                          checked={tag.favorite}
                          icon={<StarRounded />}
                          checkedIcon={
                            <StarRounded style={{ color: "gold" }} />
                          }
                          value={tag.favorite}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tag.tagname}
                        secondary={numberOfNotes.length + " notes"}
                        primaryTypographyProps={
                          //if the  name is very long and doesn't contain spaces it is trancated
                          (tag.tagname.length > 25 &&
                            tag.tagname.indexOf(" ") > 30) ||
                          tag.tagname.indexOf(" ") === -1
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
            onClose={closeMenu}
          >
            <MenuItem onClick={closeMenu}>Info</MenuItem>
            <MenuItem onClick={closeMenu}>Delete</MenuItem>
            {/* <MenuItem onClick={starTag}>Favourite</MenuItem> */}
          </Menu>
        </List>
      </Drawer>
    </div>
  );
};

export default TagDrawer;

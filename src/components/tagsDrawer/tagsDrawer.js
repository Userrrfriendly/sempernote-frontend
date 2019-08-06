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
import RenameTagDialog from "./renameTagDialog";
import DeleteTagDialog from "./deleteTagDialog";
import { useScreenWidth } from "../../helpers/customHooks/useScreenWidth";
import { useScreenHeight } from "../../helpers/customHooks/useScreenHeight";

const TagDrawer = props => {
  const scrWidth600up = useScreenWidth();
  const scrHeight600up = useScreenHeight();

  const drawerWidth = scrWidth600up ? 400 : "75vw";

  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      overflowX: "hidden"
    },
    drawerPaper: {
      width: drawerWidth,
      left: "62px",
      overflowX: "hidden"
    },
    drawerPaperSm: {
      width: drawerWidth,
      left: "0",
      overFlowX: "hidden"
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

  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState(appState.tags);

  //delete tag
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const handleClickDelete = () => {
    closeMenu();
    setDeleteOpen(true);
    const tag = appState.tags.filter(tag => tag._id === anchorElID)[0];
    setDialogTargetTag(tag);
  };
  function handleDeleteClose() {
    setDeleteOpen(false);
  }
  //rename tag
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [dialogTargetTag, setDialogTargetTag] = React.useState(null);
  function handleClickRename() {
    closeMenu();
    setRenameOpen(true);
    const tag = appState.tags.filter(tag => tag._id === anchorElID)[0];
    setDialogTargetTag(tag);
  }
  function handleRenameClose() {
    setRenameOpen(false);
  }

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElID, setAnchorElID] = React.useState(null);

  function handleTagMenuClick(event, id) {
    setAnchorElID(id);
    setAnchorEl(event.currentTarget);
  }

  function closeMenu(e) {
    setAnchorEl(null);
  }
  //end menu

  const starTag = (tagID, e) => {
    e.stopPropagation();
    const tag = appState.tags.filter(tag => tag._id === tagID)[0];
    tagToggleFavoriteReq(tag, appState.token);
    dispatch({
      type: TAG_TOGGLE_FAVORITE,
      tag
    });
  };

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
          {(!scrWidth600up || !scrHeight600up) && (
            <ListItemText primary="Tags" />
          )}
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.drawerState.tags}
        onClose={props.toggleDrawer.bind(this, "tags", false)}
        classes={{
          paper:
            scrWidth600up && scrHeight600up
              ? classes.drawerPaper
              : classes.drawerPaperSm
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
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="More"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={e => handleTagMenuClick(e, tag._id)}
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
            <MenuItem onClick={handleClickRename}>Rename</MenuItem>
            <MenuItem onClick={handleClickDelete}>Delete</MenuItem>
          </Menu>
          <RenameTagDialog
            tag={dialogTargetTag}
            open={renameOpen}
            close={handleRenameClose}
          />
          <DeleteTagDialog
            tag={dialogTargetTag}
            open={deleteOpen}
            close={handleDeleteClose}
          />
        </List>
      </Drawer>
    </div>
  );
};

export default TagDrawer;

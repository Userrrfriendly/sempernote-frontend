import React, { useEffect, useState, useContext, Fragment } from "react";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Delta from "quill-delta";

// import { truncate as _truncate } from "lodash";

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
  ListItemSecondaryAction
  // useMediaQuery
  // TextField,
  // InputAdornment
} from "@material-ui/core";

import {
  ChevronLeft,
  StarRounded,
  DescriptionRounded,
  LibraryBooksRounded,
  StyleRounded,
  RemoveCircleRounded
} from "@material-ui/icons";
import Context from "../../context/context";
import { NOTEBOOK, NOTES, TAG, FAVORITES } from "../../context/activeUItypes";

import { deltaToPlainText } from "../../helpers/helpers";

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
    flexShrink: 0,
    overflowX: "hidden"
  },
  drawerPaper: {
    width: drawerWidth,
    left: "62px",
    overflowX: "hidden"
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
  },
  listItemTextTypography: {
    marginRight: "1.25rem"
  }
  // secondaryTypography: {
  //   marginRight: "1.25rem"
  // }
}));

const FavoritesDrawer = props => {
  const context = useContext(Context);

  const initialState = () => {
    const notes = context.notes
      ? context.notes.filter(note => note.favorite === true)
      : [];
    const notebooks = context.notebooks
      ? context.notebooks.filter(book => book.favorite === true)
      : [];
    const tags = context.tags
      ? context.tags.filter(tag => tag.favorite === true)
      : [];
    return notes.concat(notebooks, tags);
  };

  const [open, setOpen] = useState(false);
  const [hoveredItemID, setHoveredItemID] = useState(false);
  const [results, setResults] = useState(initialState());
  const classes = useStyles();

  const removeFavorite = (result, resultType, e) => {
    e.stopPropagation();
    switch (resultType) {
      case TAG:
        context.tagToggleFavorite(result);
        break;
      case NOTEBOOK:
        context.notebookToggleFavorite(result);
        break;
      case NOTES:
        context.noteToggleFavorite(result);
        break;
      default:
        break;
    }
  };
  // const matches = useMediaQuery('(min-width:600px)');
  const hoverIn = id => {
    setHoveredItemID(id);
  };

  const hoverOut = e => {
    setHoveredItemID(null);
  };

  useEffect(() => {
    console.log("tags useEffect");
    if (props.closed !== FAVORITES) {
      setOpen(false);
    }
  }, [props.closed]);

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

  const previewText = str => {
    const parsedDelta = new Delta(JSON.parse(str));
    let plainText = deltaToPlainText(parsedDelta);
    if (plainText.length > 100) {
      return plainText.slice(0, 100).concat("...");
    }
    return plainText;
  };

  const handleFavoriteClick = (resultID, resultType, e) => {
    // console.log(e.target.type);
    // if (
    //   e.target.type === "button" ||
    //   e.target.type === "path" ||
    //   e.target.type === "svg"
    // ) {
    //   console.log("this is WROOOOOOOOOOOOOOOONG!!!!!!!!!!!!!!!!!!!!!");
    //   //executes only if the star icon was clicked:
    // } else {
    //default behaviour (if the list item was clicked anywhere except the remove buton)
    handleDrawerClose();
    // Tag
    switch (resultType) {
      case TAG:
        context.setNoteFilter(TAG, resultID);
        break;
      case NOTEBOOK:
        context.setActiveNotebook(resultID);
        context.setNoteFilter(NOTEBOOK, resultID);
        break;
      case NOTES:
        context.setNoteFilter(NOTES);
        context.setActiveNote(resultID);
        let path = `/main/editor`;
        props.history.push(path);
        break;
      default:
        break;
    }
    // }
  };

  //determines if the result is a tag,notebook or note
  const resultType = result => {
    if (result.hasOwnProperty("name")) return NOTEBOOK;
    if (result.hasOwnProperty("tagname")) return TAG;
    if (result.hasOwnProperty("title")) return NOTES;
  };

  useEffect(() => {
    console.log("useEffect from Favorites drawer");
    const notes = context.notes
      ? context.notes.filter(note => note.favorite === true)
      : [];
    const notebooks = context.notebooks
      ? context.notebooks.filter(book => book.favorite === true)
      : [];
    const tags = context.tags
      ? context.tags.filter(tag => tag.favorite === true)
      : [];
    setResults(notes.concat(notebooks, tags));
  }, [context.tags, context.notebooks, context.notes]);

  return (
    <div
      className={classes.root}
      // role="presentation"
    >
      <Tooltip title="Favorites" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={handleListClick}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <StarRounded />
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
              Favorites
            </Typography>

            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </div>
        </div>

        <Divider />

        <List>
          {results
            ? results.map(result => {
                return (
                  <Fragment key={result._id}>
                    <ListItem
                      button
                      onMouseEnter={hoverIn.bind(this, result._id)}
                      onMouseLeave={hoverOut.bind(this, result._id)}
                      onClick={handleFavoriteClick.bind(
                        this,
                        result._id,
                        resultType(result)
                      )}
                    >
                      {result.tagname && (
                        <>
                          <ListItemIcon style={{ minWidth: "3rem" }}>
                            <StyleRounded />
                          </ListItemIcon>
                          <ListItemText
                            primary={result.tagname}
                            secondary={
                              result.notes.filter(note => !note.trash).length +
                              " notes"
                            }
                            primaryTypographyProps={
                              //if the  name is very long and doesn't contain spaces it is trancated
                              (result.tagname.length > 25 &&
                                result.tagname.indexOf(" ") > 30) ||
                              result.tagname.indexOf(" ") === -1
                                ? {
                                    noWrap: true,
                                    component: "p"
                                  }
                                : {}
                            }
                            classes={{
                              primary: classes.listItemTextTypography
                            }}
                          />
                          {hoveredItemID === result._id && (
                            <ListItemSecondaryAction>
                              <Tooltip
                                title="Remove from Favorites"
                                placement="right"
                              >
                                <IconButton
                                  edge="end"
                                  aria-label="More"
                                  aria-controls="long-menu"
                                  aria-haspopup="false"
                                  onClick={removeFavorite.bind(
                                    this,
                                    result._id,
                                    resultType(result)
                                  )}

                                  // data-notebookid={notebook._id}
                                >
                                  <RemoveCircleRounded />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          )}
                        </>
                      )}
                      {/* NOTEBOOKSS: */}
                      {result.name && (
                        <>
                          <ListItemIcon style={{ minWidth: "3rem" }}>
                            <LibraryBooksRounded />
                          </ListItemIcon>
                          <ListItemText
                            primary={result.name}
                            secondary={
                              result.notes.filter(note => !note.trash).length +
                              " notes"
                            }
                            primaryTypographyProps={
                              //if the  name is very long and doesn't contain spaces it is trancated
                              (result.name.length > 25 &&
                                result.name.indexOf(" ") > 30) ||
                              result.name.indexOf(" ") === -1
                                ? {
                                    noWrap: true,
                                    component: "p"
                                  }
                                : {}
                            }
                            classes={{
                              primary: classes.listItemTextTypography
                            }}
                          />
                          {hoveredItemID === result._id && (
                            <ListItemSecondaryAction>
                              <Tooltip
                                title="Remove from Favorites"
                                placement="right"
                              >
                                <IconButton
                                  edge="end"
                                  aria-label="More"
                                  aria-controls="long-menu"
                                  aria-haspopup="false"
                                  onClick={removeFavorite.bind(
                                    this,
                                    result._id,
                                    resultType(result)
                                  )}

                                  // data-notebookid={notebook._id}
                                >
                                  <RemoveCircleRounded />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          )}
                        </>
                      )}
                      {/* NOTES: */}
                      {result.title && (
                        <>
                          <ListItemIcon style={{ minWidth: "3rem" }}>
                            <DescriptionRounded />
                          </ListItemIcon>
                          <ListItemText
                            classes={{
                              primary: classes.listItemTextTypography,
                              secondary: classes.listItemTextTypography
                            }}
                            primaryTypographyProps={
                              //if the note name is very long and doesn't contain spaces it is trancated
                              (result.title.length > 25 &&
                                result.title.indexOf(" ") > 30) ||
                              result.title.indexOf(" ") === -1
                                ? {
                                    noWrap: true,
                                    component: "p"
                                  }
                                : {}
                            }
                            secondaryTypographyProps={{
                              noWrap: true
                            }}
                            primary={result.title}
                            secondary={previewText(result.body)}
                          />
                          {hoveredItemID === result._id && (
                            <ListItemSecondaryAction>
                              <Tooltip
                                title="Remove from Favorites"
                                placement="right"
                              >
                                <IconButton
                                  edge="end"
                                  aria-label="More"
                                  aria-controls="long-menu"
                                  aria-haspopup="false"
                                  onClick={removeFavorite.bind(
                                    this,
                                    result,
                                    resultType(result)
                                  )}

                                  // data-notebookid={notebook._id}
                                >
                                  <RemoveCircleRounded />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          )}
                        </>
                      )}
                    </ListItem>
                    <Divider />
                  </Fragment>
                );
              })
            : "Loading Results..."}
          {results.length === 0 && (
            <Typography variant="body2" gutterBottom style={{ margin: "1rem" }}>
              Nothing in favorites...
            </Typography>
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default withRouter(FavoritesDrawer);

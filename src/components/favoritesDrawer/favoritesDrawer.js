import React, { useEffect, useState, useContext, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Delta from "quill-delta";
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
  Typography,
  ListItemSecondaryAction
} from "@material-ui/core";
import {
  ChevronLeft,
  StarRounded,
  DescriptionRounded,
  LibraryBooksRounded,
  StyleRounded
  // RemoveCircleRounded
} from "@material-ui/icons";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import { NOTEBOOK, NOTES, TAG } from "../../context/activeUItypes";
import {
  notebookToggleFavoriteReq,
  tagToggleFavoriteReq,
  noteFavoriteFalseReq
} from "../../requests/requests";
import {
  NOTEBOOK_TOGGLE_FAVORITE,
  TAG_TOGGLE_FAVORITE,
  SET_NOTE_FILTER,
  NOTE_REMOVE_FAVORITE,
  SET_ACTIVE_NOTE
} from "../../context/rootReducer";
import { deltaToPlainText } from "../../helpers/helpers";
import { useScreenWidth } from "../../helpers/customHooks/useScreenWidth";
import { useScreenHeight } from "../../helpers/customHooks/useScreenHeight";

const FavoritesDrawer = props => {
  const scrWidth600up = useScreenWidth();
  const scrHeight600up = useScreenHeight();

  const drawerWidth = scrWidth600up ? 400 : "75vw";
  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    list_item: {
      marginBottom: scrWidth600up ? "1rem" : "0.25rem"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth,
      left: "62px",
      overflowX: "hidden"
    },
    drawerPaperSm: {
      width: drawerWidth,
      left: 0,
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
    listItemTextTypography: {
      marginRight: "1.25rem"
    }
  }));

  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const initialState = () => {
    const notes = appState.notes
      ? appState.notes.filter(note => note.favorite === true)
      : [];
    const notebooks = appState.notebooks
      ? appState.notebooks.filter(book => book.favorite === true)
      : [];
    const tags = appState.tags
      ? appState.tags.filter(tag => tag.favorite === true)
      : [];
    return notes.concat(notebooks, tags);
  };

  // const [hoveredItemID, setHoveredItemID] = useState(false);
  const [results, setResults] = useState(initialState());
  const classes = useStyles();

  const removeFavorite = (result, resultType, e) => {
    e.stopPropagation();
    switch (resultType) {
      case TAG:
        const tag = appState.tags.filter(tag => tag._id === result)[0];
        tagToggleFavoriteReq(tag, appState.token);
        dispatch({
          type: TAG_TOGGLE_FAVORITE,
          tag
        });
        break;
      case NOTEBOOK:
        const notebook = appState.notebooks.filter(
          book => book._id === result
        )[0];
        notebookToggleFavoriteReq(notebook, appState.token).then(res => {
          console.log(res);
        });
        dispatch({
          type: NOTEBOOK_TOGGLE_FAVORITE,
          notebook: notebook
        });
        break;
      case NOTES:
        noteFavoriteFalseReq(result, appState.token);
        dispatch({
          type: NOTE_REMOVE_FAVORITE,
          note: result
        });
        break;
      default:
        break;
    }
  };
  // const matches = useMediaQuery('(min-width:600px)');
  // const hoverIn = id => {
  //   setHoveredItemID(id);
  // };

  // const hoverOut = e => {
  //   setHoveredItemID(null);
  // };

  const previewText = str => {
    const parsedDelta = new Delta(JSON.parse(str));
    let plainText = deltaToPlainText(parsedDelta);
    if (plainText.length > 100) {
      return plainText.slice(0, 100).concat("...");
    }
    return plainText;
  };

  const handleFavoriteClick = (resultID, resultType, e) => {
    //default behaviour (if the list item was clicked anywhere except the remove buton)
    props.toggleDrawer(); //closes the drawer on click
    switch (resultType) {
      case TAG:
        dispatch({
          type: SET_NOTE_FILTER,
          name: TAG,
          options: resultID
        });
        break;
      case NOTEBOOK:
        dispatch({
          type: SET_NOTE_FILTER,
          name: NOTEBOOK,
          options: resultID
        });
        break;
      case NOTES:
        dispatch({
          type: SET_NOTE_FILTER,
          name: NOTES
        });
        dispatch({
          type: SET_ACTIVE_NOTE,
          _id: resultID
        });
        let path = `/main/editor`;
        props.history.push(path);
        break;
      default:
        break;
    }
  };

  //determines if the result is a tag,notebook or note
  const resultType = result => {
    if (result.hasOwnProperty("name")) return NOTEBOOK;
    if (result.hasOwnProperty("tagname")) return TAG;
    if (result.hasOwnProperty("title")) return NOTES;
  };

  useEffect(() => {
    console.log("useEffect from Favorites drawer");
    const notes = appState.notes
      ? appState.notes.filter(note => note.favorite === true)
      : [];
    const notebooks = appState.notebooks
      ? appState.notebooks.filter(book => book.favorite === true)
      : [];
    const tags = appState.tags
      ? appState.tags.filter(tag => tag.favorite === true)
      : [];
    setResults(notes.concat(notebooks, tags));
  }, [appState.tags, appState.notebooks, appState.notes]);

  return (
    <div className={classes.root}>
      <Tooltip title="Favorites" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={props.toggleDrawer.bind(this, "favorites", true)}
        >
          <ListItemIcon>
            <StarRounded />
          </ListItemIcon>
          {(!scrWidth600up || !scrHeight600up) && (
            <ListItemText primary="Favorites" />
          )}
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.drawerState.favorites}
        onClose={props.toggleDrawer.bind(this, "favorites", false)}
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
              Favorites
            </Typography>

            <IconButton
              onClick={props.toggleDrawer.bind(this, "favorites", false)}
            >
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
                      // onMouseEnter={hoverIn.bind(this, result._id)}
                      // onMouseLeave={hoverOut.bind(this, result._id)}
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
                              >
                                {/* <RemoveCircleRounded
                                  style={{ color: "#7b0303" }}
                                /> */}
                                <StarRounded style={{ color: "gold" }} />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
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
                              >
                                {/* <RemoveCircleRounded /> */}
                                <StarRounded style={{ color: "gold" }} />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
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
                              >
                                <StarRounded style={{ color: "gold" }} />
                                {/* <RemoveCircleRounded
                                  style={{ color: "#7b0303" }}
                                /> */}
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
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
